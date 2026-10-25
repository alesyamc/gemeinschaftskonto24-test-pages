/* Bankseiten: Navigation, Quiz-Höhe, FAQ-Animation, Kommentare (Einwilligung, Zähler, Sortierung). 14.10.2026 */
(function(){var f=document.querySelector('.c-form');if(!f)return;var c=f.elements.consent,s=f.querySelector('.c-status');
f.addEventListener('submit',function(e){if(!c.checked){e.preventDefault();e.stopImmediatePropagation();c.setAttribute('aria-invalid','true');s.className='c-status err';s.textContent='Bitte bestätigen Sie die Einwilligung, damit Ihr Kommentar gesendet werden kann.';c.focus();}},true);
c.addEventListener('change',function(){c.removeAttribute('aria-invalid');if(c.checked&&/Einwilligung/.test(s.textContent))s.textContent='';});})();
addEventListener("keydown",function(e){if(e.key==="Tab")document.documentElement.classList.add("kbd")});addEventListener("mousedown",function(){document.documentElement.classList.remove("kbd")});
(function(){
var dds=[].slice.call(document.querySelectorAll('.nv .dd')),desk=matchMedia('(min-width:980px) and (hover:hover)');
function close(x){dds.forEach(function(d){if(d!==x){d.classList.remove('open');d.querySelector('.dd-btn').setAttribute('aria-expanded','false')}})}
dds.forEach(function(d){var b=d.querySelector('.dd-btn'),t;
 b.addEventListener('click',function(e){e.stopPropagation();var o=desk.matches||!d.classList.contains('open');close(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
 d.addEventListener('mouseenter',function(){if(!desk.matches)return;clearTimeout(t);close(d);d.classList.add('open');b.setAttribute('aria-expanded','true')});
 d.addEventListener('mouseleave',function(){if(!desk.matches)return;t=setTimeout(function(){d.classList.remove('open');b.setAttribute('aria-expanded','false')},180)});
});
document.addEventListener('click',function(e){if(!e.target.closest('.dd'))close()});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=document.querySelector('.dd.open .dd-btn');close();if(o)o.focus()}});
})();
(function(){
var f=document.querySelector('.bk-quiz');if(!f)return;
var qs=[].slice.call(f.querySelectorAll('fieldset.q')),res=f.querySelector('.res');
function fit(){
 f.style.minHeight='';var max=0,top=f.getBoundingClientRect().top;
 var state=qs.map(function(q){return q.hidden});var rh=res.hidden,rHTML=res.innerHTML;
 var fmax=0,nat=[];qs.forEach(function(q){q.style.minHeight='';var o=q.querySelector('.opts');if(o)o.style.marginTop=''});qs.forEach(function(q,i){qs.forEach(function(x){x.hidden=x!==q});res.hidden=true;max=Math.max(max,f.scrollHeight);nat[i]=q.offsetHeight;fmax=Math.max(fmax,nat[i])});qs.forEach(function(q,i){var o=q.querySelector('.opts');if(o)o.style.marginTop=(fmax-nat[i])+'px'});
 qs.forEach(function(x){x.hidden=true});
 var hints=qs.map(function(q){return '<li>'+q.getAttribute('data-hint')+'</li>'}).join('');
 res.innerHTML='<p class="rh">Passt eher weniger</p><ul>'+hints+'</ul><div class="ra"><a class="btn" href="#">Bei comdirect eröffnen ↗</a><a class="alt" href="#">Gute Alternativen ansehen</a></div>';
 var qmax=max;res.hidden=false;var ag=f.querySelector('.again'),agh=ag.hidden;ag.hidden=false;max=Math.max(max,f.scrollHeight);ag.hidden=agh;
 res.innerHTML=rHTML;res.hidden=rh;qs.forEach(function(q,i){q.hidden=state[i]});
 f.style.minHeight=max+'px';
}
window.addEventListener('load',fit);addEventListener('resize',function(){clearTimeout(fit.t);fit.t=setTimeout(fit,150)});
if(document.fonts)document.fonts.ready.then(fit);
})();
(function(){
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.faq details').forEach(function(d){
 var s=d.querySelector('summary'),a=d.querySelector('.a'),anim=null;
 s.addEventListener('click',function(e){
  if(reduce)return; e.preventDefault(); if(anim)anim.cancel();
  if(!d.open){
   d.open=true; var hgt=a.scrollHeight;
   anim=a.animate([{height:'0px',opacity:0,transform:'translateY(-4px)'},{height:hgt+'px',opacity:1,transform:'none'}],{duration:320,easing:'cubic-bezier(.2,.7,.2,1)'});
   anim.onfinish=function(){anim=null};
  }else{
   var hgt=a.offsetHeight; d.classList.add('closing');
   anim=a.animate([{height:hgt+'px',opacity:1},{height:'0px',opacity:0}],{duration:240,easing:'cubic-bezier(.4,0,.2,1)'});
   anim.onfinish=function(){d.open=false;d.classList.remove('closing');anim=null};
   anim.oncancel=function(){d.classList.remove('closing')};
  }
 });
});})();
(function(){
var hero=document.querySelector('.hero'),tabs=document.querySelector('.tabs'),bar=document.querySelector('.mbar'),foot=document.querySelector('.site-foot');
/* Leiste oben (Tabs) und unten (Bank-Knopf): erst nach dem Kopfbereich, die untere nicht mehr über der Fußzeile */
function bars(){if(!hero||!tabs||!bar)return;var out=hero.getBoundingClientRect().bottom<0,inFoot=foot&&foot.getBoundingClientRect().top<innerHeight;
 tabs.classList.toggle('show',out);bar.classList.toggle('show',out&&!inFoot)}
addEventListener('scroll',bars,{passive:true});addEventListener('resize',bars);bars();
var links=[].slice.call(document.querySelectorAll('.tabs ul a,.side-nav a')),map=links.map(function(a){var h=a.getAttribute('href')||'';return h.charAt(0)==='#'?document.getElementById(decodeURIComponent(h.slice(1))):null});/* getElementById: ids dürfen mit Ziffer beginnen (1822direkt), querySelector brach dort ab (22.10.2026) */
/* Reiter-Leiste: zeigt mit Verlauf und Pfeil, dass sie seitlich weitergeht (21.10.2026) */
var tul=tabs&&tabs.querySelector('ul'),tsc=null;
if(tul){tsc=document.createElement('div');tsc.className='tabs-sc';tul.parentNode.insertBefore(tsc,tul);tsc.appendChild(tul);
 var chev='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
 ['l','r'].forEach(function(d){var b=document.createElement('button');b.type='button';b.className='tabs-ar '+d;b.tabIndex=-1;b.setAttribute('aria-hidden','true');b.innerHTML=chev;
  b.addEventListener('click',function(){tul.scrollBy({left:(d==='r'?1:-1)*tul.clientWidth*.7,behavior:'smooth'})});tsc.appendChild(b)});
 var tupd=function(){var m=tul.scrollWidth-tul.clientWidth;tsc.classList.toggle('ml',tul.scrollLeft>4);tsc.classList.toggle('mr',tul.scrollLeft<m-4)};
 tul.addEventListener('scroll',tupd,{passive:true});addEventListener('resize',tupd);tupd();}
var lastOn=null;
addEventListener('scroll',function(){var cur=null;map.forEach(function(s){if(s&&s.getBoundingClientRect().top<220)cur=s});links.forEach(function(a,i){a.classList.toggle('on',map[i]===cur)});
 if(tul){var on=tul.querySelector('a.on');if(on&&on!==lastOn){lastOn=on;var l=on.getBoundingClientRect().left-tul.getBoundingClientRect().left+tul.scrollLeft,w=on.offsetWidth;if(l<tul.scrollLeft+40||l+w>tul.scrollLeft+tul.clientWidth-40)tul.scrollTo({left:l-40,behavior:'smooth'})}}},{passive:true});

})();
(function(){var r=document.querySelector('.bk-quiz .res');if(!r)return;new MutationObserver(function(){r.querySelectorAll('li').forEach(function(li){if(li.dataset.t)return;li.dataset.t=1;li.innerHTML=li.innerHTML.replace(new RegExp('\\b('+(document.body.dataset.tarife||'#').split(',').join('|')+')\\b','g'),'<span class="tarif">$1</span>')})}).observe(r,{childList:true,subtree:true})})();
(function(){
var sec=document.querySelector('[data-comments]');if(!sec)return;
var list=sec.querySelector('.c-list'),cnt=sec.querySelector('.c-count'),sel={value:'new'},bar=sec.querySelector('.c-bar');
function d(li){var t=li.querySelector('time');return t?(t.getAttribute('datetime')||''):''}
function upd(){var items=[].slice.call(list.children),q=items.length,a=list.querySelectorAll('.c-author').length;
 bar.hidden=q===0;var n=list.querySelectorAll('.c-item').length;cnt.textContent=n+(n===1?' Kommentar':' Kommentare');}
function sort(){var v=sel.value,items=[].slice.call(list.children);items.sort(function(x,y){
 if(v==='ans'){var ax=!!x.querySelector('.c-author'),ay=!!y.querySelector('.c-author');if(ax!==ay)return ay-ax}
 return v==='old'?d(x).localeCompare(d(y)):d(y).localeCompare(d(x))});items.forEach(function(li){list.appendChild(li)})}
var sb=sec.querySelector('.srt-btn'),sl=sec.querySelector('.srt-list'),opts=[].slice.call(sl.children),sv=sec.querySelector('#srt-v'),ai=0;
function open(o){sl.hidden=!o;sb.setAttribute('aria-expanded',o);if(o){ai=opts.findIndex(function(x){return x.getAttribute('aria-selected')==='true'});hl();sl.focus()}}
function hl(){opts.forEach(function(x,i){x.classList.toggle('act',i===ai)})}
function pick(i){opts.forEach(function(x,k){x.setAttribute('aria-selected',k===i)});sel.value=opts[i].dataset.v;sv.textContent=opts[i].textContent;sort();open(false);sb.focus()}
sb.addEventListener('click',function(){open(sl.hidden)});
opts.forEach(function(o,i){o.addEventListener('click',function(){pick(i)});o.addEventListener('mousemove',function(){ai=i;hl()})});
sl.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){ai=Math.min(ai+1,opts.length-1);hl();e.preventDefault()}else if(e.key==='ArrowUp'){ai=Math.max(ai-1,0);hl();e.preventDefault()}else if(e.key==='Enter'||e.key===' '){pick(ai);e.preventDefault()}else if(e.key==='Escape'||e.key==='Tab'){open(false);sb.focus()}});
document.addEventListener('click',function(e){if(!e.target.closest('.srt'))open(false)});
new MutationObserver(function(){upd()}).observe(list,{childList:true});
upd();sort();
})();

