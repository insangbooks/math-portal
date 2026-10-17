import http from 'node:http';
import {readFile} from 'node:fs/promises';
const files = new Map([['/', ['index.html','text/html; charset=utf-8']],['/app.js',['app.js','text/javascript; charset=utf-8']],['/style.css',['style.css','text/css; charset=utf-8']]]);
const server=http.createServer(async(req,res)=>{
  const item=files.get(new URL(req.url,'http://localhost').pathname);
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  if(!item){res.writeHead(404);res.end('Not found');return;}
  try{const body=await readFile(new URL('./dist/'+item[0],import.meta.url));res.writeHead(200,{'Content-Type':item[1],'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"});res.end(req.method==='HEAD'?undefined:body);}catch{res.writeHead(500);res.end('Unable to load page');}
});
server.listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?'Port 4173 is already in use.': 'Local server could not start.');process.exitCode=1;});
