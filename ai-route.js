module.exports=async function aiRoute(req,res,body,json){
 const x=await body(req),q=String(x.question||'').trim().slice(0,12000),subject=String(x.subject||'عمومی').slice(0,40),mode=String(x.mode||'teacher').slice(0,30);
 if(!q)return json(res,400,{error:'سؤال خالی است'});
 const url=process.env.AI_API_URL||'';
 const key=process.env.AI_API_KEY||'';
 if(url&&key){try{const rr=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:process.env.AI_MODEL||'default',input:q,subject,mode,language:'fa'})});const d=await rr.json();if(!rr.ok)throw new Error(d?.error?.message||'AI provider error');const answer=String(d.output_text||d.answer||d.text||'').trim();if(answer)return json(res,200,{answer,mode,subject});}catch(e){console.error('[AI provider]',e.message)}}
 const answer=localAnswer(q,subject,mode); return json(res,200,{answer,mode,subject,local:true});
};
function localAnswer(q,subject,mode){
 const m={teacher:'توضیح آموزشی',solve:'حل مرحله‌به‌مرحله',check:'بررسی پاسخ',practice:'تمرین‌سازی',summary:'خلاصه درس'}[mode]||'توضیح آموزشی';
 if(/فیثاغورس|مثلث قائم/.test(q))return 'قضیهٔ فیثاغورس می‌گوید در مثلث قائم‌الزاویه، مربع وتر برابر مجموع مربع دو ضلع قائم است: a²+b²=c². ابتدا وتر را مشخص کن، سپس مقادیر را جای‌گذاری و در پایان جذر بگیر.\n\nدهم‌یار: '+m+' برای '+subject;
 if(/تابع|دامنه|برد/.test(q))return 'برای تابع، ابتدا رابطهٔ y=f(x) را مشخص کن. دامنه مجموعهٔ xهای مجاز است و برد مجموعهٔ yهایی است که تابع تولید می‌کند. برای سؤال‌های دامنه، مخرج را صفر نکن و داخل رادیکال زوج را منفی نکن.\n\nدهم‌یار: '+m+' برای '+subject;
 if(/نیرو|شتاب|قانون دوم نیوتن/.test(q))return 'قانون دوم نیوتن: F_net = m×a. نیروهای وارد بر جسم را مشخص کن، جهت مثبت را انتخاب کن، برآیند نیروها را بنویس و سپس a را به‌دست بیاور.\n\nدهم‌یار: '+m+' برای '+subject;
 return 'سؤال دریافت شد، اما برای پاسخ دقیق‌تر به محتوای درس یا صورت کامل مسئله نیاز دارم.\n\nموضوع: '+subject+'\nحالت: '+m+'\n\nصورت کامل سؤال، گزینه‌ها یا پاسخ خودت را وارد کن تا دهم‌یار بتواند دقیق‌تر بررسی کند.';
}
