/* Page changes WITHOUT reloading, so the music plays straight through.

   Every page is still a real page with its own address (Google, shared links,
   the back button all work as before). When a visitor taps a link to another
   page of THIS site, we fetch that page and swap the body in place. Anything
   marked data-keep (the <audio>, the music button) is never touched, so the
   song keeps going. The browser never unloads, which is also the only way the
   music survives on iPhone, where a new page cannot start sound by itself.

   A page opts in with <body data-swap>. A page without it (the portal, a
   different "room" with its own styles) loads the normal way; music.js then
   picks the song up where it left off.

   Anything that goes wrong falls back to a normal page load. Reusable: nothing
   here knows about Clare Homes except window.CH_SITE_INIT (site.js), the page-script
   hook, and window.CH_MUSIC_LEAVE (the music block). Ported from the Van Alan site. */
(function(){
  if(!window.fetch||!window.DOMParser||!history.pushState||!document.body.hasAttribute('data-swap')) return;
  var busy=false, shown=null;
  try{ history.scrollRestoration='manual' }catch(e){}
  history.replaceState({nav:1,y:scrollY},'',location.href);

  function samePage(u){ return norm(u.pathname)===norm(location.pathname)&&u.search===location.search }
  function norm(p){ return p.replace(/index\.html$/,'').replace(/\.html$/,'') || '/' }
  shown=norm(location.pathname);

  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a) return;
    if(a.target&&a.target!=='_self'||a.hasAttribute('download')) return;
    var u; try{ u=new URL(a.href,location.href) }catch(err){ return }
    /* data-hard: a page we KNOW loads the normal way (the portal). Start the
       music fade inside this tap; iPhone only allows it here. */
    if(a.hasAttribute('data-hard')){ if(u.origin===location.origin){ e.preventDefault(); hard(u.href) } return }
    if(u.origin!==location.origin||!/^https?:$/.test(u.protocol)) return;
    if(/\.(jpe?g|png|pdf|m4a|mp3|zip)$/i.test(u.pathname)) return;
    if(samePage(u)) return;   /* #anchors on this page: the browser already does that */
    e.preventDefault();
    go(u.href,true);
  });

  /* Back/forward. A #section jump on one page also makes a history entry (with
     no state), so decide by WHICH PAGE the address is, not by the state. */
  addEventListener('popstate',function(e){
    if(norm(location.pathname)===shown) return;
    go(location.href,false,(e.state&&e.state.y)||0);
  });

  /* A page that can't be swapped in (the portal has no music): fade the song
     out softly first instead of cutting it. */
  function hard(url){
    document.documentElement.classList.remove('swapping');
    if(window.CH_MUSIC_LEAVE) CH_MUSIC_LEAVE(function(){ location.href=url }); else location.href=url;
  }
  function shownPath(p){ shown=norm(p) }

  function go(url,push,restoreY){
    if(busy) return; busy=true;
    if(push){ try{ history.replaceState({nav:1,y:scrollY},'',location.href) }catch(e){} }
    document.documentElement.classList.add('swapping');
    var started=Date.now();
    fetch(url,{credentials:'same-origin'}).then(function(r){
      if(!r.ok||!/text\/html/.test(r.headers.get('content-type')||'')) throw new Error('not a page');
      return r.text().then(function(t){ return {html:t,url:r.url||url} });
    }).then(function(res){
      var doc=new DOMParser().parseFromString(res.html,'text/html');
      if(!doc.body||!doc.body.hasAttribute('data-swap')){ busy=false; return hard(url) }
      /* let the fade-out finish (it is short) so the swap is never a jump cut */
      var wait=Math.max(0,140-(Date.now()-started));
      setTimeout(function(){ swap(doc,res.url,url,push,restoreY) },wait);
    }).catch(function(){ busy=false; hard(url) });
  }

  function swap(doc,finalUrl,asked,push,restoreY){
    try{
      var body=document.body;
      /* out with this page, keeping the music */
      [].slice.call(body.childNodes).forEach(function(n){ if(!(n.nodeType===1&&(n.hasAttribute('data-keep')||/(^|\s)fc-season-/.test(n.className)))) body.removeChild(n)   /* + the seasonal ribbon/leaves season.js adds at deploy */ });
      var first=body.firstChild;
      [].slice.call(doc.body.childNodes).forEach(function(n){
        if(n.nodeType===1&&(n.hasAttribute('data-keep')||n.tagName==='SCRIPT')) return;   /* scripts are already running */
        body.insertBefore(document.importNode(n,true),first);
      });
      body.className=doc.body.className; body.style.overflow='';
      document.title=doc.title;
      var md=doc.querySelector('meta[name=description]'), mine=document.querySelector('meta[name=description]');
      if(md&&mine) mine.setAttribute('content',md.getAttribute('content'));

      var target=new URL(asked,location.href), shown=new URL(finalUrl,location.href);
      shown.hash=target.hash;
      if(push) history.pushState({nav:1,y:0},'',shown.href);
      shownPath(shown.pathname);

      if(window.CH_SITE_INIT) window.CH_SITE_INIT();
      var el=target.hash&&document.getElementById(decodeURIComponent(target.hash.slice(1)));
      /* jump, never glide: the site CSS sets scroll-behavior:smooth, which would
         otherwise animate from the OLD page's scroll position */
      var hs=document.documentElement.style, sb=hs.scrollBehavior; hs.scrollBehavior='auto';
      if(restoreY!=null) scrollTo(0,restoreY); else if(el) el.scrollIntoView(); else scrollTo(0,0);
      hs.scrollBehavior=sb;
      requestAnimationFrame(function(){ document.documentElement.classList.remove('swapping') });
      if(window.track) track('view',document.title);
    }catch(e){ return hard(asked) }
    busy=false;
  }
})();
