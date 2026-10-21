/* Clare Homes concept site: shared page behaviour. */
(function(){
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if(!RM) root.classList.add('motion');
  function $(s,c){return (c||document).querySelector(s)}
  function $$(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))}
  function T(k,d){ if(window.track) try{ track(k,d) }catch(e){} }

  /* mobile menu */
  var mb=$('#menuBtn'), sheet=$('#sheet');
  if(mb&&sheet){
    mb.addEventListener('click',function(){
      var open=mb.getAttribute('aria-expanded')!=='true';
      mb.setAttribute('aria-expanded',open); sheet.classList.toggle('open',open);
      if(open){ var a=$('a',sheet); a&&a.focus(); }
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&sheet.classList.contains('open')){ mb.click(); mb.focus(); } });
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
    if(fill){ var go=function(){ fill.style.width=pct.toFixed(1)+'%' }; if(RM) go(); else setTimeout(go,400); }
  })();

  /* Reveal on scroll. The class that hides things is only set when IO exists and motion is allowed,
     and sweep() reveals anything already in view, so content can never stay invisible. */
  var rv=$$('.rv');
  if('IntersectionObserver' in window && !RM && rv.length){
    root.classList.add('reveal-on');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }) },{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){ io.observe(el) });
    var sweep=function(){ var h=innerHeight; rv.forEach(function(el){ if(el.classList.contains('in')) return; var r=el.getBoundingClientRect(); if(r.top<h&&r.bottom>0) el.classList.add('in'); }) };
    ['load','resize','scroll','visibilitychange'].forEach(function(ev){ (ev==='visibilitychange'?document:window).addEventListener(ev,sweep,{passive:true}) });
    setTimeout(sweep,60); setTimeout(sweep,1500);
    setTimeout(function(){ rv.forEach(function(el){ el.classList.add('in') }) },6000);
  }

  /* logo draw lengths */
  $$('.logo-draw path,.logo-draw circle').forEach(function(p){ try{ p.style.setProperty('--len',Math.ceil(p.getTotalLength())+1) }catch(e){} });

  /* Background videos: play only when motion is allowed and they are on screen. */
  $$('video[data-bg]').forEach(function(v){
    v.muted=true; v.setAttribute('muted','');
    if(RM){ v.removeAttribute('autoplay'); try{v.pause()}catch(e){} return; }
    var play=function(){ if(v.preload==='none'){ v.preload='auto'; } var p=v.play(); if(p&&p.catch) p.catch(function(){}); };
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) play(); else v.pause(); }) },{rootMargin:'200px 0px'}).observe(v);
    }else play();
  });

  /* counters */
  $$('[data-count]').forEach(function(el){
    var to=+el.getAttribute('data-count'), from=+(el.getAttribute('data-from')||0);
    if(RM||!('IntersectionObserver' in window)){ el.textContent=to; return; }
    el.textContent=from;
    var o=new IntersectionObserver(function(es){ if(!es[0].isIntersecting) return; o.disconnect();
      var t0=performance.now(), dur=1400;
      (function step(t){ var k=Math.min(1,(t-t0)/dur); k=1-Math.pow(1-k,3); el.textContent=Math.round(from+(to-from)*k); if(k<1) requestAnimationFrame(step); else el.textContent=to; })(t0);
    }); o.observe(el);
    setTimeout(function(){ el.textContent=to },5000);
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
    else { var ho=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ ho.disconnect(); setTimeout(function(){show('decatur')},250); } }); ho.observe(hers); setTimeout(function(){ if(!$('[aria-pressed=true]',hers)) show('decatur') },5000); }
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
  });
})();

/* Gallery + lightbox, used on the projects page and the home page cards. */
(function(){
  var D=window.CLARE; if(!D) return;
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    });
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
  if(/^p-/.test(h)){ filter('all',true); var el=document.getElementById(h); if(el) setTimeout(function(){ el.scrollIntoView({behavior:RM?'auto':'smooth'}) },120); }
  else filter(CATS.some(function(c){return c[0]===h})?h:'all',true);
})();
