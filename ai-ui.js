(()=>{
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
const $=s=>document.querySelector(s);
function mount(){
 if($('#dyAIOverlay'))return;
 const css=document.createElement('style');css.textContent='';document.head.appendChild(css);
 const b=document.createElement('button');b.id='dyAIOpen';b.className='dy-ai-open';b.innerHTML='<span>✦</span><b>دهم‌یار AI</b><small>دستیار درسی</small>';document.body.appendChild(b);
 const o=document.createElement('div');o.id='dyAIOverlay';o.className='dy-ai-overlay';o.innerHTML=
 '<div class="dy-ai-modal" dir="rtl"><div class="dy-ai-head"><div><div class="dy-ai-kicker">DEHOMYAR AI · V9</div><h2>دستیار هوشمند دهم‌یار ✦</h2><p>سؤال درسی‌ات را بفرست؛ مرحله‌به‌مرحله و متناسب با پایه دهم جواب می‌دهم.</p></div><button id="dyAIClose" class="dy-ai-x">×</button></div><div class="dy-ai-tools"><button data-mode="teacher">👨‍🏫 معلم</button><button data-mode="solve">🧮 حل مسئله</button><button data-mode="check">✅ بررسی جواب</button><button data-mode="practice">📝 تمرین‌ساز</button><button data-mode="summary">📖 خلاصه درس</button></div><div class="dy-ai-row"><select id="dyAISubject"><option value="ریاضی">ریاضی</option><option value="هندسه">هندسه</option><option value="فیزیک">فیزیک</option><option value="شیمی">شیمی</option><option value="عمومی">عمومی</option></select><select id="dyAIMode"><option value="teacher">معلم</option><option value="solve">حل مسئله</option><option value="check">بررسی جواب</option><option value="practice">تمرین‌ساز</option><option value="summary">خلاصه درس</option></select></div><textarea id="dyAIInput" rows="6" placeholder="مثلاً: تابع درجه دوم را ساده و با یک مثال توضیح بده..." maxlength="12000"></textarea><div class="dy-ai-foot"><span id="dyAIStatus">آماده‌ام 🚀</span><button id="dyAISend">ارسال سؤال</button></div><div id="dyAIAnswer" class="dy-ai-answer"></div></div>';
 document.body.appendChild(o);
 const open=()=>{o.classList.add('show');setTimeout(()=>$('#dyAIInput')?.focus(),120)};
 b.onclick=open;$('#dyAIClose').onclick=()=>o.classList.remove('show');o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('show')});
 o.querySelectorAll('.dy-ai-tools button').forEach(x=>x.onclick=()=>{$('#dyAIMode').value=x.dataset.mode;$('#dyAIInput').focus()});
 $('#dyAISend').onclick=send;$('#dyAIInput').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')send()});
}
async function send(){const input=$('#dyAIInput'),ans=$('#dyAIAnswer'),status=$('#dyAIStatus'),btn=$('#dyAISend');const question=input.value.trim();if(!question){status.textContent='اول سؤال را بنویس 🙂';input.focus();return}btn.disabled=true;status.textContent='در حال فکر کردن…';ans.classList.remove('ready');ans.textContent='';try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({question,subject:$('#dyAISubject').value,mode:$('#dyAIMode').value})});const d=await r.json();if(!r.ok)throw new Error(d.error||'پاسخ دریافت نشد');ans.textContent=d.answer||'پاسخی دریافت نشد.';ans.classList.add('ready');status.textContent='پاسخ آماده شد ✓'}catch(e){ans.innerHTML='<div class="dy-ai-error">⚠️ '+esc(e.message||'خطای ارتباط با AI')+'</div>';status.textContent='خطا';}finally{btn.disabled=false}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();