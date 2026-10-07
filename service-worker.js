const CACHE_NAME='dehomyar-static-v9-0.1.0';
const CORE=['./','./index.html','./manifest.json','./service-worker.js','./offline.html','./icons/icon-192.png','./icons/icon-512.png','./ai-ui.css','./ai-ui.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME&&k.startsWith('dehomyar-static-v9-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.startsWith('/api/')){event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>new Response(JSON.stringify({error:'offline'}),{status:503,headers:{'Content-Type':'application/json'}})));return}
 event.respondWith(caches.match(req).then(cached=>{
   const network=fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,clone))}return res}).catch(()=>cached||new Response('آفلاین — این صفحه هنوز در کش ذخیره نشده است.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}}));
   return cached||network;
 }));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
