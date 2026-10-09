/* DahomYar Public Portal v14: class workspaces, track selector, language menu and theme fixes */
(function(){
'use strict';
const $=id=>document.getElementById(id), safe=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const key='dy-public-v14';let prefs={};try{prefs=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
const tracks=[
 {id:'math',label:'ریاضی‌فیزیک',icon:'📐',subjects:['ریاضی','هندسه','فیزیک','شیمی','فارسی','عربی','دینی','زبان انگلیسی']},
 {id:'science',label:'علوم تجربی',icon:'🧬',subjects:['زیست‌شناسی','شیمی','فیزیک','ریاضی','فارسی','عربی','دینی','زبان انگلیسی']},
 {id:'humanities',label:'علوم انسانی',icon:'📚',subjects:['علوم و فنون ادبی','جامعه‌شناسی','اقتصاد','منطق','عربی','تاریخ','جغرافیا','فارسی','دینی','زبان انگلیسی']},
 {id:'unknown',label:'رشته مشخص نشده',icon:'🧭',subjects:['فارسی','عربی','دینی','زبان انگلیسی','ریاضی','علوم']}
];
const classes=['101','102','103','104'];
const langNames={fa:'فارسی',en:'English',ar:'العربية'};
function save(){try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}}
function ensurePortal(){
 const hw=document.getElementById('dyHomework');
 if(hw&&!document.getElementById('dyPublicFilters')){
  const intro=hw.querySelector('.sub');
  const box=document.createElement('div');box.id='dyPublicFilters';box.className='dy-public-panel';
  box.innerHTML='<div class="dy-public-head"><div><span class="dy-eyebrow">فضای اختصاصی کلاس</span><h2>📚 تکالیف کلاس من</h2><p>کلاس را انتخاب کن تا تکالیف همان کلاس را ببینی.</p></div><div class="dy-chip">پایه دهم · ۱۴۰۵</div></div><label for="dyClassSelect">🏫 کلاس</label><select id="dyClassSelect" class="dy-select"><option value="103">۱۰۳ · ریاضی‌فیزیک</option><option value="101">۱۰۱ · رشته مشخص نشده</option><option value="102">۱۰۲ · رشته مشخص نشده</option><option value="104">۱۰۴ · رشته مشخص نشده</option></select><label for="dyTrackSelect">🧭 رشته</label><select id="dyTrackSelect" class="dy-select"><option value="math">ریاضی‌فیزیک</option><option value="science">علوم تجربی</option><option value="humanities">علوم انسانی</option><option value="unknown">مشخص نشده</option></select><div id="dyTrackSubjects" class="dy-subject-chips"></div><div class="dy-public-note">🔒 انتخاب کلاس فقط برای فیلترکردن تکالیف است؛ تکالیف همهٔ کلاس‌ها با انتخاب کلاس دیگر قابل مشاهده‌اند.</div></div>';
  if(intro)intro.insertAdjacentElement('afterend',box);else hw.prepend(box);
  const cl=$('dyClassSelect'),tr=$('dyTrackSelect');cl.value=classes.includes(prefs.classId)?prefs.classId:'103';tr.value=prefs.track||'math';
  cl.addEventListener('change',()=>{prefs.classId=cl.value;save();window.dyLoadHomework?.()});
  tr.addEventListener('change',()=>{prefs.track=tr.value;save();renderSubjects()});
  renderSubjects();
 }
 const settings=document.getElementById('settings'),setbox=document.getElementById('setbox');
 if(setbox&&!document.getElementById('dyPublicSettings')){
  const el=document.createElement('div');el.id='dyPublicSettings';el.className='dy-public-panel';
  el.innerHTML='<div class="dy-public-head"><div><span class="dy-eyebrow">شخصی‌سازی</span><h2>🎨 ظاهر و زبان</h2><p>تنظیمات روی همین دستگاه ذخیره می‌شود.</p></div></div><label for="dyThemeSelect">🌗 حالت نمایش</label><select id="dyThemeSelect" class="dy-select"><option value="light">☀️ روشن</option><option value="dark">🌙 تاریک</option><option value="auto">🖥️ مطابق دستگاه</option></select><label for="dyLangSelect">🌐 زبان رابط</label><select id="dyLangSelect" class="dy-select"><option value="fa">فارسی</option><option value="en">English</option><option value="ar">العربية</option></select><button id="dyApplyPrefs" class="dy-primary">اعمال تنظیمات</button><p id="dyLangNotice" class="dy-small"></p>';
  setbox.appendChild(el);
  $('dyThemeSelect').value=prefs.theme||'dark';$('dyLangSelect').value=prefs.lang||'fa';
  $('dyApplyPrefs').addEventListener('click',()=>{prefs.theme=$('dyThemeSelect').value;prefs.lang=$('dyLangSelect').value;save();applyTheme(prefs.theme);applyLang(prefs.lang);$('dyLangNotice').textContent=prefs.lang==='fa'?'زبان فارسی فعال است.':prefs.lang==='en'?'English labels for main navigation are enabled; lesson content remains in its original language.':'تم تفعيل ترجمة عناصر التنقل الرئيسية؛ محتوى الدروس يبقى بلغته الأصلية.';});
 }
 applyTheme(prefs.theme||document.documentElement.dataset.theme||'dark');
 if(prefs.lang)applyLang(prefs.lang);
}
function renderSubjects(){const out=$('dyTrackSubjects'),track=tracks.find(x=>x.id===($('dyTrackSelect')?.value||'math'))||tracks[0];if(out)out.innerHTML=track.subjects.map(x=>'<span class="dy-subject-chip">'+safe(x)+'</span>').join('')}
function applyTheme(theme){
 const t=['dark','light','auto'].includes(theme)?theme:'dark';
 document.documentElement.dataset.theme=t==='auto'?(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;
 document.documentElement.style.colorScheme=document.documentElement.dataset.theme;
 document.documentElement.style.setProperty('--dy-bg',t==='dark'?'#0b1020':'#f4f6fb');
 document.documentElement.style.setProperty('--dy-surface',t==='dark'?'#141c30':'#ffffff');
 document.documentElement.style.setProperty('--dy-ink',t==='dark'?'#eef2ff':'#182440');
 document.documentElement.style.setProperty('--dy-muted',t==='dark'?'#a6b2cc':'#74809a');
 document.documentElement.style.setProperty('--dy-line',t==='dark'?'#2a3651':'#e1e7f2');
 document.documentElement.style.setProperty('--dy-shadow',t==='dark'?'0 12px 35px rgba(0,0,0,.22)':'0 12px 35px rgba(30,48,100,.065)');
 document.body.classList.toggle('dy-theme-dark',document.documentElement.dataset.theme==='dark');
 const legacy=window.S;if(legacy&&legacy.st){legacy.st.theme=t;try{localStorage.setItem('dy4',JSON.stringify(legacy))}catch{}}
}
function applyLang(lang){
 const nav={'🏠 داشبورد':{'en':'🏠 Dashboard','ar':'🏠 لوحة التحكم'},'📚 درس‌ها':{'en':'📚 Lessons','ar':'📚 الدروس'},'📅 برنامه هفتگی':{'en':'📅 Weekly plan','ar':'📅 الخطة الأسبوعية'},'➗ ریاضی':{'en':'➗ Math','ar':'➗ الرياضيات'},'📐 هندسه':{'en':'📐 Geometry','ar':'📐 الهندسة'},'⚡ فیزیک':{'en':'⚡ Physics','ar':'⚡ الفيزياء'},'🧪 شیمی':{'en':'🧪 Chemistry','ar':'🧪 الكيمياء'},'🎯 آزمون':{'en':'🎯 Quiz','ar':'🎯 اختبار'},'🏆 پیشرفت':{'en':'🏆 Progress','ar':'🏆 التقدم'},'🤖 Dahomyar AI':{'en':'🤖 Dahomyar AI','ar':'🤖 Dahomyar AI'},'⭐ علاقه‌مندی‌ها':{'en':'⭐ Favorites','ar':'⭐ المفضلة'},'⚙️ تنظیمات':{'en':'⚙️ Settings','ar':'⚙️ الإعدادات'},'📖 فرمول‌نامه':{'en':'📖 Formula book','ar':'📖 كتاب القوانين'},'📝 بانک سؤال':{'en':'📝 Question bank','ar':'📝 بنك الأسئلة'},'🧠 حل‌گر هوشمند':{'en':'🧠 Smart solver','ar':'🧠 الحل الذكي'}};
 document.querySelectorAll('#nav button').forEach(b=>{const raw=b.dataset.originalLabel||b.textContent.trim();if(!b.dataset.originalLabel)b.dataset.originalLabel=raw;const m=nav[raw];b.textContent=lang==='fa'?raw:(m?.[lang]||raw)});
 document.documentElement.lang=lang;
}
function renderHomework(items){
 const box=$('dyHwList');if(!box)return;
 const cl=$('dyClassSelect')?.value||prefs.classId||'103';
 const relevant=(items||[]).filter(x=>!x.classId||x.classId==='all'||x.classId===cl);
 if(!relevant.length){box.innerHTML='<div class="dy-empty"><div>🎉</div><h3>فعلاً تکلیفی برای این کلاس ثبت نشده</h3><p>وقتی دبیر تکلیفی منتشر کند، همین‌جا نمایش داده می‌شود.</p></div>';return}
 box.innerHTML=relevant.map(x=>'<article class="dy-homework-card"><div class="dy-homework-meta"><span>🏫 '+(x.classId==='all'?'همهٔ کلاس‌ها':safe('کلاس '+x.classId))+'</span><span>📘 '+safe(x.subject||'عمومی')+'</span><span>🗓️ '+safe(x.date||'')+'</span></div><h3>'+safe(x.title)+'</h3><p>'+safe(x.body||'')+'</p>'+(x.file?'<a class="dy-primary" href="'+safe(x.file)+'" target="_blank" rel="noopener">📎 مشاهده فایل</a>':'')+'</article>').join('');
}
function patchHomework(){
 if(typeof window.dyLoadHomework!=='function'||window.dyLoadHomework.__dy14)return;
 const original=window.dyLoadHomework;
 const wrapped=async function(){const box=$('dyHwList');if(!box)return;try{const r=await fetch('/api/homework',{cache:'no-store'});if(!r.ok)throw Error('HTTP '+r.status);const d=await r.json();renderHomework(d.items||[])}catch(e){box.innerHTML='<div class="dy-empty"><h3>تکالیف موقتاً در دسترس نیستند</h3><p>اتصال را بررسی و دوباره امتحان کن.</p></div>'}};
 wrapped.__dy14=true;wrapped.original=original;window.dyLoadHomework=wrapped;
}
function patchAdminForm(){
 const fn=window.dyRenderAdmin;if(typeof fn!=='function'||fn.__dy14)return;
 const old=fn;
 window.dyRenderAdmin=async function(){await old();const root=$('dyAdminRoot');if(!root||!$('dyClassId')&&!root.querySelector('#dyTitle'))return;
 const subject=$('dySubject');if(subject&&!$('dyClassId')){const w=document.createElement('div');w.className='dy-admin-class';w.innerHTML='<label for="dyClassId">🏫 کلاس مقصد</label><select id="dyClassId" class="dy-select"><option value="all">همهٔ کلاس‌ها</option><option value="101">۱۰۱ · رشته مشخص نشده</option><option value="102">۱۰۲ · رشته مشخص نشده</option><option value="103">۱۰۳ · ریاضی‌فیزیک</option><option value="104">۱۰۴ · رشته مشخص نشده</option></select>';subject.insertAdjacentElement('afterend',w);const pub=root.querySelector('button[onclick*="dyPublishHomework"]');if(pub){const orig=window.dyPublishHomework;if(orig&&!orig.__dy14){window.dyPublishHomework=async function(){const originalFetch=window.fetch;const select=$('dyClassId');if(!select)return orig();const title=$('dyTitle')?.value,sub=$('dySubject')?.value,date=$('dyDate')?.value,body=$('dyBody')?.value;const fileInput=$('dyFile');const form={title,subject:sub,date,body,classId:select.value};if(fileInput?.files?.[0]){const f=fileInput.files[0];form.file={name:f.name,data:await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)})}}try{const token=localStorage.getItem('dyAdminToken')||sessionStorage.getItem('dyAdminToken')||'';const response=await originalFetch('/api/homework',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify(form)});const d=await response.json();if(!response.ok)throw Error(d.error||'انتشار تکلیف ناموفق بود');const msg=$('dyHwMsg')||$('dyMsg');if(msg)msg.textContent='تکلیف کلاس '+(select.value==='all'?'همه':select.value)+' منتشر شد';window.dyLoadHomework?.();await old();}catch(e){alert(e.message)}};window.dyPublishHomework.__dy14=true}}}
}
function boot(){
 ensurePortal();patchHomework();patchAdminForm();
 const settings=$('settings');if(settings&&window.MutationObserver){new MutationObserver(()=>{if($('setbox')&&!$('dyPublicSettings'))ensurePortal()}).observe(settings,{childList:true,subtree:true})}
 if($('dyHomework')&&$('dyHwList'))window.dyLoadHomework?.();
 document.addEventListener('click',e=>{const b=e.target.closest('#nav button');if(b&&b.dataset.p==='dyHomework')setTimeout(()=>window.dyLoadHomework?.(),50)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('storage',e=>{if(e.key===key){try{prefs=JSON.parse(e.newValue||'{}')}catch{}applyTheme(prefs.theme||'dark')}});
})();
