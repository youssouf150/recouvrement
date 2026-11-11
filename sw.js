const C='recouvrement-v3';
const HOSTS=['cdn.tailwindcss.com','cdn.jsdelivr.net','www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(['./','index.html','app.jsx','manifest.json','icon-192.png','icon-512.png'].map(u=>c.add(u).catch(()=>{})))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!(u.origin===location.origin||HOSTS.includes(u.hostname)))return;
  e.respondWith(caches.open(C).then(async c=>{
    const m=await c.match(e.request);
    if(u.origin===location.origin){
      try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}
      catch(x){return m||Response.error()}
    }
    if(m)return m;
    const r=await fetch(e.request);
    if(r.ok||r.type==='opaque')c.put(e.request,r.clone());
    return r;
  }));
});
