'use strict';
const assert=require('node:assert/strict');
const route=require('./ai-route');
async function call(payload){let result;const req={};const res={};const body=async(_req,max=12*1024*1024)=>{assert.equal(max,32*1024);return payload};const json=(_res,status,data)=>{result={status,data};return result};await route(req,res,body,json);return result}
(async()=>{
 let r=await call({question:'',subject:'ریاضی',mode:'teacher'});assert.equal(r.status,400,'empty question should be rejected');
 r=await call({question:'قانون دوم نیوتن چیست؟',subject:'فیزیک',mode:'teacher'});assert.equal(r.status,200);assert.match(r.data.answer,/برآیند نیروها|قانون دوم نیوتن/);assert.equal(r.data.local,true);
 r=await call({question:'She ___ to school every day',subject:'زبان انگلیسی',mode:'teacher'});assert.match(r.data.answer,/حال ساده|goes/);
 r=await call({question:'سه تمرین بساز',subject:'شیمی',mode:'practice'});assert.match(r.data.answer,/تمرین‌های پیشنهادی/);
 r=await call({question:'سلام',subject:'not a school subject',mode:'unknown'});assert.equal(r.data.subject,'عمومی');assert.equal(r.data.mode,'teacher');
 console.log('AI route smoke tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
