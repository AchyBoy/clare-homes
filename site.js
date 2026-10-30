/* Clare Homes concept site: shared page behaviour.
   Runs once per PAGE, and again after nav.js swaps a page in place (the music
   keeps playing because the document never reloads). Listeners on window or
   document carry the run's signal, so the previous page's are dropped; its
   observers, timers and animation loops stop on abort. */
(function(){
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var root = document.documentElement;
if(!RM) root.classList.add('motion');
function $(s,c){return (c||document).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
function T(k,d){ if(window.track) try{ track(k,d) }catch(e){} }
var ctl=null, timers=[];
function later(fn,ms){ var id=setTimeout(fn,ms); timers.push(id); return id }

window.CH_SITE_INIT=function(){
  if(ctl&&ctl.abort) ctl.abort();
  timers.forEach(clearTimeout); timers=[];
  ctl=('AbortController' in window)?new AbortController():null;
  var sig=ctl?{signal:ctl.signal}:{};
  var sigP=ctl?{signal:ctl.signal,passive:true}:{passive:true};
  var ab=ctl&&ctl.signal;
  function onAbort(fn){ if(ab) ab.addEventListener('abort',fn) }
  page(sig,sigP,onAbort);
  gallery(sig);
  if(document.getElementById('fcSvg')) compare();
};

function page(sig,sigP,onAbort){
  var dead=false; onAbort(function(){ dead=true });

  /* mobile menu */
  var mb=$('#menuBtn'), sheet=$('#sheet');
  if(mb&&sheet){
    mb.addEventListener('click',function(){
      var open=mb.getAttribute('aria-expanded')!=='true';
      mb.setAttribute('aria-expanded',open); sheet.classList.toggle('open',open);
      if(open){ var a=$('a',sheet); a&&a.focus(); }
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&sheet.classList.contains('open')){ mb.click(); mb.focus(); } },sig);
    $$('a',sheet).forEach(function(a){ a.addEventListener('click',function(){ mb.setAttribute('aria-expanded','false'); sheet.classList.remove('open'); }) });
  }

  /* Hurricane season, live from today's date. Season runs June 1 to November 30. */
  (function(){
    var now=new Date(), y=now.getFullYear(), day=864e5;
    var start=new Date(y,5,1), end=new Date(y,10,30,23,59), total=Math.round((end-start)/day);
    var bar=$('#seasonText'), big=$('#seasonBig'), fill=$('#seasonFill');
    var msg, pct;
    if(now>=start&&now<=end){
      var d=Math.floor((now-start)/day)+1, left=Math.ceil((end-now)/day);
      msg='Hurricane season is on: day <b>'+d+'</b> of '+total+', '+left+' days to go';
      pct=d/total*100;
      if(big) big.textContent='Day '+d+' of '+total+'. '+left+' days left this season.';
    }else{
      var next=now>end?new Date(y+1,5,1):start, until=Math.ceil((next-now)/day);
      msg='Hurricane season starts June 1, <b>'+until+'</b> days from today';
      pct=now>end?100:0;
      if(big) big.textContent='Off season. The next one starts June 1, '+until+' days from today.';
    }
    if(bar) bar.innerHTML=msg;
    if(fill){ var go=function(){ fill.style.width=pct.toFixed(1)+'%' }; if(RM) go(); else later(go,400); }
  })();

  /* Reveal on scroll. The class that hides things is only set when IO exists and motion is allowed,
     and sweep() reveals anything already in view, so content can never stay invisible. */
  var rv=$$('.rv');
  if('IntersectionObserver' in window && !RM && rv.length){
    root.classList.add('reveal-on');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }) },{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){ io.observe(el) }); onAbort(function(){ io.disconnect() });
    var sweep=function(){ var h=innerHeight; rv.forEach(function(el){ if(el.classList.contains('in')) return; var r=el.getBoundingClientRect(); if(r.top<h&&r.bottom>0) el.classList.add('in'); }) };
    ['load','resize','scroll','visibilitychange'].forEach(function(ev){ (ev==='visibilitychange'?document:window).addEventListener(ev,sweep,sigP) });
    later(sweep,60); later(sweep,1500);
    later(function(){ rv.forEach(function(el){ el.classList.add('in') }) },6000);
  }

  /* logo draw lengths */
  $$('.logo-draw path,.logo-draw circle').forEach(function(p){ try{ p.style.setProperty('--len',Math.ceil(p.getTotalLength())+1) }catch(e){} });

  /* Background videos: play only when motion is allowed and they are on screen. */
  $$('video[data-bg]').forEach(function(v){
    v.muted=true; v.setAttribute('muted','');
    if(RM){ v.removeAttribute('autoplay'); try{v.pause()}catch(e){} return; }
    var play=function(){ if(v.preload==='none'){ v.preload='auto'; } var p=v.play(); if(p&&p.catch) p.catch(function(){}); };
    if('IntersectionObserver' in window){
      var vo=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) play(); else v.pause(); }) },{rootMargin:'200px 0px'}); vo.observe(v);
      onAbort(function(){ vo.disconnect(); try{ v.pause() }catch(e){} });
    }else play();
  });

  /* counters */
  $$('[data-count]').forEach(function(el){
    var to=+el.getAttribute('data-count'), from=+(el.getAttribute('data-from')||0);
    if(RM||!('IntersectionObserver' in window)){ el.textContent=to; return; }
    el.textContent=from;
    var o=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; o.disconnect();
      var t0=performance.now(), dur=1400;
      (function step(t){ var k=Math.min(1,(t-t0)/dur); k=1-Math.pow(1-k,3); el.textContent=Math.round(from+(to-from)*k); if(k<1&&!dead) requestAnimationFrame(step); else el.textContent=to; })(t0);
    }); o.observe(el); onAbort(function(){ o.disconnect() });
    later(function(){ el.textContent=to },5000);
  });

  /* HERS meter: three real certificates from his site */
  var hers=$('#hers');
  if(hers){
    var HOMES={
      broussard:{n:'101 Lansing, Broussard',s:54,save:'$863',note:'A FORTIFIED Roof and ENERGY STAR custom build.'},
      decatur:{n:'303 Decatur Lane, Lafayette',s:45,save:'$943',note:'The first Zero Energy Ready Home for sale in Louisiana.'},
      hightower:{n:'Hightower project, Lafayette',s:19,save:'$935',note:'Our first truly net zero project.'}
    };
    var pin=$('.hers-pin',hers), out=$('.hers-out',hers), MAX=150;
    var show=function(id){
      var h=HOMES[id]; if(!h) return;
      $$('.hers-tabs button',hers).forEach(function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-id')===id) });
      pin.style.left=(h.s/MAX*100)+'%'; $('b',pin).textContent='HERS '+h.s;
      out.innerHTML='<strong>'+h.n+'</strong>: HERS index score of '+h.s+(h.save?', with estimated annual savings of '+h.save+' on its rating certificate':'')+'. '+h.note;
    };
    $$('.hers-tabs button',hers).forEach(function(b){ b.addEventListener('click',function(){ show(b.getAttribute('data-id')); T('hers',b.getAttribute('data-id')); }) });
    pin.style.left='100%';
    if(RM||!('IntersectionObserver' in window)) show('decatur');
    else { var ho=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ ho.disconnect(); later(function(){show('decatur')},250); } }); ho.observe(hers); onAbort(function(){ ho.disconnect() }); later(function(){ if(!$('[aria-pressed=true]',hers)) show('decatur') },5000); }
  }

  /* logos marquee: still under reduced motion */
  if(RM) $$('.logos').forEach(function(l){ l.classList.add('still') });

  /* quotes carousel buttons */
  $$('[data-qnav]').forEach(function(b){
    b.addEventListener('click',function(){
      var q=$(b.getAttribute('data-target')); if(!q) return;
      var w=q.firstElementChild?q.firstElementChild.getBoundingClientRect().width+16:300;
      q.scrollBy({left:(b.getAttribute('data-qnav')==='next'?w:-w),behavior:RM?'auto':'smooth'});
    });
  });

  /* YouTube: load the player only when tapped */
  $$('.yt button[data-yt]').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-yt'), f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1';
      f.title=b.getAttribute('aria-label')||'Video';
      f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen=true;
      b.parentNode.replaceChild(f,b); T('video',id);
    });
  });

  /* contact: build an email from the form */
  var form=$('#askForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var f=form.elements, lines=[];
      lines.push('Name: '+f.name.value); if(f.phone.value) lines.push('Phone: '+f.phone.value);
      lines.push('Project: '+f.kind.value); if(f.where.value) lines.push('Lot or location: '+f.where.value);
      lines.push(''); lines.push(f.msg.value);
      var to=f.to.value==='kendall'?'kendall.clarehomes@gmail.com':'isaac@clare-homes.com';
      T('ask',f.kind.value);
      location.href='mailto:'+to+'?subject='+encodeURIComponent('New build inquiry: '+f.kind.value)+'&body='+encodeURIComponent(lines.join('\n'));
    });
  }

  /* tap tracking for calls, texts, emails */
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a) return;
    var h=a.getAttribute('href');
    if(/^sms:/.test(h)) T('text',h.slice(4));
    if(/open\.spotify/.test(h)) T('podcast',a.textContent.trim().slice(0,40));
  },sig);
}

