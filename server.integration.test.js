'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');

const ROOT = __dirname;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'dahomyar-qa-'));
const ADMIN_USER = 'audit-admin';
const ADMIN_PASSWORD = 'audit-password-12345';
const PNG_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/N5sAAAAASUVORK5CYII=';

async function freePort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const port = s.address().port;
      s.close(err => err ? reject(err) : resolve(port));
    });
  });
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startServer(port) {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), DATA_DIR, ADMIN_USER, ADMIN_PASSWORD },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let logs = '';
  child.stdout.on('data', b => { logs += b.toString(); });
  child.stderr.on('data', b => { logs += b.toString(); });
  const base = 'http://127.0.0.1:' + port;
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error('Server exited early:\n' + logs);
    try {
      const r = await fetch(base + '/api/update', { signal: AbortSignal.timeout(500) });
      if (r.ok) return { child, base, logs: () => logs };
    } catch {}
    await sleep(100);
  }
  child.kill('SIGTERM');
  throw new Error('Server did not become ready:\n' + logs);
}
async function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  const exited = new Promise(resolve => child.once('exit', resolve));
  child.kill('SIGTERM');
  await Promise.race([exited, sleep(3000)]);
  if (child.exitCode === null) child.kill('SIGKILL');
}
async function request(base, endpoint, options = {}) {
  const headers = {};
  if (options.token) headers.Authorization = 'Bearer ' + options.token;
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + endpoint, {
    method: options.method || 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(3000)
  });
  const data = await response.json().catch(() => ({}));
  return { status: response.status, data, response };
}

async function run() {
  const port = await freePort();
  let app = await startServer(port);
  try {
    const adminLogin = await request(app.base, '/api/admin/login', {
      method: 'POST', body: { username: ADMIN_USER, password: ADMIN_PASSWORD }
    });
    assert.equal(adminLogin.status, 200, 'admin can log in in isolated test environment');
    const adminToken = adminLogin.data.token;
    assert.ok(adminToken);

    const unauthAdmin = await request(app.base, '/api/admin/class-codes');
    assert.equal(unauthAdmin.status, 401, 'admin-only endpoint rejects anonymous requests');

    const codeResult = await request(app.base, '/api/admin/class-codes', {
      method: 'POST', token: adminToken, body: { classId: '103' }
    });
    assert.equal(codeResult.status, 201, 'admin can create a representative code');
    assert.ok(codeResult.data.code);

    const repLogin = await request(app.base, '/api/class/representative/login', {
      method: 'POST', body: { classId: '103', code: codeResult.data.code }
    });
    assert.equal(repLogin.status, 200, 'class 103 representative can log in');
    const repToken = repLogin.data.token;

    const student103 = await request(app.base, '/api/account/register', {
      method: 'POST',
      body: { name: 'QA Student 103', username: 'qa_student_103', password: 'qa-password-103', classId: '103' }
    });
    assert.equal(student103.status, 201);
    assert.ok(student103.data.token);

    const student101 = await request(app.base, '/api/account/register', {
      method: 'POST',
      body: { name: 'QA Student 101', username: 'qa_student_101', password: 'qa-password-101', classId: '101' }
    });
    assert.equal(student101.status, 201);
    const token101 = student101.data.token;

    const noSession = await request(app.base, '/api/class/homework');
    assert.equal(noSession.status, 401, 'private homework requires authentication');

    const created = await request(app.base, '/api/class/homework', {
      method: 'POST',
      token: repToken,
      body: {
        title: 'آزمون پایدار کلاس ۱۰۳',
        subject: 'ریاضی',
        body: 'سطر اول توضیحات\nسطر دوم توضیحات',
        date: '2099-12-31',
        file: { name: 'qa.png', type: 'image/png', data: PNG_DATA }
      }
    });
    assert.equal(created.status, 201, 'valid PNG attachment and assignment should save; got ' + created.status + ': ' + JSON.stringify(created.data));
    const id = created.data.item.id;
    assert.equal(created.data.item.classId, '103');
    assert.ok(created.data.item.file);

    const hw103 = await request(app.base, '/api/class/homework', { token: student103.data.token });
    assert.equal(hw103.status, 200);
    assert.ok(hw103.data.items.some(x => x.id === id), 'class 103 student sees the assignment');
    const assignment = hw103.data.items.find(x => x.id === id);
    assert.match(assignment.body, /سطر اول توضیحات\nسطر دوم توضیحات/);

    const attachment = await fetch(app.base + assignment.file, { signal: AbortSignal.timeout(3000) });
    assert.equal(attachment.status, 200, 'saved attachment is retrievable');
    assert.equal(attachment.headers.get('x-content-type-options'), 'nosniff');
    assert.ok((await attachment.arrayBuffer()).byteLength > 8);

    const hw101 = await request(app.base, '/api/class/homework', { token: token101 });
    assert.equal(hw101.status, 200);
    assert.ok(!hw101.data.items.some(x => x.id === id), 'class 101 cannot see class 103 homework');

    const crossClass = await request(app.base, '/api/class/homework?classId=103', { token: token101 });
    assert.equal(crossClass.status, 403, 'class 101 cannot query class 103 private homework');

    const publicLegacy = await request(app.base, '/api/homework?classId=all');
    assert.equal(publicLegacy.status, 200);
    assert.ok(!publicLegacy.data.items.some(x => x.id === id), 'class-specific homework is excluded from public homework feed');

    await stopServer(app.child);
    app = await startServer(port);
    const loginAfterRestart = await request(app.base, '/api/account/login', {
      method: 'POST',
      body: { username: 'qa_student_103', password: 'qa-password-103' }
    });
    assert.equal(loginAfterRestart.status, 200, 'account survives server restart');
    const afterRestart = await request(app.base, '/api/class/homework', { token: loginAfterRestart.data.token });
    assert.equal(afterRestart.status, 200);
    assert.ok(afterRestart.data.items.some(x => x.id === id), 'assignment survives server restart with persistent DATA_DIR');
    const persistedFile = afterRestart.data.items.find(x => x.id === id).file;
    const fileAfterRestart = await fetch(app.base + persistedFile, { signal: AbortSignal.timeout(3000) });
    assert.equal(fileAfterRestart.status, 200, 'attachment survives server restart');

    console.log('DAHOMYAR server integration tests passed: auth, class isolation, homework write/read, attachment, public-feed isolation, and restart persistence.');
  } finally {
    if (app && app.child) await stopServer(app.child);
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
  }
}
run().catch(err => {
  console.error('DAHOMYAR server integration tests failed:', err);
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
  process.exitCode = 1;
});