/* Hell/Dunkel: Wahl wird im Browser gemerkt (localStorage, kein Cookie) */
(function(){
var root=document.documentElement;
function set(d){if(d)root.dataset.theme='dark';else delete root.dataset.theme;
 try{localStorage.setItem('g24-theme',d?'dark':'light')}catch(e){}
 document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.setAttribute('aria-pressed',d?'true':'false')})}
document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
 b.setAttribute('aria-pressed',root.dataset.theme==='dark'?'true':'false');
 b.addEventListener('click',function(){set(root.dataset.theme!=='dark')})});
})();

/* Suche über alle Seiten (Index: assets/js/search-index.js) */
(function(){
var dlg=document.getElementById('srch');if(!dlg)return;
var inp=dlg.querySelector('input'),list=dlg.querySelector('.srch-res'),last=null,sel=-1;
var base=document.body.dataset.root||'',local=document.body.dataset.local==='1';
function href(u){var h=u.split('#');var p=h[0].replace(/^\//,'');return base+p+(local&&!/\.html$/.test(p)?'index.html':'')+(h[1]?'#'+h[1]:'')}
function norm(s){return (s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9€ ]+/g,' ')}
function esc(s){return s.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function hl(s,terms){var out=esc(s);terms.forEach(function(t){if(t.length<2)return;
 var re=new RegExp((t.length<=3?'(?<![A-Za-zÄÖÜäöüß])':'')+'('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ae/g,'(?:ae|ä)').replace(/oe/g,'(?:oe|ö)').replace(/ue/g,'(?:ue|ü)').replace(/ss/g,'(?:ss|ß)')+')','gi');
 out=out.replace(re,'<mark>$1</mark>')});return out}
/* kurze Begriffe (ING, N26) nur am Wortanfang, längere auch mitten im Wort (Meldeadresse) */
function has(h,x){return x.length<=3?(' '+h).indexOf(' '+x)>-1:h.indexOf(x)>-1}
function data(){return (window.G24_SEARCH||{pages:[]}).pages}
var oid=0;function item(p,terms){return '<li><a href="/gemeinschaftskonto24-test-pages/assets/js/'+href(p.u)+'" role="option" id="srch-o'+(oid++)+'" aria-selected="false"><span><span class="t">'+hl(p.t,terms)+'</span>'+(p.d?'<span class="d">'+hl(p.d,terms)+'</span>':'')+'</span><span class="k">'+esc(p.k)+'</span></a></li>'}
function run(){
 var q=norm(inp.value).trim(),terms=q.split(/\s+/).filter(Boolean),pages=data(),html='';sel=-1;oid=0;inp.removeAttribute('aria-activedescendant');
 if(!terms.length){
  var tops=pages.filter(function(p){return p.top});
  html='<li class="srch-h">Beliebt</li>'+tops.map(function(p){return item(p,[])}).join('');
 }else{
  var hits=[],faqs=[];
  pages.forEach(function(p){
   var t=norm(p.t),d=norm(p.d),hay=t+' '+d+' '+norm(p.w);
   if(terms.every(function(x){return has(hay,x)})){
    var sc=0;terms.forEach(function(x){if(t.indexOf(x)>-1)sc+=6;if(t.indexOf(x)===0)sc+=3;if((' '+t).indexOf(' '+x)>-1)sc+=2;if(d.indexOf(x)>-1)sc+=3});
    hits.push([sc+(p.top?1:0),p])}
   (p.f||[]).forEach(function(f){var nf=norm(f);if(terms.every(function(x){return has(nf,x)}))faqs.push({t:f,d:p.t,u:p.u.split('#')[0]+'#fragen',k:'Frage'})})
  });
  hits.sort(function(a,b){return b[0]-a[0]});
  if(hits.length)html+='<li class="srch-h">Seiten</li>'+hits.slice(0,8).map(function(h){return item(h[1],terms)}).join('');
  if(faqs.length)html+='<li class="srch-h">Häufige Fragen</li>'+faqs.slice(0,5).map(function(f){return item(f,terms)}).join('');
  if(!html)html='<li class="srch-empty">Nichts gefunden zu „'+esc(inp.value)+'“. Versuchen Sie einen Banknamen oder ein Stichwort wie „kostenlos“ oder „Adresse“.</li>';
 }
 list.innerHTML=html;
 /* Trefferzahl für Screenreader (Barrierefreiheit 18.10.2026) */
 var st=document.getElementById('srch-n'),n=list.querySelectorAll('a').length;clearTimeout(run.t);
 if(st)run.t=setTimeout(function(){st.textContent=terms.length?(n?n+(n===1?' Ergebnis':' Ergebnisse')+', mit Pfeiltasten auswählen':'Nichts gefunden'):''},400);
}
function links(){return [].slice.call(list.querySelectorAll('a'))}
function mark(i){var a=links();if(!a.length)return;sel=(i+a.length)%a.length;a.forEach(function(x,j){x.setAttribute('aria-selected',j===sel?'true':'false')});inp.setAttribute('aria-activedescendant',a[sel].id);a[sel].scrollIntoView({block:'nearest'})}
function open(){last=document.activeElement;dlg.hidden=false;document.body.classList.add('srch-open');inp.value='';run();inp.focus()}
function close(){dlg.hidden=true;document.body.classList.remove('srch-open');if(last&&last.focus)last.focus()}
document.querySelectorAll('[data-search-open]').forEach(function(b){b.addEventListener('click',open)});
dlg.querySelector('.srch-x').addEventListener('click',close);
dlg.addEventListener('click',function(e){if(e.target===dlg)close()});
inp.addEventListener('input',run);
dlg.addEventListener('keydown',function(e){
 if(e.key==='Escape'){e.preventDefault();close()}
 else if(e.key==='ArrowDown'){e.preventDefault();mark(sel+1)}
 else if(e.key==='ArrowUp'){e.preventDefault();mark(sel-1)}
 else if(e.key==='Enter'){var a=links();var t=a[sel>-1?sel:0];if(t){e.preventDefault();location.href=t.href}}
 else if(e.key==='Tab'){var f=[inp].concat(links(),[dlg.querySelector('.srch-x')]);var i=f.indexOf(document.activeElement);
  if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();inp.focus()}}
});
document.addEventListener('keydown',function(e){
 if(!dlg.hidden)return;var tag=(e.target.tagName||'').toLowerCase();
 if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&tag!=='input'&&tag!=='textarea')){e.preventDefault();open()}
});
})();
/* Autorenkarte: Esc blendet sie aus, bis Maus/Fokus den Namen verlassen (WCAG 1.4.13). 19.10.2026 */
(function(){var au=document.querySelector('.ap');if(!au)return;
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&(au.matches(':hover')||au.contains(document.activeElement))){au.classList.add('ap-off');var n=au.querySelector('.ap-name');if(au.contains(document.activeElement)&&n)n.focus()}});
au.addEventListener('mouseleave',function(){if(!au.contains(document.activeElement))au.classList.remove('ap-off')});
au.addEventListener('focusout',function(e){if(!au.contains(e.relatedTarget)&&!au.matches(':hover'))au.classList.remove('ap-off')});})();
/* Autorenkarte nach oben öffnen, wenn unten im Fenster kein Platz ist. 19.10.2026 */
(function(){var au=document.querySelector('.ap');if(!au)return;var c=au.querySelector('.ap-card');
function place(){var r=au.getBoundingClientRect(),h=c.offsetHeight+16;au.classList.toggle('ap-up',innerHeight-r.bottom<h&&r.top>h)}
au.addEventListener('mouseenter',place);au.addEventListener('focusin',place);})();
/* Ratgeber-Menü: Themenbereich per Maus, Fokus oder Pfeiltasten wählen (19.10.2026) */
(function(){var tl=document.querySelector('.rg-cats');if(!tl)return;var ts=[].slice.call(tl.querySelectorAll('.rgk')),t;
function sel(i,f){ts.forEach(function(b,n){var on=n===i;b.setAttribute('aria-selected',on?'true':'false');b.tabIndex=on?0:-1;document.getElementById(b.getAttribute('aria-controls')).classList.toggle('on',on)});if(f)ts[i].focus()}
ts.forEach(function(b,i){b.addEventListener('mouseenter',function(){clearTimeout(t);t=setTimeout(function(){sel(i)},90)});b.addEventListener('mouseleave',function(){clearTimeout(t)});b.addEventListener('click',function(){sel(i)});b.addEventListener('focus',function(){sel(i)});
 b.addEventListener('keydown',function(e){var m=ts.length-1,k=e.key;if(k==='ArrowDown'||k==='ArrowRight'){e.preventDefault();sel(i===m?0:i+1,true)}else if(k==='ArrowUp'||k==='ArrowLeft'){e.preventDefault();sel(i?i-1:m,true)}})})})();