/* Gallery + lightbox, used on the projects page and the home page cards. */
function gallery(sig){
  var D=window.CLARE; if(!D) return;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var byId={}; D.projects.forEach(function(p){ byId[p.id]=p });

  /* lightbox */
  var lb=document.getElementById('lb'), list=[], idx=0, lastFocus=null, title='';
  function draw(){
    var ph=list[idx]; if(!ph) return;
    var img=lb.querySelector('.lb-stage img');
    img.src='img/p/'+ph.id+'.webp'; img.alt=ph.alt; img.width=ph.W; img.height=ph.H;
    lb.querySelector('.lb-cap').textContent=ph.alt;
    lb.querySelector('.lb-count').textContent=title+'  '+(idx+1)+' / '+list.length;
    var n=list[(idx+1)%list.length]; if(n){ var pre=new Image(); pre.src='img/p/'+n.id+'.webp'; }
  }
  function open(p,i){
    if(!lb) return; list=p.photos; idx=i||0; title=p.title; lastFocus=document.activeElement;
    lb.classList.add('open'); document.body.style.overflow='hidden'; draw();
    lb.querySelector('.lb-close').focus();
    if(window.track) try{ track('photos',p.id) }catch(e){}
  }
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; if(lastFocus) lastFocus.focus(); }
  function go(d){ idx=(idx+d+list.length)%list.length; draw(); }
  if(lb){
    lb.querySelector('.lb-close').onclick=close;
    lb.querySelector('.lb-prev').onclick=function(){go(-1)};
    lb.querySelector('.lb-next').onclick=function(){go(1)};
    document.addEventListener('keydown',function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') close(); else if(e.key==='ArrowLeft') go(-1); else if(e.key==='ArrowRight') go(1);
      else if(e.key==='Tab'){ var f=lb.querySelectorAll('button'), a=f[0], z=f[f.length-1];
        if(e.shiftKey&&document.activeElement===a){ e.preventDefault(); z.focus(); } else if(!e.shiftKey&&document.activeElement===z){ e.preventDefault(); a.focus(); } }
    },sig);
    var sx=null, sy=null, st=lb.querySelector('.lb-stage');
    st.addEventListener('touchstart',function(e){ sx=e.touches[0].clientX; sy=e.touches[0].clientY },{passive:true});
    st.addEventListener('touchend',function(e){ if(sx==null) return; var dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy; if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)) go(dx<0?1:-1); sx=null; });
    st.addEventListener('click',function(e){ if(e.target===st) close(); });
  }
  window.openProject=function(id,i){ var p=byId[id]; if(p) open(p,i) };

  /* projects page */
  var host=document.getElementById('projects'); if(!host) return;
  var CATS=[['all','All'],['custom','Custom builds'],['zero','Zero Energy Ready'],['adu','ADU'],['sold','Sold homes'],['reno','Renovations'],['commercial','Commercial']];
  var html='';
  D.projects.forEach(function(p){
    var shown=p.photos.slice(0,9), extra=p.photos.length-shown.length;
    html+='<article class="proj" id="p-'+p.id+'" data-cat="'+p.cat.join(' ')+'" aria-labelledby="h-'+p.id+'">'+
      '<div class="proj-head"><div>'+(p.where?'<div class="kicker">'+esc(p.where)+'</div>':'')+
      '<h3 id="h-'+p.id+'" style="font-size:1.6rem">'+esc(p.title)+'</h3><ul class="tags">'+p.tags.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul></div>'+
      '<p style="margin:0">'+esc(p.blurb)+'</p></div><div class="thumbs">';
    shown.forEach(function(ph,i){
      var last=(i===shown.length-1&&extra>0);
      html+='<button type="button" data-p="'+p.id+'" data-i="'+i+'" aria-label="'+esc(last?'See all '+p.photos.length+' photos of '+p.title:'Open photo: '+ph.alt)+'">'+
        '<img src="img/t/'+ph.id+'.webp" alt="'+(last?'':esc(ph.alt))+'" width="'+ph.w+'" height="'+ph.h+'" loading="lazy" decoding="async">'+
        (ph.ba?'<span class="ba '+ph.ba+'" aria-hidden="true">'+ph.ba+'</span>':'')+
        (last?'<span class="more" aria-hidden="true">+'+extra+' more</span>':'')+'</button>';
    });
    html+='</div>';
    if(p.quote) html+='<figure class="quote"><blockquote>'+esc(p.quote.text)+'</blockquote><figcaption>'+esc(p.quote.by)+'<span>'+esc(p.title)+'</span></figcaption></figure>';
    html+='</article>';
  });
  html+='<article class="proj" id="p-commercial" data-cat="commercial" aria-labelledby="h-comm"><div class="comm"><div class="kicker">Commercial and multifamily</div>'+
    '<h3 id="h-comm" style="font-size:1.6rem">We have our Commercial License</h3><p>Contact us for your high performance Commercial and Multifamily projects!</p>'+
    '<p><b>Commercial License #: 77944</b></p><a class="btn btn-gold" href="contact.html">Talk to us about a project</a></div></article>';
  host.innerHTML=html;

  var chips=document.getElementById('chips'), counts={};
  CATS.forEach(function(c){ counts[c[0]]=c[0]==='all'?D.projects.length+1:c[0]==='commercial'?1:D.projects.filter(function(p){return p.cat.indexOf(c[0])>=0}).length });
  chips.innerHTML=CATS.map(function(c){ return '<button type="button" data-cat="'+c[0]+'" aria-pressed="'+(c[0]==='all')+'">'+c[1]+'<span class="n">'+counts[c[0]]+'</span></button>' }).join('');
  var status=document.getElementById('filterStatus');
  function filter(cat,quiet){
    var n=0;
    Array.prototype.forEach.call(chips.children,function(b){ b.setAttribute('aria-pressed',b.getAttribute('data-cat')===cat) });
    Array.prototype.forEach.call(host.children,function(a){
      var cats=a.getAttribute('data-cat').split(' ');
      var show=cat==='all'?true:cats.indexOf(cat)>=0;
      a.hidden=!show; if(show) n++;
    });
    if(status) status.textContent='Showing '+n+(n===1?' project':' projects');
    if(!quiet && window.track) try{ track('filter',cat) }catch(e){}
  }
  chips.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return; filter(b.getAttribute('data-cat')); history.replaceState(null,'','#'+b.getAttribute('data-cat')); });
  host.addEventListener('click',function(e){ var b=e.target.closest('button[data-p]'); if(!b) return; open(byId[b.getAttribute('data-p')],+b.getAttribute('data-i')); });
  var h=location.hash.slice(1);
  if(/^p-/.test(h)){ filter('all',true); var el=document.getElementById(h); if(el) later(function(){ el.scrollIntoView({behavior:RM?'auto':'smooth'}) },120); }
  else filter(CATS.some(function(c){return c[0]===h})?h:'all',true);
}

