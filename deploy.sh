#!/bin/bash
# Build every page, stamp one BUILD into each (BUILD var + every site.css/site.js/data.js/music/video ?v=)
# and version.json, then commit and push. Pages rebuilds in about a minute.
set -e
cd "$(dirname "$0")"
python3 build.py >/dev/null
B=$(date +%Y%m%d-%H%M%S)
python3 - "$B" <<'PY'
import re,sys,glob
b=sys.argv[1]
for p in glob.glob('*.html'):
    s=open(p).read()
    s2,n=re.subn(r"var BUILD='[^']*';", "var BUILD='%s';"%b, s)
    assert n==1, p+': BUILD var missing'
    s2,m=re.subn(r'((?:site\.css|site\.js|data\.js|music\.m4a|video/[\w-]+\.(?:mp4|webp|jpg)))(\?v=[\w-]+)?(?=["\')])', lambda m: m.group(1)+'?v='+b, s2)
    assert m>=4, p+': asset stamps missing'
    open(p,'w').write(s2)
open('version.json','w').write('{"build":"%s"}\n'%b)
PY
git add -A
git commit -qm "${1:-Update} (build $B)"
git push -q
echo "pushed build $B"
