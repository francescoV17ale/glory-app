/* Glory 2.0 · funzioni comuni all'app (index.html) e al programma Glory Archivio (archivio/index.html).
   Caricato prima dello script principale. Usa PX (prefissi dei modelli) definito nelle pagine. */
/* ---------- Google Drive online (cartella condivisa dei lavori) ---------- */
var GD={cid:"734772581415-0qsblo2m724m9pjda994173bf36v6r3r.apps.googleusercontent.com",fid:"1Y-gv5GMlXuRe8jY2u8Gf7ZlSkPC3oRba",sc:"https://www.googleapis.com/auth/drive",
 ok:location.protocol==="https:"||location.hostname==="localhost",FOLD:"application/vnd.google-apps.folder"};
function gRedir(){return location.origin+location.pathname.replace(/index\.html$/,"")}
function gTokC(){try{var o=JSON.parse(localStorage.getItem("gla_gtok")||"null");if(o&&o.t&&o.e>Date.now()+60000)return o.t}catch(e){}return ""}
/* sil: rinnovo senza chiedere niente (riesce se in Chrome sei ancora collegato a Google) */
function gLogin(st,sil){var q={client_id:GD.cid,redirect_uri:gRedir(),response_type:"token",scope:GD.sc,include_granted_scopes:"true",state:(sil?"~":"")+(st||"")};
 if(sil){q.prompt="none";try{var hm=localStorage.getItem("gla_gmail");if(hm)q.login_hint=hm}catch(e){}}
 location.href="https://accounts.google.com/o/oauth2/v2/auth?"+Object.keys(q).map(function(k){return k+"="+encodeURIComponent(q[k])}).join("&")}
/* al ritorno da Google: il token è nell'indirizzo dopo # */
function gBack(nh){var h=location.hash;if(!/(^|[#&])(access_token|error)=/.test(h))return null;var p={};
 h.replace(/^#/,"").split("&").forEach(function(kv){var i=kv.indexOf("=");if(i>0)p[decodeURIComponent(kv.slice(0,i))]=decodeURIComponent(kv.slice(i+1).replace(/\+/g," "))});
 if(p.access_token)try{localStorage.setItem("gla_gtok",JSON.stringify({t:p.access_token,e:Date.now()+(+p.expires_in||3600)*1000}))}catch(e){}
 try{history.replaceState(null,"",location.pathname+location.search+(nh||""))}catch(e){}var st=p.state||"",sil=st.charAt(0)==="~";if(sil)st=st.slice(1);
 if(p.access_token)gMail();return {st:st,sil:sil,ok:!!p.access_token,err:p.error||""}}
/* rinnovo automatico, al massimo una volta ogni 10 minuti (niente giri a vuoto se Google chiede di accedere) */
function gAuto(st){try{var t=+sessionStorage.getItem("gla_gsil")||0;if(Date.now()-t<6e5)return false;sessionStorage.setItem("gla_gsil",String(Date.now()))}catch(e){return false}gLogin(st,1);return true}
/* la Gmail collegata serve per il rinnovo automatico */
function gMail(){setTimeout(function(){gFetch("https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)").then(function(r){return r.json()}).then(function(j){var m=j&&j.user&&j.user.emailAddress;if(m)try{localStorage.setItem("gla_gmail",m)}catch(e){}}).catch(function(){})},0)}
function gFetch(u,o){var t=gTokC();if(!t)return Promise.reject(new Error("login"));o=o||{};o.headers=o.headers||{};o.headers.Authorization="Bearer "+t;
 return fetch(u,o).then(function(r){if(r.status===401){try{localStorage.removeItem("gla_gtok")}catch(e){}throw new Error("login")}if(!r.ok)throw new Error("http "+r.status);return r})}
/* carica un file nella cartella (anche grande, con le foto) */
function gUp(text,name,parent,type){type=type||"text/plain";var meta={name:name,parents:[parent||GD.fid],mimeType:type};
 return gFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true",{method:"POST",headers:{"Content-Type":"application/json; charset=UTF-8","X-Upload-Content-Type":type},body:JSON.stringify(meta)})
 .then(function(r){var loc=r.headers.get("Location");if(!loc)return gMulti(meta,text,type);return fetch(loc,{method:"PUT",headers:{"Content-Type":type},body:new Blob([text],{type:type})}).then(function(r2){if(!r2.ok)throw new Error("http "+r2.status);return r2.json()})})}
function gMulti(meta,text,type){var b="glory"+Date.now().toString(36);
 return gFetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true",{method:"POST",headers:{"Content-Type":"multipart/related; boundary="+b},
  body:new Blob(["--"+b+"\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n"+JSON.stringify(meta)+"\r\n--"+b+"\r\nContent-Type: "+type+"\r\n\r\n",text,"\r\n--"+b+"--"])}).then(function(r){return r.json()})}
/* Mail: programma di posta del dispositivo oppure Outlook sul web (impostazione gla_mailw, valida per app e programma PC sullo stesso browser) */
function mailWeb(){try{return localStorage.getItem("gla_mailw")==="1"}catch(e){return false}}
function mailOwa(u){var m=/^mailto:([^?]*)\??(.*)$/i.exec(u||"");if(!m)return u;var q={to:decodeURIComponent(m[1]||"")};(m[2]||"").split("&").forEach(function(kv){var i=kv.indexOf("=");if(i>0)q[kv.slice(0,i).toLowerCase()]=decodeURIComponent(kv.slice(i+1).replace(/\+/g," "))});
 return "https://outlook.office.com/mail/deeplink/compose?"+["to","cc","subject","body"].filter(function(k){return q[k]}).map(function(k){return k+"="+encodeURIComponent(q[k])}).join("&")}
function mailGo(u,wn){if(mailWeb()){var w=mailOwa(u);if(wn){wn.location.href=w;return}if(!window.open(w,"_blank"))location.href=w}else{if(wn)wn.close();location.href=u}}
function crm(t){var m=/^\s*([A-Za-z]{1,4}\s?[-–]\s?\d[\w.\/]*|[A-Za-z]{0,4}\d[\w.\/]*)\s*[-–—:·,]?\s+(.+)$/.exec(String(t||""));return m?{c:m[1].replace(/\s+/g,"").replace("–","-"),n:m[2].trim()}:{c:"",n:String(t||"").trim()}}
function rmaGen(s){var src=crm((s.rv&&String(s.rvn||"").trim())?s.rvn:s.cl).n,
 l3=String(src||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z]/g,"").slice(0,3).toUpperCase(),
 num=[PX[s.r1_md],String(s.r1_mat||"").trim()].filter(Boolean).join("-"),er=String(s.r1_er||"").replace(/\s+/g,"").toUpperCase();
 return [l3,num,er].filter(Boolean).join("-")}
