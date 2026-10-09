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
  cl.addEventListener('change',()=>{prefs.classId=cl.value;if(cl.value!=='103'&&(!prefs.track||prefs.track==='math')){tr.value='unknown';prefs.track='unknown'}else if(cl.value==='103'&&!prefs.track){tr.value='math';prefs.track='math'}save();renderSubjects();window.dyLoadHomework?.()});
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
 const oldRender=fn;
 window.dyRenderAdmin=async function(){await oldRender();const root=$('dyAdminRoot');if(!root||!$('dyTitle'))return;
 const subject=$('dySubject');if(subject&&!$('dyClassId')){const w=document.createElement('div');w.className='dy-admin-class';w.innerHTML='<label for="dyClassId">🏫 کلاس مقصد</label><select id="dyClassId" class="dy-select"><option value="all">همهٔ کلاس‌ها</option><option value="101">۱۰۱ · رشته مشخص نشده</option><option value="102">۱۰۲ · رشته مشخص نشده</option><option value="103">۱۰۳ · ریاضی‌فیزیک</option><option value="104">۱۰۴ · رشته مشخص نشده</option></select>';subject.insertAdjacentElement('afterend',w)}
 };
 window.dyRenderAdmin.__dy14=true;
 const originalPublish=window.dyPublish;
 if(typeof originalPublish==='function'&&!originalPublish.__dy14){
  window.dyPublish=async function(){
   const msg=$('dyMsg');try{
    const f=$('dyFile')?.files?.[0];let file=null;
    if(f){if(f.size>8*1024*1024)throw Error('حجم فایل بیشتر از ۸ مگابایت است');file={name:f.name,type:f.type,data:await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(f)})}}
    const form={title:$('dyTitle')?.value,subject:$('dySubject')?.value,date:$('dyDate')?.value,body:$('dyBody')?.value,file,classId:$('dyClassId')?.value||'all'};
    const response=await fetch('/api/homework',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+(sessionStorage.getItem('dy_admin_token')||'')},body:JSON.stringify(form)});
    const d=await response.json();if(!response.ok)throw Error(d.error||'انتشار تکلیف ناموفق بود');
    if(msg)msg.textContent='تکلیف برای '+(form.classId==='all'?'همهٔ کلاس‌ها':'کلاس '+form.classId)+' منتشر شد';
    $('dyTitle').value='';$('dyBody').value='';if($('dyFile'))$('dyFile').value='';
    await window.dyRenderAdmin();await window.dyLoadHomework?.();
   }catch(e){if(msg)msg.textContent=e.message}
  };
  window.dyPublish.__dy14=true;
 }
}
function repairStuckOverlays(){
 // Recover stale full-screen UI left behind by interrupted navigation or cached scripts.
 const splash=$('dy7Splash');
 if(splash){splash.classList.add('hide');splash.style.display='none';splash.setAttribute('aria-hidden','true');}
 const learning=$('dhV10Overlay');
 if(learning){learning.style.display='none';learning.setAttribute('aria-hidden','true');}
 const control=$('dy7Panel');
 if(control){control.style.display='none';}
 const modal=$('md');
 if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
 const command=$('v6cmd');
 if(command){command.classList.remove('show');}
 document.querySelectorAll('.modal.show,[role="dialog"].show').forEach(el=>{
   if(el.id!=='dhV10Overlay') {el.classList.remove('show');el.setAttribute('aria-hidden','true');}
 });
 document.documentElement.classList.remove('dy-global-blur');
 document.body.style.filter='none';
 document.body.style.backdropFilter='none';
 document.body.style.webkitBackdropFilter='none';
}
function boot(){
 repairStuckOverlays();ensurePortal();patchHomework();patchAdminForm();
 // A navigation tap must never leave an unrelated dialog covering the page.
 document.addEventListener('click',e=>{
   if(e.target.closest('#nav button,[data-p]')){
     const modal=$('md');if(modal){modal.classList.remove('show');modal.setAttribute('aria-hidden','true');}
     const cmd=$('v6cmd');if(cmd)cmd.classList.remove('show');
     const panel=$('dy7Panel');if(panel)panel.style.display='none';
   }
 });
 const settings=$('settings');if(settings&&window.MutationObserver){new MutationObserver(()=>{if($('setbox')&&!$('dyPublicSettings'))ensurePortal()}).observe(settings,{childList:true,subtree:true})}
 if($('dyHomework')&&$('dyHwList'))window.dyLoadHomework?.();
 document.addEventListener('click',e=>{const b=e.target.closest('#nav button');if(b&&b.dataset.p==='dyHomework')setTimeout(()=>window.dyLoadHomework?.(),50)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
// Always clear the legacy mobile navigation dimmer when the user interacts.
const clearLegacyDimmer=()=>document.body?.classList.remove('dy-nav-open');
document.addEventListener('click',clearLegacyDimmer,true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')clearLegacyDimmer()},true);
window.addEventListener('pageshow',clearLegacyDimmer);

window.addEventListener('load',()=>{const s=document.getElementById('dy7Splash');if(s){s.classList.add('hide');s.style.display='none'}}, {once:true});
setTimeout(()=>{const s=document.getElementById('dy7Splash');if(s){s.classList.add('hide');s.style.display='none'}},1800);
window.addEventListener('storage',e=>{if(e.key===key){try{prefs=JSON.parse(e.newValue||'{}')}catch{}applyTheme(prefs.theme||'dark')}});
})();
