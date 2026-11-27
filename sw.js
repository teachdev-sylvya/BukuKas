// Penyimpan offline sederhana untuk Buku Kas Devy.
const C='bukukas-devy-v10';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-96.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.origin!==location.origin)return;
  if(req.mode==='navigate'||u.pathname.endsWith('.json')){
    e.respondWith(fetch(req.mode==='navigate'?req.url:req,{cache:'no-cache',credentials:'same-origin'})
      .then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req.mode==='navigate'?'index.html':req,cp));return r})
      .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));return res})));
});
