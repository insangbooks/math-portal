import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const elements=new Map();
function element(){return {value:'',textContent:'',hidden:false,disabled:false,dataset:{},classList:{toggle(){}},addEventListener(type,fn){this[type]=fn;},replaceChildren(){},append(){},querySelector(){return this.button??=element();},setAttribute(){},focus(){},showModal(){this.open=true;},close(){this.open=false;}};}
const context=vm.createContext({document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelectorAll(){return [];},createElement:element},localStorage:{getItem(){return null;},setItem(){}},Intl,Date,Math,confirm:()=>true});
vm.runInContext(readFileSync(new URL('./dist/app.js',import.meta.url),'utf8'),context);
vm.runInContext(`
for(const id of ['arithmetic','pattern','logic']){
 for(let i=0;i<100;i++){const q=makeQuestion(id,i,20261017);if(!Number.isSafeInteger(q.answer))throw Error('Invalid question');}
 start(id);for(let i=0;i<5;i++){$('answer').value=String(state.question.answer);$('answer-form').submit({preventDefault(){}});$('next').click();}
 if(state.score!==5||!state.done)throw Error('Scoring failed');
}
if(stats.played!==3||stats.correct!==15||stats.total!==15||stats.best!==5)throw Error('Statistics failed');
start('logic');$('answer').value='1.5';$('answer-form').submit({preventDefault(){}});if(state.answered)throw Error('Invalid answer accepted');
`,context);
console.log('PASS: question generation, 3 complete games, scores, input validation.');
if(process.argv.includes('--logic-only'))process.exit(0);
for(const path of ['/','/app.js','/style.css']){const response=await fetch('http://127.0.0.1:4173'+path);assert.equal(response.status,200);assert.ok(response.headers.get('content-security-policy'));}
assert.equal((await fetch('http://127.0.0.1:4173/package.json')).status,404);
assert.equal((await fetch('http://127.0.0.1:4173/',{method:'POST'})).status,405);
console.log('PASS: question generation, 3 complete games, scores, input validation, HTTP routes and security headers. Visual browser QA unavailable.');
