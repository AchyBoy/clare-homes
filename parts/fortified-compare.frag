<section class="fc-sec" aria-labelledby="fcH"><div class="wrap">
<style>
.fc-sec{background:var(--paper)}
.fc-head{max-width:720px;margin-bottom:26px}
.fc-levels{display:flex;flex-wrap:wrap;gap:6px;background:var(--cream);border:1px solid var(--line);border-radius:999px;padding:5px;width:max-content;max-width:100%;margin-bottom:18px}
.fc-levels button{border:0;background:transparent;font:600 14px/1 var(--sans);color:var(--muted);padding:11px 16px;border-radius:999px;cursor:pointer;white-space:nowrap}
.fc-levels button.on{background:var(--navy);color:#fff}
.fc-levels button.on.gold{background:linear-gradient(135deg,#c99a2e,#f2cd6b);color:#14233f}
.fc-grid{display:grid;grid-template-columns:1.35fr 1fr;gap:22px;align-items:start}
.fc-stage{position:relative;background:linear-gradient(#dfe8f2,#f5f1e8 70%);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}
.fc-stage.sky{background:linear-gradient(#5d6b80,#9aa6b4 70%)}
.fc-stage svg{display:block;width:100%;height:auto}
.fc-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-top:1px solid var(--line);background:#fff}
.fc-bar .lv{font:500 13px/1.3 var(--sans);color:var(--muted)}
.fc-bar .lv b{color:var(--navy)}
.fc-run{border:0;background:var(--navy);color:#fff;font:600 14px/1 var(--sans);padding:12px 16px;border-radius:999px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;white-space:nowrap}
.fc-run[disabled]{opacity:.5}
.fc-storm{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);background:#fff}
.fc-storm button{border:0;border-left:1px solid var(--line);background:#fff;padding:10px 6px;font:600 13px/1.2 var(--sans);color:var(--navy);cursor:pointer}
.fc-storm button:first-child{border-left:0}
.fc-storm button small{display:block;font:500 11px/1.2 var(--sans);color:var(--muted);margin-top:3px}
.fc-storm button.on{background:var(--navy);color:#fff}.fc-storm button.on small{color:var(--on-dark-2)}
.fc-storm button[data-s="4"].on{background:#5a1f1f}
.fc-stage.sky.st3{background:linear-gradient(#3e4858,#7b8796 70%)}
.fc-stage.sky.st4{background:linear-gradient(#262c36,#5b6573 70%)}
.st1 .wind path{animation-duration:1.6s!important}.st2 .wind path{animation-duration:1.1s!important}
.st3 .wind path{animation-duration:.75s!important;stroke-width:2.8}.st4 .wind path{animation-duration:.5s!important;stroke-width:3.4}
.st1 .rain line{animation-duration:1s!important}.st3 .rain line,.st4 .rain line{animation-duration:.45s!important;stroke-width:2}
.fc-stage.shake svg{animation:shake .14s linear infinite}
@keyframes shake{0%,100%{transform:translate(0,0)}25%{transform:translate(1.5px,-1px)}75%{transform:translate(-1.5px,1px)}}
.strain{animation:strain .5s ease-in-out .8s 6 alternate;transform-box:fill-box;transform-origin:center bottom}
@keyframes strain{to{transform:translateY(-8px) rotate(-1.2deg)}}
.chunk{animation:chunk 1.5s ease-in 1.1s forwards;transform-box:fill-box;transform-origin:left bottom}
@keyframes chunk{30%{transform:rotate(-12deg)}100%{transform:translate(420px,-200px) rotate(-200deg);opacity:0}}
.roofoff{animation:roofoff 2s cubic-bezier(.5,0,.8,.4) 1.3s forwards;transform-box:fill-box;transform-origin:left bottom}
@keyframes roofoff{15%{transform:translateY(-14px) rotate(-3deg)}35%{transform:translate(30px,-60px) rotate(-8deg)}100%{transform:translate(520px,-320px) rotate(-38deg);opacity:0}}
.fc-attic{opacity:0;transition:opacity .4s 2.2s}.roofgone .fc-attic{opacity:1}
@media (max-width:620px){.fc-storm{grid-template-columns:1fr 1fr}.fc-storm button:nth-child(3){border-left:0}.fc-storm button:nth-child(n+3){border-top:1px solid var(--line)}}
@media (prefers-reduced-motion:reduce){.fc-stage.shake svg,.strain{animation:none}}
.fc-result{background:#fff8e6;border-top:1px solid #ecd9a6;padding:0 14px;max-height:0;overflow:hidden;font:500 14.5px/1.45 var(--sans);color:var(--navy);transition:max-height .45s ease,padding .45s ease}
.fc-result.show{max-height:140px;padding:12px 14px}
.fc-result b{font-family:var(--serif)}
.fc-panel{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:22px;min-height:100%}
.fc-panel .tag{display:inline-block;font:600 11px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;padding:7px 10px;border-radius:999px;background:var(--cream);color:var(--navy)}
.fc-panel .tag.g{background:linear-gradient(135deg,#c99a2e,#f2cd6b)}
.fc-panel h3{font:600 26px/1.15 var(--serif);color:var(--navy);margin:12px 0 14px}
.fc-cmp{display:grid;gap:10px}
.fc-cmp div{border-radius:10px;padding:12px 14px;font-size:15px;line-height:1.5}
.fc-cmp small{display:block;font:600 11px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}
.fc-cmp .c{background:#f1f2f4;color:#3b4250}
.fc-cmp .c small{color:#7a8291}
.fc-cmp .f{background:#fbf3df;color:#2a2410;border:1px solid #ecd9a6}
.fc-cmp .f small{color:#9a7414}
.fc-cmp .f.no{opacity:.55}
.fc-panel .src{margin-top:14px;font-size:12.5px;color:var(--muted)}
.fc-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.fc-list button{border:1px solid var(--line);background:#fff;border-radius:999px;font:500 13px/1 var(--sans);padding:8px 11px;color:var(--navy);cursor:pointer}
.fc-list button.on{border-color:var(--navy);background:var(--navy);color:#fff}
.fc-list button.up::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--gold);margin-right:6px;vertical-align:1px}
.fc-note{margin-top:14px;font-size:13px;color:var(--muted)}
/* svg parts */
.hs{cursor:pointer}
.hs circle.ring{fill:#fff;stroke:var(--navy);stroke-width:2;transition:fill .2s}
.hs text{font:700 12px var(--sans);fill:var(--navy);pointer-events:none}
.hs.up circle.ring{fill:#f2cd6b;stroke:#9a7414}
.hs.sel circle.ring{fill:var(--navy)}
.hs.sel text{fill:#fff}
.hs .pulse{fill:none;stroke:var(--gold);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center}
.hs.up .pulse{animation:fcp 2.4s ease-out infinite}
@keyframes fcp{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
.up-only{opacity:0;transition:opacity .4s}
.lvl1 .need1,.lvl2 .need1,.lvl3 .need1,.lvl2 .need2,.lvl3 .need2,.lvl3 .need3{opacity:1}
.wind path{stroke:#fff;stroke-width:2.2;stroke-linecap:round;fill:none;opacity:0}
.storming .wind path{animation:gust 1.1s linear infinite}
.storming .wind path:nth-child(2){animation-delay:.35s}.storming .wind path:nth-child(3){animation-delay:.7s}.storming .wind path:nth-child(4){animation-delay:.2s}
@keyframes gust{0%{opacity:0;transform:translateX(-120px)}20%{opacity:.9}100%{opacity:0;transform:translateX(560px)}}
.rain line{stroke:#c9d6e6;stroke-width:1.4;opacity:0}
.storming .rain line{animation:rain .7s linear infinite}
@keyframes rain{0%{opacity:0;transform:translate(0,-30px)}30%{opacity:.8}100%{opacity:0;transform:translate(-14px,40px)}}
.fail .shingle{animation:peel 1.6s ease-in forwards;transform-box:fill-box;transform-origin:left bottom}
.fail .shingle:nth-child(2){animation-delay:.25s}.fail .shingle:nth-child(3){animation-delay:.5s}.fail .shingle:nth-child(4){animation-delay:.8s}.fail .shingle:nth-child(5){animation-delay:1s}.fail .shingle:nth-child(6){animation-delay:1.2s}
@keyframes peel{0%{transform:none}25%{transform:rotate(-14deg)}100%{transform:translate(380px,-140px) rotate(-260deg);opacity:0}}
.drip{opacity:0}
.fail .drip{animation:drip 1s ease-in 1.2s infinite}
.fail .drip:nth-child(2){animation-delay:1.5s}.fail .drip:nth-child(3){animation-delay:1.8s}
@keyframes drip{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(46px)}}
.fail .edge-lift{animation:lift .5s ease-in-out .3s 4 alternate;transform-box:fill-box;transform-origin:right top}
@keyframes lift{to{transform:rotate(-7deg)}}
.fail .bow{animation:bow .45s ease-in-out .4s 5 alternate;transform-box:fill-box;transform-origin:center}
@keyframes bow{to{transform:scaleX(.9) skewY(-3deg)}}
.crack{opacity:0;transition:opacity .2s}
.fail .crack{opacity:1;transition-delay:1s}
.fail .porch-lift{animation:plift .5s ease-in-out .6s 4 alternate;transform-box:fill-box;transform-origin:left center}
@keyframes plift{to{transform:translateY(-9px) rotate(-3deg)}}
.fail .gable-push{animation:gpush .45s ease-in-out .5s 5 alternate;transform-box:fill-box;transform-origin:center bottom}
@keyframes gpush{to{transform:scale(.94,1.03)}}
.flow{stroke:#f2cd6b;stroke-width:4;stroke-dasharray:14 200;stroke-dashoffset:0;opacity:0}
.storming.lvl3 .flow{opacity:1;animation:flow 1.2s linear infinite}
@keyframes flow{to{stroke-dashoffset:-214}}
@media (max-width:900px){.fc-grid{grid-template-columns:1fr}}
.fc-run svg{width:16px!important;height:16px!important;flex:none}
@media (max-width:620px){.fc-levels{display:grid;grid-template-columns:repeat(4,1fr);width:100%;border-radius:14px}.fc-levels button{padding:10px 4px;font-size:12.5px;white-space:normal;line-height:1.15}
  .fc-bar{flex-wrap:wrap}.fc-run{width:100%;justify-content:center}
  .hs circle{r:19px}.hs text{font-size:19px;transform:translateY(3px)}}
@media (prefers-reduced-motion:reduce){.hs.up .pulse,.storming .wind path,.storming .rain line{animation:none}}
</style>

<div class="fc-head rv"><span class="kicker">See the difference</span>
<h2 id="fcH">Same house. Built two ways.</h2>
<p class="lead">Pick a level, pick a storm, then run it. Tap any part of the house to see how it is built. Every Clare home starts at FORTIFIED Roof.</p></div>

<div class="fc-levels" role="tablist" aria-label="Construction level" id="fcLevels">
  <button type="button" role="tab" data-l="0">Conventional</button>
  <button type="button" role="tab" data-l="1">FORTIFIED Roof</button>
  <button type="button" role="tab" data-l="2">Silver</button>
  <button type="button" role="tab" data-l="3">Gold</button>
</div>

<div class="fc-grid">
  <div class="fc-stage rv" id="fcStage">
    <svg viewBox="0 0 640 400" id="fcSvg" aria-label="Drawing of a house showing FORTIFIED construction details">
      <defs><clipPath id="fcRoofClip"><polygon points="96,216 232,118 408,118 544,216"/></clipPath></defs>
      <!-- ground -->
      <rect x="0" y="362" width="640" height="38" fill="#cfd8c4"/>
      <rect x="104" y="350" width="432" height="14" fill="#b9b2a3"/>
      <!-- walls -->
      <rect x="120" y="212" width="400" height="140" fill="#f7f3ea" stroke="#14233f" stroke-width="2"/>
      <g stroke="#e4ddcf" stroke-width="1"><path d="M120 232H520M120 252H520M120 272H520M120 292H520M120 312H520M120 332H520"/></g>
      <!-- attic water (shows when deck unsealed) -->
      <g class="fc-water" id="fcWater"><circle class="drip" cx="200" cy="222" r="3.5" fill="#4a90d9"/><circle class="drip" cx="300" cy="224" r="3.5" fill="#4a90d9"/><circle class="drip" cx="440" cy="222" r="3.5" fill="#4a90d9"/></g>
      <g class="fc-attic"><path d="M120 212L230 140M200 212L250 150M520 212L410 140M440 212L390 150" stroke="#8a6d4a" stroke-width="3"/><path d="M120 212H520" stroke="#8a6d4a" stroke-width="4"/></g>
      <!-- roof -->
      <g id="fcRoof">
        <polygon points="96,216 232,118 408,118 544,216" fill="#5b6576" stroke="#14233f" stroke-width="2"/>
        <g clip-path="url(#fcRoofClip)" stroke="#4a5363" stroke-width="1.2"><path d="M80 136H560M80 154H560M80 172H560M80 190H560M80 208H560"/></g>
        <!-- cutaway: deck boards, nails, seam tape -->
        <g id="fcDeck"><g transform="translate(150 150)">
          <polygon points="0,52 62,8 128,8 128,52" fill="#d9b98a" stroke="#14233f" stroke-width="1.4"/>
          <path d="M44 21V52M86 8V52" stroke="#a8875a" stroke-width="1.2"/>
          <g fill="#6b5a44"><circle cx="20" cy="46" r="1.6"/><circle cx="60" cy="40" r="1.6"/><circle cx="100" cy="44" r="1.6"/><circle cx="104" cy="20" r="1.6"/></g>
          <g class="up-only need1" fill="#9a7414"><circle cx="40" cy="30" r="1.8"/><circle cx="40" cy="44" r="1.8"/><circle cx="48" cy="30" r="1.8"/><circle cx="48" cy="44" r="1.8"/><circle cx="82" cy="16" r="1.8"/><circle cx="82" cy="30" r="1.8"/><circle cx="82" cy="44" r="1.8"/><circle cx="90" cy="16" r="1.8"/><circle cx="90" cy="30" r="1.8"/><circle cx="90" cy="44" r="1.8"/></g>
          <path class="up-only need1" d="M44 20V52M86 8V52" stroke="#f2cd6b" stroke-width="5" opacity=".9"/>
        </g></g>
        <!-- loose shingles that peel in a storm -->
        <g id="fcShingles" fill="#6f7a8c" stroke="#3d4553" stroke-width="1">
          <rect class="shingle" x="300" y="128" width="30" height="14"/><rect class="shingle" x="340" y="146" width="30" height="14"/>
          <rect class="shingle" x="380" y="164" width="30" height="14"/><rect class="shingle" x="420" y="182" width="30" height="14"/>
          <rect class="shingle" x="460" y="198" width="30" height="14"/><rect class="shingle" x="270" y="164" width="30" height="14"/>
        </g>
        <!-- eave edge -->
        <g id="fcEdge"><path class="edge-lift" d="M440 216H544" stroke="#14233f" stroke-width="4"/>
        <path class="up-only need1" d="M96 217H544" stroke="#f2cd6b" stroke-width="4"/></g>
      </g>
      <!-- front gable over porch -->
      <g id="fcGable"><g class="gable-push"><polygon points="248,216 320,150 392,216" fill="#efe8da" stroke="#14233f" stroke-width="2"/>
        <rect x="306" y="182" width="28" height="18" fill="#fff" stroke="#14233f" stroke-width="1.5"/><path d="M308 187h24M308 192h24M308 197h24" stroke="#14233f"/>
        <path class="up-only need2" d="M262 214L320 162 378 214" stroke="#f2cd6b" stroke-width="3" fill="none"/></g></g>
      <!-- porch -->
      <g id="fcPorch"><g class="porch-lift"><rect x="240" y="226" width="160" height="10" fill="#e6dccb" stroke="#14233f" stroke-width="1.5"/></g>
        <rect x="252" y="236" width="10" height="114" fill="#fff" stroke="#14233f" stroke-width="1.5"/><rect x="378" y="236" width="10" height="114" fill="#fff" stroke="#14233f" stroke-width="1.5"/>
        <g class="up-only need2" fill="#f2cd6b"><rect x="250" y="344" width="14" height="6"/><rect x="376" y="344" width="14" height="6"/><rect x="250" y="234" width="14" height="5"/><rect x="376" y="234" width="14" height="5"/></g></g>
      <!-- door -->
      <rect x="304" y="268" width="32" height="82" fill="#26364f" stroke="#14233f" stroke-width="1.5"/><circle cx="330" cy="310" r="2" fill="#d6a63a"/>
      <!-- windows -->
      <g id="fcWin"><g fill="#cfe0f0" stroke="#14233f" stroke-width="1.6"><rect x="150" y="250" width="56" height="64"/><rect x="214" y="250" width="26" height="64"/></g>
        <path d="M178 250V314M150 282H206" stroke="#14233f" stroke-width="1.2"/>
        <path class="crack" d="M158 258l12 10-4 8 10 12M220 262l8 14-6 10" stroke="#14233f" stroke-width="1.2" fill="none"/>
        <g class="up-only need2" fill="none" stroke="#f2cd6b" stroke-width="3"><rect x="147" y="247" width="62" height="70"/><rect x="211" y="247" width="32" height="70"/></g></g>
      <!-- garage -->
      <g id="fcGarage"><g class="bow"><rect x="420" y="262" width="88" height="88" fill="#ece6da" stroke="#14233f" stroke-width="1.8"/>
        <path d="M420 284H508M420 306H508M420 328H508" stroke="#14233f" stroke-width="1"/></g>
        <path class="up-only need2" d="M424 266V346M504 266V346M420 295H508M420 317H508" stroke="#f2cd6b" stroke-width="2.4"/></g>
      <!-- continuous load path (Gold) -->
      <g id="fcPath"><path class="up-only need3" d="M128 214V350M512 214V350" stroke="#f2cd6b" stroke-width="5"/>
        <path class="up-only need3" d="M128 210h10M512 210h-10M122 350h14M518 350h-14" stroke="#9a7414" stroke-width="3"/>
        <path class="flow" d="M128 214V350"/><path class="flow" d="M512 214V350"/></g>
      <!-- weather -->
      <g class="rain"><line x1="60" y1="30" x2="54" y2="44"/><line x1="160" y1="60" x2="154" y2="74"/><line x1="260" y1="20" x2="254" y2="34"/><line x1="360" y1="50" x2="354" y2="64"/><line x1="460" y1="30" x2="454" y2="44"/><line x1="560" y1="70" x2="554" y2="84"/><line x1="110" y1="90" x2="104" y2="104"/><line x1="510" y1="100" x2="504" y2="114"/><line x1="610" y1="40" x2="604" y2="54"/><line x1="210" y1="100" x2="204" y2="114"/></g>
      <g class="wind"><path d="M0 120c60-10 120 10 180 0"/><path d="M0 200c50-8 100 8 150 0"/><path d="M0 70c70-12 140 12 210 0"/><path d="M0 300c40-6 80 6 120 0"/></g>
      <!-- hotspots -->
      <g id="fcHot"></g>
    </svg>
    <div class="fc-result" id="fcResult" role="status"></div>
    <div class="fc-storm" id="fcStorm" role="radiogroup" aria-label="Storm strength"><button type="button" data-s="1" role="radio">Thunderstorm<small>58+ mph</small></button><button type="button" data-s="2" role="radio">Cat 1 hurricane<small>74 to 95 mph</small></button><button type="button" data-s="3" role="radio">Cat 3 hurricane<small>111 to 129 mph</small></button><button type="button" data-s="4" role="radio">EF-2 tornado<small>111 to 135 mph</small></button></div>
    <div class="fc-bar"><span class="lv" id="fcLv"></span><button type="button" class="fc-run" id="fcRun"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8h11a3 3 0 1 0-3-3M3 16h15a3 3 0 1 1-3 3M3 12h8"/></svg>Run the storm</button></div>
  </div>

  <div class="fc-panel rv" id="fcPanel" aria-live="polite"></div>
</div>
<p class="fc-note">Illustration, not a test result. Requirements summarized from IBHS at <a href="https://fortifiedhome.org/" rel="noopener">fortifiedhome.org</a>. Ask Isaac which level fits your home.</p>

<script>
(function(){
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
  function setLevel(l){level=l;paint();}
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
  sp.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b&&!storming){ power=+b.dataset.s; paintStorm(); res.classList.remove('show'); run.lastChild.textContent='Run the storm'; } });
  paintStorm();
  function cap(t){ return t.charAt(0).toUpperCase()+t.slice(1) }
  run.addEventListener('click',function(){
    if(storming) return; storming=true; run.disabled=true; res.classList.remove('show');
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
    setTimeout(function(){ stage.classList.remove('shake'); },2400);
    setTimeout(function(){
      var head='<b>'+L[level]+'</b> in '+STORM[power]+': ';
      if(!failed.length){
        res.innerHTML=head+'everything held.'+(level===3&&power===4?' The roof stayed tied down to the foundation.':'');
      } else {
        var fix=Math.min.apply(null,failed.map(function(p){return p.lv}));
        var said=failed.map(function(p){ if(level===0&&p.k==='path') return 'the whole roof tore off'; if(p.k==='nails') return 'a section of roof deck tore away'; return SAY[p.k]; });
        var ORDER=['path','nails','gable','windows','garage','porch','shingles','deck','edge','vents'];
        failed.sort(function(a,b){return ORDER.indexOf(a.k)-ORDER.indexOf(b.k)});
        said=failed.map(function(p){ if(level===0&&p.k==='path') return 'the whole roof tore off'; if(p.k==='nails') return 'a section of roof deck tore away'; return SAY[p.k]; });
        if(level===0&&power===4) said=said.filter(function(t){return !/shingles|edge|roof deck|vents/.test(t)});
        if(said.length>4) said=said.slice(0,4).concat(['and more']);
        res.innerHTML=head+said.join(', ')+'. <span style="color:var(--muted)">'+L[fix]+' is built for this.</span>';
      }
      res.classList.add('show');
    },2600);
    setTimeout(function(){
      svg.classList.remove('storming','st1','st2','st3','st4'); stage.classList.remove('sky','st1','st2','st3','st4','shake');
      document.querySelectorAll('#fcSvg .fail, #fcSvg .strain, #fcSvg .chunk, #fcSvg .roofoff').forEach(function(n){n.classList.remove('fail','strain','chunk','roofoff')}); svg.classList.remove('roofgone');
      storming=false; run.disabled=false; run.lastChild.textContent='Run it again';
    },power===4&&level===0?7200:5600);
  });
  paint();
})();
</script>
</div></section>
