/* DehomYar v11 — local study desk + command palette */
(function(){
  'use strict';
  const KEY='dy11-study-desk';
  const safeRead=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {tasks:Array.isArray(x.tasks)?x.tasks:[],sessions:Number(x.sessions)||0}}catch(_){return {tasks:[],sessions:0}}};
  let state=safeRead(),seconds=25*60,initial=25*60,mode='focus',tick=null;
  const $=id=>document.getElementById(id);
  const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}};
  const notify=msg=>{if(typeof window.toast==='function')window.toast(msg);else{const t=$('ts');if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}}};
  const fmt=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
  function renderTasks(){
    const list=$('dy11Tasks');if(!list)return;
    list.innerHTML='';
    if(!state.tasks.length){const empty=document.createElement('div');empty.className='dy11-muted';empty.textContent='هنوز کاری اضافه نکردی؛ اولین کار کوچکت رو بنویس 🙂';list.appendChild(empty)}
    state.tasks.forEach((task,index)=>{
      const row=document.createElement('div');row.className='dy11-task'+(task.done?' done':'');
      const check=document.createElement('input');check.type='checkbox';check.checked=!!task.done;check.setAttribute('aria-label','انجام شد');
      check.addEventListener('change',()=>{state.tasks[index].done=check.checked;persist();renderTasks();renderProgress()});
      const label=document.createElement('span');label.className='dy11-task-text';label.textContent=task.text;
      const del=document.createElement('button');del.type='button';del.className='dy11-icon-btn';del.textContent='×';del.title='حذف کار';del.setAttribute('aria-label','حذف '+task.text);
      del.addEventListener('click',()=>{state.tasks.splice(index,1);persist();renderTasks();renderProgress()});
      row.append(check,label,del);list.appendChild(row);
    });
  }
  function renderProgress(){
    const total=state.tasks.length,done=state.tasks.filter(x=>x.done).length;
    const n=$('dy11TaskCount');if(n)n.textContent=done+' از '+total+' کار';
    const p=$('dy11TaskProgress');if(p)p.style.width=(total?done/total*100:0)+'%';
    const s=$('dy11Sessions');if(s)s.textContent=state.sessions;
  }
  function renderTimer(){
    const t=$('dy11Timer');if(t)t.textContent=fmt(seconds);
    const p=$('dy11TimerProgress');if(p)p.style.width=((initial-seconds)/initial*100)+'%';
    const b=$('dy11Start');if(b)b.textContent=tick?'⏸ مکث':'▶ شروع';
    const m=$('dy11Mode');if(m)m.textContent=mode==='focus'?'زمان تمرکز':'زمان استراحت';
    const title=$('dy11TimerTitle');if(title)title.textContent=mode==='focus'?'یک بازه‌ی کوچک، یک قدم جلوتر':'استراحت کوتاه هم بخشی از یادگیریه';
  }
  function stopTimer(){if(tick){clearInterval(tick);tick=null}renderTimer()}
  function switchMode(next){stopTimer();mode=next;initial=seconds=next==='focus'?25*60:5*60;renderTimer()}
  function startTimer(){if(tick){stopTimer();return}tick=setInterval(()=>{seconds--;renderTimer();if(seconds<=0){stopTimer();if(mode==='focus'){state.sessions++;persist();renderProgress();notify('آفرین! یک بازه تمرکز کامل شد 🎉');switchMode('break')}else{notify('استراحت تموم شد؛ آماده‌ای؟');switchMode('focus')}}},1000);renderTimer()}
  function addTask(){
    const input=$('dy11TaskInput'),text=(input&&input.value||'').trim();
    if(!text){if(input)input.focus();return}
    if(state.tasks.length>=40){notify('برای اینکه فهرست جمع‌وجور بمونه، حداکثر ۴۰ کار نگه می‌داریم.');return}
    state.tasks.push({text:text.slice(0,180),done:false,createdAt:Date.now()});persist();if(input){input.value='';input.focus()}renderTasks();renderProgress();
  }
  function mountFocus(){
    const home=$('home');if(!home||$('dy11Focus'))return;
    const card=document.createElement('div');card.className='card';card.id='dy11Focus';
    card.innerHTML='<div class="dy11-focus-head"><div><div class="dy11-kicker">میز مطالعه · نسخه ۱۱</div><div class="dy11-focus-title">امروز رو با یک قدم شروع کن ✨</div><div class="dy11-muted">فهرست کارها فقط روی همین دستگاه ذخیره می‌شود.</div></div><div class="dy11-muted" id="dy11TaskCount">۰ از ۰ کار</div></div><div class="dy11-focus-layout"><div class="dy11-timer-box"><div class="dy11-kicker" id="dy11Mode">زمان تمرکز</div><div class="dy11-timer" id="dy11Timer" aria-live="polite">25:00</div><div class="dy11-muted" id="dy11TimerTitle">یک بازه‌ی کوچک، یک قدم جلوتر</div><div class="dy11-timer-track"><i id="dy11TimerProgress"></i></div><div class="v6-actions"><button type="button" class="btn" id="dy11Start">▶ شروع</button><button type="button" class="btn s" id="dy11Reset">↺ شروع دوباره</button><button type="button" class="btn s" id="dy11Break">☕ استراحت ۵ دقیقه‌ای</button></div><div class="dy11-muted" style="margin-top:10px">بازه‌های کامل‌شده: <b id="dy11Sessions">۰</b></div></div><div><div class="hd"><h3 style="margin:0">چک‌لیست امروز</h3><span class="dy11-muted">قابل‌ویرایش</span></div><div class="dy11-timer-track"><i id="dy11TaskProgress"></i></div><div class="dy11-task-list" id="dy11Tasks"></div><form class="dy11-add-row" id="dy11TaskForm"><input id="dy11TaskInput" maxlength="180" autocomplete="off" placeholder="مثلاً ۱۰ تست ریاضی حل کنم"><button class="btn" type="submit">＋ افزودن</button></form><div class="dy11-muted" style="margin-top:7px">میان‌بر: <span class="dy11-kbd">Ctrl</span> + <span class="dy11-kbd">K</span> برای رفتن سریع به ابزارها.</div></div></div>';
    const search=$('gs')&&$('gs').closest('.card');
    if(search)home.insertBefore(card,search);else home.appendChild(card);
    $('dy11Start').addEventListener('click',startTimer);
    $('dy11Reset').addEventListener('click',()=>{stopTimer();initial=seconds=mode==='focus'?25*60:5*60;renderTimer()});
    $('dy11Break').addEventListener('click',()=>switchMode('break'));
    $('dy11TaskForm').addEventListener('submit',e=>{e.preventDefault();addTask()});
    renderTasks();renderProgress();renderTimer();
  }
  const pageNames=()=>Array.from(document.querySelectorAll('.page')).map(p=>({id:p.id,title:(p.querySelector('h1')?.textContent||p.id).trim()}));
  function mountCommands(){
    if($('dy11Command'))return;
    const overlay=document.createElement('div');overlay.className='dy11-command-overlay';overlay.id='dy11Command';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','جست‌وجوی سریع');
    overlay.innerHTML='<div class="dy11-command-box"><div class="dy11-muted">جست‌وجوی سریع در دهم‌یار</div><input id="dy11CommandInput" placeholder="نام درس یا ابزار را بنویس…" autocomplete="off"><div class="dy11-command-list" id="dy11CommandList"></div><div class="dy11-muted" style="padding:8px 10px">برای بستن <span class="dy11-kbd">Esc</span> را بزن.</div></div>';
    document.body.appendChild(overlay);
    const bar=document.querySelector('.bar');
    if(bar){const b=document.createElement('button');b.type='button';b.id='dy11CommandBtn';b.className='btn s';b.innerHTML='⌕ جست‌وجوی سریع <span class="dy11-kbd">Ctrl K</span>';b.addEventListener('click',openCommands);bar.appendChild(b)}
    const input=$('dy11CommandInput');
    function render(q){
      const query=(q||'').trim().toLocaleLowerCase('fa');
      const items=pageNames().filter(x=>(x.title+' '+x.id).toLocaleLowerCase('fa').includes(query)).slice(0,14);
      const list=$('dy11CommandList');list.innerHTML='';
      if(!items.length){const empty=document.createElement('div');empty.className='dy11-muted';empty.style.padding='14px';empty.textContent='چیزی پیدا نشد.';list.appendChild(empty);return}
      items.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='dy11-command-item';const label=document.createElement('span');label.textContent=item.title;const hint=document.createElement('small');hint.textContent='باز کردن صفحه';b.append(label,hint);b.addEventListener('click',()=>{overlay.classList.remove('open');if(typeof window.go==='function')window.go(item.id)});list.appendChild(b)});
    }
    input.addEventListener('input',()=>render(input.value));
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=$('dy11CommandList').querySelector('button');if(first)first.click()}if(e.key==='Escape')closeCommands()});
    overlay.addEventListener('click',e=>{if(e.target===overlay)closeCommands()});
    window.openDehomyarQuickSearch=openCommands;
    function openCommands(){overlay.classList.add('open');input.value='';render('');setTimeout(()=>input.focus(),20)}
    function closeCommands(){overlay.classList.remove('open')}
    window.closeDehomyarQuickSearch=closeCommands;
  }
  function shortcuts(){
    document.addEventListener('keydown',e=>{
      const tag=(e.target&&e.target.tagName||'').toLowerCase(),typing=['input','textarea','select'].includes(tag)||e.target?.isContentEditable;
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();window.openDehomyarQuickSearch&&window.openDehomyarQuickSearch();return}
      if(e.key==='Escape'&&$('dy11Command')?.classList.contains('open')){window.closeDehomyarQuickSearch&&window.closeDehomyarQuickSearch();return}
      if(!typing&&e.key==='/'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();window.openDehomyarQuickSearch&&window.openDehomyarQuickSearch()}
    });
  }
  function run(){
    mountFocus();mountCommands();shortcuts();
    const current=$('dt');if(current&&!current.dataset.dy11){current.dataset.dy11='1';current.title='زمان محلی دستگاه'}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();