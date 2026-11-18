"""Crea l'estensione Chrome/Edge "Glory Archivio" dalla pagina archivio/index.html.
Uso: python3 tools/estensione.py  -> crea estensione/ e Glory-Archivio-estensione.zip"""
import os,re,shutil,json,zipfile,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(R,"estensione")
shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
h=open(os.path.join(R,"archivio","index.html"),encoding="utf-8").read()
js=re.search(r"<script>(.*)</script>",h,re.S).group(1)
h=h.replace("<script>"+js+"</script>",'<script src="archivio.js"></script>')
h=h.replace('<link rel="manifest" href="manifest.webmanifest">\n','').replace('href="../icon-192.png"','href="icon-192.png"')
js=js.replace('if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(function(){});','')
open(os.path.join(out,"archivio.html"),"w",encoding="utf-8").write(h)
open(os.path.join(out,"archivio.js"),"w",encoding="utf-8").write(js)
open(os.path.join(out,"background.js"),"w").write('chrome.action.onClicked.addListener(function(){var u=chrome.runtime.getURL("archivio.html");chrome.tabs.query({url:u},function(t){if(t&&t.length){chrome.tabs.update(t[0].id,{active:true});chrome.windows.update(t[0].windowId,{focused:true})}else chrome.tabs.create({url:u})})});\n')
for f in ["icon-192.png","icon-512.png"]:shutil.copy(os.path.join(R,f),out)
json.dump({"manifest_version":3,"name":"Glory Archivio","version":"1.1","description":"Archivio dei rapportini Glory 2.0 sul PC: importa, cerca per matricola, foto ed Excel.",
 "action":{"default_title":"Glory Archivio","default_icon":{"192":"icon-192.png"}},"background":{"service_worker":"background.js"},
 "icons":{"192":"icon-192.png","512":"icon-512.png"}},open(os.path.join(out,"manifest.json"),"w"),ensure_ascii=False,indent=1)
z=os.path.join(os.path.dirname(out),"Glory-Archivio-estensione.zip")
with zipfile.ZipFile(z,"w",zipfile.ZIP_DEFLATED) as Z:
 for f in sorted(os.listdir(out)):Z.write(os.path.join(out,f),"Glory Archivio/"+f)
print(z)
