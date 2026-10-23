#!/usr/bin/env python3
"""Builds every page of the Clare Homes concept site from one shared shell.
Run: python3 build.py   (deploy.sh runs it, then stamps the build number).
Every fact on these pages comes from clare-homes.com. Do not add claims that are not there."""
import json, re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

BEAN = os.path.expanduser('~/Development/louisiana-bean-site/index.html')
DATA = json.load(open('extras.json'))
EX, LOGOS = DATA['extras'], DATA['logos']

SITE = 'https://achyboy.github.io/clare-homes/'

def img(key, cls='', eager=False, sizes=None):
    e = EX[key]
    return '<img src="img/t/%s.webp" srcset="img/t/%s.webp 640w, img/p/%s.webp %dw" sizes="%s" alt="%s" width="%d" height="%d"%s%s>' % (
        key, key, key, e['W'], sizes or '(min-width:900px) 50vw, 100vw', e['alt'], e['w'], e['h'],
        '' if eager else ' loading="lazy" decoding="async"', ' class="%s"' % cls if cls else '')

ICON = {
 'phone': '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"/></svg>',
 'mail': '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
 'text': '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
 'play': '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
}

PEOPLE = [
 ('Isaac Scott', 'Co founder', '337-852-5292', '+13378525292', 'isaac@clare-homes.com'),
 ('Kendall Gilmore', 'Co founder', '337-789-0326', '+13377890326', 'kendall.clarehomes@gmail.com'),
]

NAV = [('index.html', 'Home'), ('fortified.html', 'FORTIFIED'), ('zero-energy-ready.html', 'Zero Energy Ready'),
       ('projects.html', 'Projects'), ('about.html', 'About'), ('contact.html', 'Contact')]

# ---- proven blocks copied from the Louisiana Bean site -------------------------------------
bean = open(BEAN).read()
fresh = bean[bean.index("<script>\n/* Always the newest"):bean.index('</script>', bean.index("/* Always the newest")) + 9]
fresh = re.sub(r"var BUILD='[^']*';", "var BUILD='dev';", fresh)
assert "'lb-fresh-'" in fresh; fresh = fresh.replace("'lb-fresh-'", "'ch-fresh-'")
m0 = bean.index("<script>\n/* Music diagnostics")
m1 = bean.index('</script>', bean.index("/* Background music")) + 9
music = bean[m0:m1]
for a, b in [('LBLOG', 'CHLOG'), ('lbdbg', 'chdbg'), ('lbreset', 'chreset'), ('lbcopy', 'chcopy'), ('lbclose', 'chclose'), ('lbbody', 'chbody'), ("'lb-music'", "'ch-music'")]:
    assert a in music, a
    music = music.replace(a, b)
assert 'lb' not in re.sub(r'[a-z]lb|lb[a-z]', '', music.replace('lbl', '')), 'leftover lb name'

def jsonld():
    d = {
      "@context": "https://schema.org", "@type": "HomeAndConstructionBusiness",
      "name": "Clare Homes", "url": "https://clare-homes.com/",
      "logo": SITE + "img/logo.png", "image": SITE + "video/hero.webp",
      "description": "Lafayette, Louisiana home builder of FORTIFIED, ENERGY STAR and DOE Zero Energy Ready high performance homes. Certified FORTIFIED Professional Contractors.",
      "telephone": "+1-337-852-5292", "email": "isaac@clare-homes.com",
      "address": {"@type": "PostalAddress", "addressLocality": "Lafayette", "addressRegion": "LA", "addressCountry": "US"},
      "areaServed": ["Lafayette, LA", "Acadiana", "Gulf Coast"],
      "foundingDate": "2021",
      "founder": [{"@type": "Person", "name": "Isaac Scott"}, {"@type": "Person", "name": "Kendall Gilmore"}],
      "employee": [{"@type": "Person", "name": "Kendall Gilmore", "telephone": "+1-337-789-0326", "email": "kendall.clarehomes@gmail.com"}],
      "knowsAbout": ["FORTIFIED Roof", "FORTIFIED Gold", "ENERGY STAR Certified Homes", "DOE Zero Energy Ready Home", "Indoor airPLUS", "SIPs"],
    }
    return '<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + '</script>'