/* Autorenkarte auch über das Foto: Hover zeigt die Karte, Klick führt zu Über mich (21.10.2026) */
(function(){var au=document.querySelector('.ap');if(!au)return;var box=au.closest('.author'),im=box&&box.querySelector(':scope>img'),n=au.querySelector('.ap-name'),c=au.querySelector('.ap-card');if(!im||!n)return;
im.style.cursor='pointer';im.addEventListener('click',function(){location.href=n.href});
im.addEventListener('mouseenter',function(){var r=au.getBoundingClientRect(),h=c.offsetHeight+16;au.classList.toggle('ap-up',innerHeight-r.bottom<h&&r.top>h)});
im.addEventListener('mouseleave',function(){if(!au.contains(document.activeElement))au.classList.remove('ap-off')});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&im.matches(':hover'))au.classList.add('ap-off')});})();

/* Prämien-Badge: Tippen öffnet/schließt das Erklärfenster, Esc schließt (21.10.2026) */
(function(){var ws=document.querySelectorAll('.vg-bw');if(!ws.length)return;
document.addEventListener('click',function(e){var b=e.target.closest('.vg-bonus,.vg-more'),w=b&&b.closest('.vg-bw');[].forEach.call(document.querySelectorAll('.vg-bw.open'),function(x){if(x!==w)x.classList.remove('open')});if(w){w.classList.toggle('open');w.classList.remove('off')}});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;[].forEach.call(ws,function(w){if(w.matches(':hover')||w.contains(document.activeElement)||w.classList.contains('open')){w.classList.remove('open');w.classList.add('off')}})});
[].forEach.call(ws,function(w){w.addEventListener('mouseleave',function(){if(!w.contains(document.activeElement))w.classList.remove('off')});w.addEventListener('focusout',function(e){if(!w.contains(e.relatedTarget))w.classList.remove('off','open')})});})();

/* Prämienzeile: Bedingungsfenster unter „So geht’s“ ausrichten, Spitze zeigt auf den Link (21.10.2026) */
(function(){[].forEach.call(document.querySelectorAll('.vg-strip'),function(s){var b=s.querySelector('.vg-more'),p=s.querySelector('.vg-pop');if(!b||!p)return;
function place(){var x=Math.max(0,Math.min(b.offsetLeft-14,s.clientWidth-p.offsetWidth));p.style.left=x+'px';p.style.setProperty('--ax',(b.offsetLeft-x+12)+'px')}
s.addEventListener('mouseenter',place);s.addEventListener('focusin',place);b.addEventListener('click',place);window.addEventListener('resize',place);place()})})();