/* FORTIFIED storm comparison (home page and FORTIFIED page). */
function compare(){
  var L=['Conventional','FORTIFIED Roof','FORTIFIED Silver','FORTIFIED Gold'];
  var P=[
    {k:'nails',t:'Roof deck nails',lv:1,x:212,y:186,el:null,
     c:'Common smooth nails hold the roof deck to the framing.',
     f:'8D ring-shank nails in an enhanced pattern. IBHS says ring-shank nails nearly double the roof’s strength against wind.'},
    {k:'deck',t:'Sealed roof deck',lv:1,x:262,y:206,el:'fcWater',
     c:'If shingles blow off, rain can pour through the seams between the deck boards.',
     f:'The roof deck is sealed, so water stays out even if the roof covering comes off.'},
    {k:'shingles',t:'Shingles',lv:1,x:372,y:140,el:'fcShingles',
     c:'Shingles are installed without the FORTIFIED wind rating requirement.',
     f:'Shingles carry the highest wind ratings (ASTM D3161 Class F or D7158 Class H). An optional hail upgrade uses impact rated shingles for hail up to 2 inches.'},
    {k:'edge',t:'Roof edges',lv:1,x:540,y:232,el:'fcEdge',
     c:'Roof edges are where wind gets under the covering and starts peeling.',
     f:'A wider drip edge and a fully adhered starter strip lock the edges down.'},
    {k:'vents',t:'Attic vents',lv:1,x:350,y:178,el:null,
     c:'Standard vents can let wind driven rain into the attic.',
     f:'Attic vents are wind and rain resistant.'},
    {k:'gable',t:'Gable end',lv:2,x:290,y:172,el:'fcGable',
     c:'A tall gable wall can be pushed in or pulled out by strong wind.',
     f:'Gable end bracing keeps that wall from collapsing.'},
    {k:'windows',t:'Windows and doors',lv:2,x:178,y:330,el:'fcWin',
     c:'Windows and doors are not required to be pressure rated or protected from flying debris.',
     f:'Pressure rated windows and doors, plus impact protection in hurricane zones.'},
    {k:'garage',t:'Garage door',lv:2,x:464,y:250,el:'fcGarage',
     c:'A big garage door can blow in and let wind push up on the roof from inside.',
     f:'An impact and pressure rated garage door keeps the wind out.'},
    {k:'porch',t:'Porch',lv:2,x:320,y:246,el:'fcPorch',
     c:'Porches and carports can lift off and take part of the roof with them.',
     f:'Attached structures like porches and carports are anchored down.'},
    {k:'path',t:'Roof to foundation',lv:3,x:128,y:262,el:'fcPath',
     c:'Typical construction relies on gravity and the weight of the house to hold it down.',
     f:'An engineered continuous load path ties the roof to the walls, story to story, and the walls to the foundation, so the house acts as one solid structure.'}
  ];
  var SILVER_ALSO='Silver also adds reinforced soffits, stronger exterior sheathing and chimney bracing.';
  var svg=document.getElementById('fcSvg'), hot=document.getElementById('fcHot'), panel=document.getElementById('fcPanel'),
      lvls=document.getElementById('fcLevels'), lvTxt=document.getElementById('fcLv'), run=document.getElementById('fcRun'),
      res=document.getElementById('fcResult'), stage=document.getElementById('fcStage');
  var level=1, sel=0, NS='http://www.w3.org/2000/svg';
  P.forEach(function(p,i){
    var g=document.createElementNS(NS,'g'); g.setAttribute('class','hs'); g.setAttribute('tabindex','0'); g.setAttribute('role','button');
    g.setAttribute('aria-label',p.t);
    g.innerHTML='<circle class="pulse" cx="'+p.x+'" cy="'+p.y+'" r="12"/><circle class="ring" cx="'+p.x+'" cy="'+p.y+'" r="12"/><text x="'+p.x+'" y="'+(p.y+4)+'" text-anchor="middle">'+(i+1)+'</text>';
    g.addEventListener('click',function(){pick(i)});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(i)}});
    hot.appendChild(g); p.g=g;
  });
  function pick(i){sel=i;paint();}
  function clearDamage(){ document.querySelectorAll('#fcSvg .fail, #fcSvg .strain, #fcSvg .chunk, #fcSvg .roofoff').forEach(function(n){n.classList.remove('fail','strain','chunk','roofoff')}); svg.classList.remove('roofgone','done'); res.classList.remove('show'); P.forEach(function(p){p.g.classList.remove('broke')}); }
  function setLevel(l){level=l;clearDamage();paint();}
  function paint(){
    ['lvl0','lvl1','lvl2','lvl3'].forEach(function(c){svg.classList.remove(c)}); svg.classList.add('lvl'+level);
    [].forEach.call(lvls.children,function(b){var on=+b.dataset.l===level;b.classList.toggle('on',on);b.classList.toggle('gold',on&&level===3);b.setAttribute('aria-selected',on)});
    var up=P.filter(function(p){return p.lv<=level}).length;
    lvTxt.innerHTML='<b>'+L[level]+'</b> · '+up+' of '+P.length+' upgraded';
    P.forEach(function(p,i){p.g.classList.toggle('up',p.lv<=level);p.g.classList.toggle('sel',i===sel)});
    var p=P[sel], has=p.lv<=level;
    panel.innerHTML='<span class="tag'+(p.lv===3?' g':'')+'">Added at '+L[p.lv]+'</span><h3>'+(sel+1)+'. '+p.t+'</h3>'+
      '<div class="fc-cmp"><div class="c"><small>Conventional</small>'+p.c+'</div><div class="f'+(has?'':' no')+'"><small>'+(has?'Your '+L[level]+' home':'FORTIFIED ('+L[p.lv]+' and up)')+'</small>'+p.f+'</div></div>'+
      (p.lv===2?'<p class="src">'+SILVER_ALSO+'</p>':'')+
      (level===1&&p.lv===1?'<p class="src">Every Clare home is built to FORTIFIED Roof at minimum.</p>':'')+
      (p.lv===3?'<p class="src">Clare Homes finished a FORTIFIED Gold custom home in 2025.</p>':'')+
      '<div class="fc-list">'+P.map(function(q,j){return '<button type="button" data-j="'+j+'" class="'+(q.lv<=level?'up ':'')+(j===sel?'on':'')+'">'+(j+1)+'. '+q.t+'</button>'}).join('')+'</div>';
    panel.querySelectorAll('.fc-list button').forEach(function(b){b.addEventListener('click',function(){pick(+b.dataset.j)})});
  }
  lvls.addEventListener('click',function(e){var b=e.target.closest('button');if(b&&!storming)setLevel(+b.dataset.l)});
  var storming=false, power=2;
  var BR={edge:1,shingles:2,deck:2,vents:2,garage:2,nails:3,gable:3,windows:3,porch:3,path:4};
  var SAY={edge:'the roof edge peeled up',shingles:'shingles blew off',deck:'rain poured in through the roof deck',vents:'rain blew in through the attic vents',
           garage:'the garage door blew in',nails:'roof deck panels pulled loose',gable:'the gable end pushed in',windows:'windows broke',porch:'the porch lifted',path:'the roof strained against the walls'};
  var STORM=['','a strong thunderstorm','a Category 1 hurricane','a Category 3 hurricane','an EF-2 tornado'];
  var sp=document.getElementById('fcStorm');
  function paintStorm(){ [].forEach.call(sp.children,function(b){ var on=+b.dataset.s===power; b.classList.toggle('on',on); b.setAttribute('aria-checked',on) }); }
  sp.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b&&!storming){ power=+b.dataset.s; paintStorm(); clearDamage(); run.lastChild.textContent='Run the storm'; } });
  paintStorm();
  function cap(t){ return t.charAt(0).toUpperCase()+t.slice(1) }
  run.addEventListener('click',function(){
    if(storming) return; storming=true; run.disabled=true; clearDamage(); void svg.getBoundingClientRect();
    stage.classList.add('sky','st'+power); svg.classList.add('storming','st'+power); if(power>=3) stage.classList.add('shake');
    var failed=P.filter(function(p){ return p.lv>level && power>=BR[p.k] });
    failed.forEach(function(p){
      if(p.el) document.getElementById(p.el).classList.add('fail');
      if(p.k==='nails') document.getElementById('fcShingles').classList.add('fail');
      if(p.k==='vents') document.getElementById('fcWater').classList.add('fail');
      if(p.k==='path'){
        if(level===0){ document.getElementById('fcRoof').classList.add('roofoff'); document.getElementById('fcGable').classList.add('roofoff'); svg.classList.add('roofgone'); }
        else { document.getElementById('fcRoof').classList.add('strain'); document.getElementById('fcGable').classList.add('strain'); }
      }
      if(p.k==='nails'&&power<4) document.getElementById('fcDeck').classList.add('chunk');
    });
    later(function(){ stage.classList.remove('shake'); },2400);
    later(function(){
      var head='<b>'+L[level]+'</b> in '+STORM[power]+': ';
      if(!failed.length){
        res.innerHTML=head+'everything held.'+(level===3&&power===4?' The roof stayed tied down to the foundation.':'');
      } else {
        var fix=Math.max.apply(null,failed.map(function(p){return p.lv}));
        var said=failed.map(function(p){ if(level===0&&p.k==='path') return 'the whole roof tore off'; if(p.k==='nails') return 'a section of roof deck tore away'; return SAY[p.k]; });
        var ORDER=['path','nails','gable','windows','garage','porch','shingles','deck','edge','vents'];
        failed.sort(function(a,b){return ORDER.indexOf(a.k)-ORDER.indexOf(b.k)});
        said=failed.map(function(p){ if(level===0&&p.k==='path') return 'the whole roof tore off'; if(p.k==='nails') return 'a section of roof deck tore away'; return SAY[p.k]; });
        if(level===0&&power===4) said=said.filter(function(t){return !/shingles|edge|roof deck|vents/.test(t)});
        if(said.length>4) said=said.slice(0,4).concat(['and more']);
        res.innerHTML=head+said.join(', ')+'. <span style="color:var(--muted)">'+L[fix]+' holds through all of it.</span>';
      }
      res.classList.add('show');
    },2600);
    later(function(){
      svg.classList.remove('storming','st1','st2','st3','st4'); stage.classList.remove('sky','st1','st2','st3','st4','shake');
      svg.classList.add('done'); failed.forEach(function(p){ p.g.classList.add('broke') });
      storming=false; run.disabled=false; run.lastChild.textContent='Run it again';
    },power===4&&level===0?7200:5600);
  });
  paint();
}

window.CH_SITE_INIT();
})();
