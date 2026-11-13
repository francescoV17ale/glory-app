"""Genera sng/ (pagina a parte per la sola installazione SNG) da index.html.
Va rilanciato dopo ogni modifica di index.html: python3 build_sng.py"""
import json, os
s = open("index.html", encoding="utf-8").read()
R = [('<link rel="manifest" href="manifest.webmanifest">', '<link rel="manifest" href="manifest.webmanifest">\n<script>window.GLORY_SOLO="sng"</script>'),
     ('<link rel="icon" type="image/png" href="icon-192.png">', '<link rel="icon" type="image/png" href="../icon-192.png">'),
     ('<link rel="apple-touch-icon" href="icon-192.png">', '<link rel="apple-touch-icon" href="../icon-192.png">'),
     ('<title>Glory 2.0</title>', '<title>Glory · SNG</title>'),
     ('<meta name="apple-mobile-web-app-title" content="Glory 2.0">', '<meta name="apple-mobile-web-app-title" content="Glory SNG">')]
for a, b in R:
    assert s.count(a) == 1, a
    s = s.replace(a, b)
os.makedirs("sng", exist_ok=True)
open("sng/index.html", "w", encoding="utf-8").write(s)
m = json.load(open("manifest.webmanifest", encoding="utf-8"))
m.update({"name": "Glory · SNG", "short_name": "Glory SNG", "id": "./", "start_url": "./", "scope": "./",
          "description": "Installazione SNG Suite / SNG 3 e App SNG Cloud"})
m["icons"] = [dict(i, src="../" + i["src"]) for i in m["icons"]]
json.dump(m, open("sng/manifest.webmanifest", "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("sng/ aggiornata")