def head(title, desc, page, ld=False, preload=''):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0b1626">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}video/hero.webp">
<link rel="icon" href="img/icon.png">
<link rel="apple-touch-icon" href="img/icon.png">
{fresh}
<script src="/visits/t.js" defer></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="site.css">
{preload}{jsonld() if ld else ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="season" role="status"><span class="dot" aria-hidden="true"></span><span id="seasonText">Hurricane season runs June 1 to November 30</span></div>
<header class="hdr">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Clare Homes home"><img src="img/logo.png" alt="Clare Homes" width="640" height="{LOGO_H}"></a>
    <nav class="nav" aria-label="Main">{''.join('<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == page else '', t) for h, t in NAV)}</nav>
    <div class="hdr-actions">
      <a class="btn btn-gold call-mini" href="tel:+13378525292">{ICON['phone']}Call</a>
      <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="sheet" aria-label="Menu"><div><span></span><span></span><span></span></div></button>
    </div>
  </div>
</header>
<nav class="sheet" id="sheet" aria-label="Main menu">{''.join('<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == page else '', t) for h, t in NAV)}</nav>
<main id="main">
'''

def footer():
    ppl = ''.join(f'<li><b style="color:#fff">{n}</b><br><a href="tel:{tel}">{ph}</a><br><a href="mailto:{em}">{em}</a></li>' for n, r, ph, tel, em in PEOPLE)
    return f'''</main>
<footer>
  <div class="wrap grid">
    <div>
      <img class="flogo" src="img/logo.png" alt="Clare Homes" width="640" height="{LOGO_H}" loading="lazy">
      <p>High performance homes, built in Lafayette, Louisiana and along the Gulf Coast. Certified FORTIFIED Professional Contractors.</p>
      <p class="lic">Residential License #: 887514<br>Commercial License #: 77944</p>
    </div>
    <div><h3>Talk to a builder</h3><ul>{ppl}</ul></div>
    <div><h3>Explore</h3><ul>{''.join('<li><a href="%s">%s</a></li>' % (h, t) for h, t in NAV[1:])}<li><a href="http://www.sipslouisiana.com" rel="noopener">SIPS Louisiana</a></li></ul></div>
  </div>
</footer>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
  <div class="lb-top"><span class="lb-count"></span><button type="button" class="lb-close" aria-label="Close photos">&#x2715;</button></div>
  <div class="lb-stage"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="1" height="1"></div>
  <p class="lb-cap" aria-live="polite"></p>
  <div class="lb-nav"><button type="button" class="lb-prev" aria-label="Previous photo">&#x2190;</button><button type="button" class="lb-next" aria-label="Next photo">&#x2192;</button></div>
</div>
<audio id="bgm" loop preload="none" playsinline><source src="music.m4a" type="audio/mp4"></audio>
<button class="music-btn" id="musicbtn" type="button" aria-pressed="false" aria-label="Play music"><span class="eq"><i></i><i></i><i></i></span><span id="musiclbl">Play music</span></button>
<span class="demo-tag" title="A concept, not the live Clare Homes site">Concept preview by Foundation Code</span>
<script src="data.js"></script>
<script src="site.js"></script>
{music}
</body>
</html>
'''

LOGO_H = 0
from PIL import Image
LOGO_H = Image.open('img/logo.png').size[1] * 640 // Image.open('img/logo.png').size[0]

LOGO_DRAW = '''<svg class="logo-draw" viewBox="0 0 120 92" aria-hidden="true" focusable="false">
<path d="M6 70 L58 26 L110 70"/><path d="M84 48 V28 H96 V58"/><circle cx="90" cy="20" r="9"/>
<path class="rays" d="M90 4 V0 M101 9 l3 -3 M106 20 h4 M79 9 l-3 -3"/></svg>'''

def logos_strip():
    items = [('fortified', 'https://fortifiedhome.org/', 'FORTIFIED Roof'), ('gold', 'https://fortifiedhome.org/', 'FORTIFIED Gold'),
             ('zerh', 'https://www.energy.gov/eere/buildings/zero-energy-ready-home-program', 'DOE Zero Energy Ready Home Partner'),
             ('energystar', 'https://www.energystar.gov/', 'ENERGY STAR Partner'), ('airplus', 'https://www.epa.gov/indoorairplus', 'EPA Indoor airPLUS'),
             ('eeba', 'https://www.eeba.org/', 'EEBA, Energy and Environmental Building Alliance'), ('ahba', 'https://acadianhba.com/', 'Acadian Home Builders Association'),
             ('lhba', 'https://www.lhba.org/', 'Louisiana Home Builders Association'), ('lsu', 'https://www.lsuagcenter.com/topics/family_home/home/lahouse', 'LSU AgCenter LaHouse Research and Education Center')]
    def ul(hidden):
        lis = ''.join(f'<li><a href="{u}" rel="noopener"{" tabindex=\"-1\"" if hidden else ""}><img src="img/logos/{k}.webp" alt="{"" if hidden else a}" width="{LOGOS[k]["w"]}" height="{LOGOS[k]["h"]}" loading="lazy" decoding="async" style="width:auto;height:{70 if LOGOS[k]["h"]/LOGOS[k]["w"] > .4 else 44}px"></a></li>' for k, u, a in items)
        return f'<ul{" aria-hidden=\"true\"" if hidden else ""}>{lis}</ul>'
    return f'''<section class="logos" aria-labelledby="logosH"><h2 id="logosH">Programs and memberships</h2>
<div class="marquee">{ul(False)}{ul(True)}</div>
<p class="hint" style="text-align:center;margin-top:16px">Tap a logo to learn more about each program.</p></section>'''

def build_show():
    return f'''<div class="media-grid">
  <div class="yt"><button type="button" data-yt="wIh5x7PMQrA" aria-label="Play The Build Show, part one, on YouTube">{img('buildshow', sizes='(min-width:800px) 50vw, 100vw').replace(' alt="The Build Show filming inside 303 Decatur Lane"', ' alt=""')}<span class="play">{ICON['play']}</span><span class="cap">The Build Show: why a FORTIFIED roof matters</span></button></div>
  <div class="yt"><button type="button" data-yt="h4k5usw-jWE" aria-label="Play The Build Show, part two, on YouTube">{img('parade2', sizes='(min-width:800px) 50vw, 100vw').replace(' alt="Isaac and Kendall in the kitchen at 303 Decatur Lane"', ' alt=""')}<span class="play">{ICON['play']}</span><span class="cap">Part II: the details that make us high performance builders</span></button></div>
</div>'''

def pods():
    eps = [('pod1', 'https://open.spotify.com/episode/0aNeYFrzEZoDqcUCvHgAte', 'Building Fortified Homes (with Isaac Scott)', 'Structure Talk'),
           ('pod2', 'https://open.spotify.com/episode/48P7x3o1bQtDXm3DxT3WHx', 'High Performance Homes with Clare Homes', 'Real Talk With Jim Keaty, #018'),
           ('pod3', 'https://open.spotify.com/episode/2LwBofpFEFnUAg23q2aYCN', 'February Builder of The Month: Clare Homes, Isaac Scott', 'Better Homes, Better Future')]
    return '<div class="pods">' + ''.join(
        f'<a class="pod rv" href="{u}" rel="noopener"><img src="img/t/{k}.webp" alt="" width="640" height="640" loading="lazy" decoding="async"><div><em>Listen on Spotify</em><b>{t}</b><span>{s}</span></div></a>'
        for k, u, t, s in eps) + '</div>'

def contact_cards(dark=False):
    out = ''
    for n, r, ph, tel, em in PEOPLE:
        first = n.split()[0]
        out += f'''<div class="ccard rv"><h3>{n}</h3><div class="role">{r}, Clare Homes</div>
<div class="row"><a class="btn btn-gold" href="tel:{tel}">{ICON['phone']}Call {first}</a><a class="btn btn-line" href="sms:{tel}">{ICON['text']}Text</a><a class="btn btn-line" href="mailto:{em}">{ICON['mail']}Email</a></div>
<a class="plain" href="tel:{tel}">{ph}</a><a class="plain" href="mailto:{em}">{em}</a></div>'''
    return f'<div class="contact-grid">{out}</div>'

def quotes_block(qid):
    s = open('data.js').read(); d = json.loads(s[s.index('{'):s.rindex('}') + 1])
    qs = [(p['quote'], p['title'], p['id']) for p in d['projects'] if p.get('quote')]
    fig = ''.join(f'<figure class="quote"><blockquote>{q["text"]}</blockquote><figcaption>{q["by"]}<span><a href="projects.html#p-{pid}" style="color:inherit">{t}</a></span></figcaption></figure>' for q, t, pid in qs)
    return f'''<div class="quotes" id="{qid}" tabindex="0" role="region" aria-label="Client reviews, swipe for more">{fig}</div>
<div class="qnav"><button type="button" data-qnav="prev" data-target="#{qid}" aria-label="Previous review">&#x2190;</button><button type="button" data-qnav="next" data-target="#{qid}" aria-label="Next review">&#x2192;</button></div>'''

def storm_section(heading_tag='h2', full=False):
    extra = '' if not full else '''<p>Clare Homes’ mission is to build High Performance Homes for our customers and community. Our homes are built to the minimum standards of FORTIFIED Roof and ENERGY STAR.</p>'''
    return f'''<section class="storm" aria-labelledby="stormH">
  <video class="bg" data-bg muted loop playsinline preload="none" poster="video/storm.jpg" aria-hidden="true" tabindex="-1"><source src="video/storm.mp4" type="video/mp4"></video>
  <div class="wrap narrow">
    <span class="kicker">Built for the storm</span>
    <{heading_tag} id="stormH">When severe weather strikes, a FORTIFIED Roof keeps the wind and rain out</{heading_tag}>
    <p class="lead">It prevents a cascade of damage that can destroy the home and belongings. The FORTIFIED Roof model was specifically designed to prevent damage that commonly occurs during:</p>
    <ul class="threats"><li>High winds</li><li>Hurricanes</li><li>Hailstorms</li><li>Severe thunderstorms</li><li>Tornadoes up to EF-2</li></ul>
    <p>This roof assembly is the key to making Clare Homes resilient! We are certified FORTIFIED Professional Contractors.</p>{extra}
    <div class="season-card rv"><div class="lbl">Atlantic hurricane season, live</div><div class="big" id="seasonBig">June 1 to November 30</div>
      <div class="season-track" aria-hidden="true"><i id="seasonFill"></i></div><div class="season-ends" aria-hidden="true"><span>June 1</span><span>November 30</span></div></div>
    {'' if full else '<p style="margin-top:28px"><a class="btn btn-gold" href="fortified.html">How we build FORTIFIED</a></p>'}
  </div>
</section>'''

HERS = '''<div class="hers rv" id="hers">
  <div class="hers-tabs" role="group" aria-label="Pick a home">
    <button type="button" data-id="broussard" aria-pressed="false">Broussard custom</button>
    <button type="button" data-id="decatur" aria-pressed="false">303 Decatur Lane</button>
    <button type="button" data-id="hightower" aria-pressed="false">Hightower net zero</button>
  </div>
  <div class="hers-scale" aria-hidden="true"><div class="hers-pin"><b>HERS</b></div></div>
  <div class="hers-ends" aria-hidden="true"><span>0, more efficient</span><span>150, less efficient</span></div>
  <p class="hers-out" aria-live="polite">Pick a home to see its HERS score.</p>
  <p class="hint" style="margin:0">HERS (Home Energy Rating System) is the nationally recognized system for inspecting and calculating a home’s energy performance. The lower the score, the more efficient the home is. Scores from each home’s HERS rating certificate.</p>
</div>'''

def featured():
    picks = [('gold', 'gold-03', 'Custom build'), ('decatur', None, 'Zero Energy Ready'), ('hightower', None, 'ADU, net zero'),
             ('camellia', None, 'ADU'), ('hoover', None, 'Pool house and remodel'), ('youngsville', None, 'Sold homes')]
    s = open('data.js').read(); d = {p['id']: p for p in json.loads(s[s.index('{'):s.rindex('}') + 1])['projects']}
    out = ''
    for pid, ph, kind in picks:
        p = d[pid]; c = next((x for x in p['photos'] if x['id'] == ph), p['photos'][0])
        out += f'''<a class="card rv" href="projects.html#p-{pid}"><div class="cover"><img src="img/t/{c['id']}.webp" alt="{c['alt']}" width="{c['w']}" height="{c['h']}" loading="lazy" decoding="async"></div>
<div class="body"><div class="where">{kind}{', ' + p['where'] if p['where'] else ''}</div><h3>{p['title']}</h3><ul class="tags">{''.join('<li>%s</li>' % t for t in p['tags'])}</ul></div></a>'''
    return f'<div class="cards three">{out}</div>'

BUILDERS_SHORT = f'''<div class="builders">
  <article class="builder rv">{img('isaac', sizes='(min-width:800px) 50vw, 100vw')}<div class="body"><div class="role">Co founder</div><h3>Isaac Scott</h3>
  <p>Isaac grew up in Lafayette, the heart of cajun country, and knew he wanted to be a homebuilder from a very young age after helping his dad build a fence. He earned his Bachelor of Science in Construction Management from LSU. His mom once asked him, “Why don’t you build sustainable communities?” From that day forward, it became his dream and mission.</p>
  <a class="tel" href="tel:+13378525292">337-852-5292</a></div></article>
  <article class="builder rv">{img('kendall', sizes='(min-width:800px) 50vw, 100vw')}<div class="body"><div class="role">Co founder</div><h3>Kendall Gilmore</h3>
  <p>Kendall was born and raised in Lafayette. His parents built their first home when he was four, and he visited the job site every day. After LSU’s Construction Management program and years in commercial construction, he built homes around New Orleans after hurricanes and through the pandemic, and saw how much a resilient, healthy home matters.</p>
  <a class="tel" href="tel:+13377890326">337-789-0326</a></div></article>
</div>'''

def page_index():
    pre = '<link rel="preload" as="image" href="video/hero.webp">\n'
    h = head('Clare Homes | FORTIFIED Home Builder in Lafayette, LA',
             'Clare Homes builds FORTIFIED, ENERGY STAR and DOE Zero Energy Ready custom homes in Lafayette, Louisiana and along the Gulf Coast. Certified FORTIFIED Professional Contractors.',
             'index.html', ld=True, preload=pre)
    return h + f'''
<section class="hero" aria-labelledby="heroH">
  <video data-bg autoplay muted loop playsinline preload="auto" poster="video/hero.webp" aria-hidden="true" tabindex="-1"><source src="video/hero.mp4" type="video/mp4"></video>
  <div class="wrap">
    {LOGO_DRAW}
    <span class="kicker">Lafayette, Louisiana · Since 2021</span>
    <h1 id="heroH">FORTIFIED home builder in Lafayette, LA</h1>
    <p class="lead">High Performance Homes for our customers and community. Every Clare home is built to the minimum standards of FORTIFIED Roof and ENERGY STAR.</p>
    <div class="row"><a class="btn btn-gold" href="tel:+13378525292">{ICON['phone']}Call Isaac</a><a class="btn btn-ghost" href="projects.html">See our homes</a></div>
    <div class="badges"><img src="img/logos/fortified.webp" alt="FORTIFIED Roof" width="360" height="360"><img src="img/logos/energystar.webp" alt="ENERGY STAR Partner" width="360" height="360"><img src="img/logos/zerh.webp" alt="DOE Zero Energy Ready Home Partner" width="360" height="449"><img src="img/logos/airplus.webp" alt="EPA Indoor airPLUS" width="360" height="360"></div>
  </div>
</section>

<section class="facts" aria-label="Clare Homes at a glance"><div class="wrap"><ul>
  <li class="rv"><b data-count="2021" data-from="2000">2021</b><span>Founded in Lafayette by Isaac Scott and Kendall Gilmore</span></li>
  <li class="rv"><b>1st</b><span>Zero Energy Ready Home for sale in Louisiana, 303 Decatur Lane</span></li>
  <li class="rv"><b>HERS <span data-count="19" data-from="100" style="font:inherit;color:inherit">19</span></b><span>on our first truly net zero project</span></li>
  <li class="rv"><b>2025</b><span>EEBA Excellence in Resiliency Award</span></li>
</ul></div></section>

<section aria-labelledby="whoH"><div class="wrap split">
  <div class="rv"><span class="kicker">Who we are</span><h2 id="whoH">Custom home builders who build for the Gulf Coast</h2>
    <p class="lead">We specialize in building high performance homes. Clare Homes is based in Lafayette, Louisiana, but we are willing to build on your lot located anywhere along the Gulf Coast!</p>
    <p>Isaac and his business partner, Kendall, launched Clare Homes in 2021 with a mission to build High Performance Homes in their community and along the Gulf Coast. Clare Homes has partnered with the EPA and DOE to offer ENERGY STAR and Zero Energy Ready Homes programs.</p>
    <div class="row"><a class="btn btn-line" href="about.html">Meet the builders</a><a class="btn btn-line" href="projects.html#custom">Custom builds</a></div></div>
  <figure class="photo rv" style="margin:0">{img('duo')}</figure>
</div></section>

{storm_section()}

{open('parts/fortified-compare.frag').read()}

<section class="cream leaf-bg" aria-labelledby="zeH"><div class="wrap split">
  <div class="rv"><span class="kicker" style="color:var(--green)">Zero Energy Ready · ENERGY STAR · Indoor airPLUS</span>
    <h2 id="zeH">A Zero Energy Ready Home represents the future of home building</h2>
    <p class="lead">Building to these standards saves homeowners thousands of dollars in total cost of ownership.</p>
    <p>Our homes displaying the ENERGY STAR Certified Home and Indoor airPLUS labels provide unparalleled energy efficiency, comfort, durability, indoor air quality, and peace of mind.</p>
    <a class="btn btn-line" href="zero-energy-ready.html">Zero Energy Ready homes</a></div>
  {HERS}
</div></section>

<section aria-labelledby="projH"><div class="wrap">
  <span class="kicker">Our homes</span><h2 id="projH">Built in Lafayette, Youngsville, Broussard and beyond</h2>
  <p class="lead narrow">Custom builds, ADUs, Zero Energy Ready homes, sold homes and renovations, every photo from a real Clare Homes job.</p>
  {featured()}
  <p style="margin-top:26px"><a class="btn btn-gold" href="projects.html">See every project</a></p>
</div></section>

<section class="cream" aria-labelledby="revH"><div class="wrap">
  <span class="kicker">From our clients</span><h2 id="revH">In their words</h2>
  {quotes_block('homeQuotes')}
</div></section>

<section aria-labelledby="bH"><div class="wrap">
  <span class="kicker">Meet the builders</span><h2 id="bH">Two Lafayette natives, one mission</h2>
  {BUILDERS_SHORT}
</div></section>

<section class="dark" aria-labelledby="mH"><div class="wrap">
  <span class="kicker">Watch and listen</span><h2 id="mH">Featured on Matt Risinger’s The Build Show</h2>
  <p class="lead narrow">Learn the importance of a FORTIFIED roof by watching our home in Lafayette, LA featured on Matt Risinger’s The Build Show.</p>
  {build_show()}
  <h3 style="margin-top:46px;font-size:1.5rem">On the podcasts</h3>
  {pods()}
</div></section>

{logos_strip()}

<section class="dark" aria-labelledby="cH"><div class="wrap">
  <span class="kicker">Let’s build</span><h2 id="cH">Contact us with any of your FORTIFIED questions or needs</h2>
  <p class="lead narrow">Building a custom high performance home, an ADU, or a remodel? Call, text or email Isaac or Kendall directly.</p>
  {contact_cards()}
</div></section>
''' + footer()

def page_fortified():
    h = head('FORTIFIED Home Builder Lafayette LA | FORTIFIED Roof and Gold | Clare Homes',
             'Clare Homes is a certified FORTIFIED Professional Contractor in Lafayette, LA. Every home is built to FORTIFIED Roof minimum, including our FORTIFIED Gold custom home.',
             'fortified.html')
    return h + f'''
<section class="hero page-hero" aria-labelledby="fH">
  <video data-bg autoplay muted loop playsinline preload="auto" poster="video/roof.webp" aria-hidden="true" tabindex="-1"><source src="video/roof.mp4" type="video/mp4"></video>
  <div class="wrap"><span class="kicker">FORTIFIED in Lafayette, LA</span>
  <h1 id="fH">FORTIFIED homes, built by certified FORTIFIED Professional Contractors</h1>
  <p class="lead">Our homes are built to the minimum standards of FORTIFIED Roof and ENERGY STAR.</p></div>
</section>

{storm_section('h2', full=True)}

{open('parts/fortified-compare.frag').read()}

<section aria-labelledby="certH"><div class="wrap split">
  <div class="rv"><span class="kicker">Trained and certified</span><h2 id="certH">We are certified FORTIFIED Professional Contractors</h2>
  <p class="lead">Isaac Scott completed the FORTIFIED Wise Professional Hurricane Exam on November 26, 2023.</p>
  <p>Our homes earn the FORTIFIED Roof designation, like this New Roof certificate from one of our custom builds.</p>
  <p>Please contact us with any of your FORTIFIED questions or needs.</p>
  <div class="row"><a class="btn btn-gold" href="tel:+13378525292">{ICON['phone']}Call Isaac</a><a class="btn btn-line" href="https://fortifiedhome.org/" rel="noopener">fortifiedhome.org</a></div></div>
  <div class="cards" style="grid-template-columns:1fr 1fr">
    <figure class="photo rv" style="margin:0">{img('cert', sizes='(min-width:900px) 25vw, 50vw')}<figcaption>FORTIFIED Wise Professional, Hurricane Exam</figcaption></figure>
    <figure class="photo rv" style="margin:0">{img('fortcert', sizes='(min-width:900px) 25vw, 50vw')}<figcaption>FORTIFIED Roof designation</figcaption></figure>
  </div>
</div></section>

<section class="cream" aria-labelledby="goldH"><div class="wrap split flip">
  <div class="rv"><img src="img/logos/gold.webp" alt="FORTIFIED Gold" width="360" height="171" style="width:180px;margin-bottom:16px" loading="lazy">
  <h2 id="goldH">Our FORTIFIED Gold custom home</h2>
  <p class="lead">After only 3 months from permit to slab and 6 months from frame to finish, our FORTIFIED Gold custom home is complete!</p>
  <p>We broke ground on this FORTIFIED Gold, ENERGY STAR custom build in February 2025. We are grateful for such amazing homeowners that share our values and trust in us!</p>
  <a class="btn btn-gold" href="projects.html#p-gold">See all the photos</a></div>
  <figure class="photo rv" style="margin:0"><button type="button" onclick="openProject('gold',0)" style="all:unset;cursor:zoom-in;display:block" aria-label="Open the FORTIFIED Gold home photos"><img src="img/t/gold-03.webp" srcset="img/t/gold-03.webp 640w, img/p/gold-03.webp 1600w" sizes="(min-width:900px) 50vw, 100vw" alt="Front of the FORTIFIED Gold custom home with a wide driveway" width="640" height="427" loading="lazy" decoding="async"></button></figure>
</div>
<div class="wrap" style="margin-top:40px"><figure class="quote rv"><blockquote>Clare Homes was the perfect builder for us to partner with, as we wanted to build an energy efficient and resilient (FORTIFIED Gold) custom home. Isaac and Kendall’s knowledge, professionalism, and communication made our home build a seamless and enjoyable process. Anyone looking to build a custom home, we strongly recommend giving Clare Homes a call!</blockquote><figcaption>Duane &amp; Susan Hardy<span>FORTIFIED Gold custom home</span></figcaption></figure></div>
</section>

<section aria-labelledby="ibhsH"><div class="wrap split">
  <div class="rv"><span class="kicker">May 2026</span><h2 id="ibhsH">Inside the IBHS Research Center</h2>
  <p class="lead">We had the opportunity to take part in a private tour of the IBHS Research Center in South Carolina with the EEBA Builder Benchmark group, and what an experience!</p>
  <p>Seeing the science and testing behind FORTIFIED construction firsthand reinforces our commitment to building stronger, more resilient homes in Louisiana.</p></div>
  <div class="cards" style="grid-template-columns:1fr 1fr">
    <figure class="photo rv" style="margin:0">{img('ibhs1', sizes='(min-width:900px) 25vw, 50vw')}</figure>
    <figure class="photo rv" style="margin:0">{img('ibhs2', sizes='(min-width:900px) 25vw, 50vw')}</figure>
  </div>
</div></section>

<section class="cream" aria-labelledby="awH"><div class="wrap split flip">
  <div class="rv"><span class="kicker">Recognized</span><h2 id="awH">2025 EEBA Excellence in Resiliency Award</h2>
  <p class="lead">Isaac and Kendall at the 2025 EEBA High Performance Home Builder Summit.</p>
  <p>Isaac was also the February Builder of The Month on the Better Homes, Better Future podcast.</p>
  <a class="btn btn-line" href="https://open.spotify.com/episode/2LwBofpFEFnUAg23q2aYCN" rel="noopener">Listen to the episode</a></div>
  <figure class="photo rv" style="margin:0;max-width:420px">{img('award')}</figure>
</div></section>

<section class="dark" aria-labelledby="bsH"><div class="wrap">
  <span class="kicker">October 2024</span><h2 id="bsH">FORTIFIED on The Build Show</h2>
  <p class="lead narrow">Our home for sale on 303 Decatur Lane was featured on Matt Risinger’s The Build Show. This video explains the ways resilient, above code building practices can better withstand high force winds.</p>
  {build_show()}
</div></section>

{logos_strip()}
''' + cta_footer()

def cta_footer():
    return f'''<section class="dark" aria-labelledby="ctaH"><div class="wrap">
  <span class="kicker">Let’s build</span><h2 id="ctaH">Contact us to build your custom high performance home</h2>
  {contact_cards()}
</div></section>
''' + footer()

def page_zero():
    h = head('Zero Energy Ready Home Louisiana | DOE, ENERGY STAR, Indoor airPLUS | Clare Homes',
             'Clare Homes built the first DOE Zero Energy Ready Home for sale in Louisiana, 303 Decatur Lane in Lafayette. ENERGY STAR and Indoor airPLUS homes with real HERS scores.',
             'zero-energy-ready.html')
    return h + f'''
<section class="hero page-hero" aria-labelledby="zH">
  <img class="poster" src="img/p/deca-03.webp" alt="" width="1600" height="1067" fetchpriority="high">
  <div class="wrap"><span class="kicker" style="color:var(--leaf)">Zero Energy Ready Home</span>
  <h1 id="zH">The first Zero Energy Ready Home for sale in Louisiana</h1>
  <p class="lead">We finished building it at 303 Decatur Lane in Lafayette. Contact us today to visit this unique piece of history!</p>
  <div class="row"><a class="btn btn-gold" href="tel:+13378525292">{ICON['phone']}Call to visit</a><a class="btn btn-ghost" href="projects.html#p-decatur">See the photos</a></div></div>
</section>

<section class="facts" aria-label="303 Decatur Lane"><div class="wrap"><ul>
  <li class="rv"><b>2,325</b><span>square feet</span></li>
  <li class="rv"><b>4 bed, 3 bath</b><span>single family home</span></li>
  <li class="rv"><b>HERS <span data-count="45" data-from="100" style="font:inherit;color:inherit">45</span></b><span>on its HERS rating certificate</span></li>
  <li class="rv"><b>2025</b><span>Acadian Home Builders Association Parade of Homes</span></li>
</ul></div></section>

<section aria-labelledby="whyH"><div class="wrap split">
  <div class="rv"><span class="kicker" style="color:var(--green)">EPA and DOE partner</span><h2 id="whyH">Zero Energy Ready Homes in Louisiana</h2>
  <p class="lead">Clare Homes has partnered with the EPA and DOE to offer ENERGY STAR and Zero Energy Ready Homes programs. Building to these standards saves homeowners thousands of dollars in total cost of ownership.</p>
  <p>A Zero Energy Ready Home represents the future of home building!</p></div>
  {HERS}
</div></section>

<section class="cream" aria-labelledby="airH"><div class="wrap split flip">
  <div class="rv"><span class="kicker" style="color:var(--green)">ENERGY STAR · Indoor airPLUS</span><h2 id="airH">Healthier air inside</h2>
  <p class="lead">Homebuyers today are increasingly concerned about the indoor air quality of their homes.</p>
  <p>Issues like mold, radon, carbon monoxide, and toxic chemicals have received greater attention than ever as poor indoor air quality has been linked to a host of health problems. Our homes displaying the ENERGY STAR Certified Home and Indoor airPLUS labels provide unparalleled energy efficiency, comfort, durability, indoor air quality, and peace of mind.</p>
  <div class="row" style="align-items:center"><img src="img/logos/energystar.webp" alt="ENERGY STAR Partner" width="360" height="360" style="width:86px" loading="lazy"><img src="img/logos/airplus.webp" alt="EPA Indoor airPLUS" width="360" height="360" style="width:86px" loading="lazy"><img src="img/logos/zerh.webp" alt="DOE Zero Energy Ready Home Partner" width="360" height="449" style="width:70px" loading="lazy"></div></div>
  <figure class="photo rv" style="margin:0">{img('hers45')}<figcaption>HERS rating certificate, 303 Decatur Lane</figcaption></figure>
</div></section>

<section aria-labelledby="tlH"><div class="wrap split">
  <div class="rv"><span class="kicker">The road to net zero</span><h2 id="tlH">Our energy highlights</h2>
  <ol class="timeline">
    <li><time>February 2026</time><p>Under construction on a custom build in Carencro which has a FORTIFIED metal roof and will be certified to the Zero Energy Ready Home Standard.</p></li>
    <li><time>April 2025</time><p>Our home at 303 Decatur Lane was a part of the 2025 Acadian Home Builders Association Parade of Homes!</p></li>
    <li><time>October 2024</time><p>303 Decatur Lane was featured on Matt Risinger’s The Build Show.</p></li>
    <li><time>Hightower project</time><p>Our first truly net zero project, with a HERS score of 19.</p></li>
  </ol></div>
  <div class="cards" style="grid-template-columns:1fr 1fr">
    <figure class="photo rv" style="margin:0">{img('carencro1', sizes='(min-width:900px) 25vw, 50vw')}<figcaption>Carencro, 2026</figcaption></figure>
    <figure class="photo rv" style="margin:0">{img('parade', sizes='(min-width:900px) 25vw, 50vw')}<figcaption>Parade of Homes, 2025</figcaption></figure>
  </div>
</div></section>

<section class="cream" aria-labelledby="htH"><div class="wrap split flip">
  <div class="rv"><span class="kicker" style="color:var(--green)">Net zero, HERS 19</span><h2 id="htH">The Hightower garage apartment</h2>
  <p class="lead">Our first truly net zero project, and our client is the man who taught us that hard work and perseverance are the keys to achieving your goals and unlocking your full potential.</p>
  <p>Five time state champion, the second most winningest coach in LHSAA football history, and community leader, Coach Jim Hightower. 17 years later, and it still feels so good to make him proud!</p>
  <a class="btn btn-line" href="projects.html#p-hightower">See the project</a></div>
  <figure class="photo rv" style="margin:0">{img('hers19')}<figcaption>HERS rating certificate, Hightower project</figcaption></figure>
</div></section>

{logos_strip()}
''' + cta_footer()

def page_projects():
    h = head('Custom Home Builder Lafayette LA | Projects | Clare Homes',
             'See Clare Homes projects: FORTIFIED custom homes, Zero Energy Ready homes, ADUs, sold homes in Youngsville and renovations across Lafayette and the Gulf Coast.',
             'projects.html')
    return h + f'''
<section class="dark" style="padding:60px 0 40px" aria-labelledby="pH"><div class="wrap">
  <span class="kicker">Residential projects</span>
  <h1 id="pH" style="font-size:clamp(2rem,7vw,3.6rem)">Custom home builder in Lafayette, LA</h1>
  <p class="lead narrow">We specialize in building high performance homes. Clare Homes is based in Lafayette, Louisiana, but we are willing to build on your lot located anywhere along the Gulf Coast!</p>
  <p style="margin:0;color:var(--on-dark-2)">Residential License #: 887514</p>
</div></section>
<section style="padding-top:30px" aria-label="Project gallery"><div class="wrap">
  <div class="chips" id="chips" role="group" aria-label="Filter projects"></div>
  <p class="hint" id="filterStatus" role="status" style="margin:0 0 6px"></p>
  <div id="projects"><noscript><p>Turn on JavaScript to browse the project photos.</p></noscript></div>
</div></section>
<section class="cream" aria-labelledby="hlH"><div class="wrap narrow">
  <span class="kicker">Project highlights</span><h2 id="hlH">What we have been up to</h2>
  <ol class="timeline">
    <li class="rv"><time>May 2026</time><p>A private tour of the IBHS Research Center in South Carolina with the EEBA Builder Benchmark group.</p></li>
    <li class="rv"><time>February 2026</time><p>Under construction on a custom build in Carencro with a FORTIFIED metal roof, to be certified to the Zero Energy Ready Home Standard.</p></li>
    <li class="rv"><time>April 2025</time><p>303 Decatur Lane was a part of the 2025 Acadian Home Builders Association Parade of Homes!</p></li>
    <li class="rv"><time>February 2025</time><p>We broke ground on a FORTIFIED Gold, Energy Star Custom Build.</p></li>
    <li class="rv"><time>October 2024</time><p>Our home for sale on 303 Decatur Lane was featured on Matt Risinger’s The Build Show.</p></li>
    <li class="rv"><time>August 2024</time><p>We built an ADU in Downtown Lafayette, Camellia Cottage, which is ready to be booked on VRBO and Airbnb!</p></li>
  </ol>
</div></section>
''' + cta_footer()

def page_about():
    h = head('About Clare Homes | Isaac Scott and Kendall Gilmore | Lafayette Home Builders',
             'Meet Isaac Scott and Kendall Gilmore, the LSU trained Lafayette natives behind Clare Homes, a high performance, FORTIFIED and Zero Energy Ready home builder founded in 2021.',
             'about.html')
    return h + f'''
<section class="dark" style="padding:60px 0 50px" aria-labelledby="aH"><div class="wrap split">
  <div><span class="kicker">About</span><h1 id="aH" style="font-size:clamp(2rem,7vw,3.6rem)">High Performance Homes for our customers and community</h1>
  <p class="lead">Clare Homes’ mission is to build High Performance Homes for our customers and community. Our homes are built to the minimum standards of FORTIFIED Roof and ENERGY STAR.</p></div>
  <figure class="photo" style="margin:0">{img('duo', eager=True)}</figure>
</div></section>

<section aria-labelledby="mtbH"><div class="wrap">
  <span class="kicker">Meet the builders</span><h2 id="mtbH">Isaac Scott and Kendall Gilmore</h2>
  <div class="builders">
  <article class="builder rv">{img('isaac', sizes='(min-width:800px) 50vw, 100vw')}<div class="body"><div class="role">Co founder</div><h3>Isaac Scott</h3>
  <p>Isaac grew up in Lafayette, LA, the heart of cajun country. His father worked for the newspaper and his mother was an art teacher, but Isaac knew he wanted to be a homebuilder from a very young age after helping his dad build a fence. In high school, Isaac attended mission trips to Mexico to build churches. It was there that his passion for building grew even deeper, and he decided to attend college for Construction Management.</p>
  <p>Isaac went on to earn his Bachelor of Science in Construction Management from Louisiana State University in Baton Rouge.</p>
  <p>While in college, Isaac’s mom once mentioned to him “Why don’t you build sustainable communities?” From that day forward, it became his dream and mission to start a homebuilding company, whose core competency would be sustainability.</p>
  <p>After nearly a decade in the industry, that dream manifested into reality. Isaac and his business partner, Kendall, launched Clare Homes in 2021 with a mission to build High Performance Homes in their community and along the Gulf Coast.</p>
  <a class="tel" href="tel:+13378525292">337-852-5292</a> · <a class="tel" href="mailto:isaac@clare-homes.com">isaac@clare-homes.com</a></div></article>
  <article class="builder rv">{img('kendall', sizes='(min-width:800px) 50vw, 100vw')}<div class="body"><div class="role">Co founder</div><h3>Kendall Gilmore</h3>
  <p>Kendall was born and raised in Lafayette, Louisiana. His parents built their first home when he was four years old, and that’s when he realized he had passion for homebuilding. He would visit the job site everyday because he loved witnessing something being built from nothing. After high school, when Kendall realized his baseball dreams were over, he knew he would find joy in homebuilding so decided to earn his degree in LSU’s Construction Management curriculum.</p>
  <p>After working several years in commercial construction, Kendall started a new job in the residential industry, building homes in the greater New Orleans area. Kendall worked directly with homeowners after hurricanes and through the COVID-19 pandemic. He quickly realized the importance of building a resilient, healthy home because what matters most to a customer is their health and safety.</p>
  <p>Kendall’s mission now is to provide a pleasant and comfortable homebuilding experience for customers by building a home that will last and keep their family safe and healthy.</p>
  <a class="tel" href="tel:+13377890326">337-789-0326</a> · <a class="tel" href="mailto:kendall.clarehomes@gmail.com">kendall.clarehomes@gmail.com</a></div></article>
  </div>
</div></section>

<section class="cream" aria-labelledby="filmH"><div class="wrap">
  <span class="kicker">Take the tour</span><h2 id="filmH">Walk through a Clare home</h2>
  <video controls playsinline preload="none" poster="video/film.webp" width="1280" height="720" style="width:100%;height:auto;border-radius:var(--r);box-shadow:var(--shadow);background:#000"><source src="video/film.mp4" type="video/mp4">Your browser cannot play this video.</video>
  <p class="hint" style="margin-top:10px">Film by Keaty Real Estate.</p>
</div></section>

<section aria-labelledby="sipsH"><div class="wrap split">
  <div class="rv"><span class="kicker">SIPS Louisiana</span><h2 id="sipsH">In 2025, SIPS Louisiana was acquired by Clare Homes</h2>
  <p class="lead">SIPs are structural insulated panels. Learn more about SIPS Louisiana at sipslouisiana.com.</p>
  <a class="btn btn-line" href="http://www.sipslouisiana.com" rel="noopener">Visit SIPS Louisiana</a></div>
  <div class="rv comm"><span class="kicker">Commercial projects</span><h2 style="font-size:1.7rem">We have our Commercial License</h2>
  <p>Contact us for your high performance Commercial and Multifamily projects!</p><p style="margin:0"><b>Commercial License #: 77944</b><br>Residential License #: 887514</p></div>
</div></section>

<section class="dark" aria-labelledby="podH"><div class="wrap">
  <span class="kicker">Listen</span><h2 id="podH">Isaac and Kendall on the podcasts</h2>
  <p class="lead narrow">On Real Talk With Jim Keaty, Isaac and Kendall share their mission of constructing high performance homes that surpass the standards of resilience and energy efficiency in our region. On Better Homes, Better Future, Isaac talks about what motivated him to enter construction, start his own business in 2021 as a sustainable builder, and how he connected with EEBA.</p>
  {pods()}
</div></section>

{logos_strip()}
''' + cta_footer()

def page_contact():
    h = head('Contact Clare Homes | Custom Home Builder in Lafayette, LA',
             'Call, text or email Clare Homes in Lafayette, LA. Isaac Scott 337-852-5292, Kendall Gilmore 337-789-0326. FORTIFIED, ENERGY STAR and Zero Energy Ready custom homes.',
             'contact.html', ld=True)
    return h + f'''
<section class="dark" style="padding:60px 0" aria-labelledby="ctH"><div class="wrap">
  <span class="kicker">Contact us</span><h1 id="ctH" style="font-size:clamp(2rem,7vw,3.6rem)">Let’s build your high performance home</h1>
  <p class="lead narrow">Clare Homes is based in Lafayette, Louisiana, but we are willing to build on your lot located anywhere along the Gulf Coast! Please contact us with any of your FORTIFIED questions or needs.</p>
  {contact_cards()}
</div></section>
<section class="cream" aria-labelledby="formH"><div class="wrap split">
  <div><span class="kicker">Tell us about it</span><h2 id="formH">Start with a few details</h2>
  <p class="lead">Fill this in and tap Send. It opens an email to the builder you pick, already written, so nothing gets lost.</p>
  <p class="hint">Residential License #: 887514 · Commercial License #: 77944</p></div>
  <form class="ask" id="askForm">
    <label>Your name<input name="name" autocomplete="name" required></label>
    <label>Phone (optional)<input name="phone" type="tel" autocomplete="tel"></label>
    <label>What are you building?<select name="kind">
      <option>Custom home</option><option>FORTIFIED home</option><option>Zero Energy Ready home</option><option>ADU or pool house</option><option>Renovation or addition</option><option>Commercial or multifamily</option><option>SIPs</option><option>Something else</option></select></label>
    <label>Where is the lot? (optional)<input name="where" autocomplete="address-level2"></label>
    <label>Anything else<textarea name="msg"></textarea></label>
    <label>Send to<select name="to"><option value="isaac">Isaac Scott</option><option value="kendall">Kendall Gilmore</option></select></label>
    <button class="btn btn-gold" type="submit">{ICON['mail']}Send email</button>
  </form>
</div></section>
''' + footer()

PAGES = {'index.html': page_index, 'fortified.html': page_fortified, 'zero-energy-ready.html': page_zero,
         'projects.html': page_projects, 'about.html': page_about, 'contact.html': page_contact}
for name, fn in PAGES.items():
    s = fn()
    assert '{' not in re.sub(r'<script.*?</script>|<style.*?</style>|style="[^"]*"', '', s, flags=re.S).replace('{}', ''), name + ': stray brace'
    open(name, 'w').write(s)
    print('wrote', name, len(s))
