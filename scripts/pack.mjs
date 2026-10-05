import fs from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
fs.mkdirSync('site',{recursive:true});for(const f of fs.readdirSync('site'))if(/^source-\d+\.part$/.test(f))fs.unlinkSync('site/'+f);
execFileSync('tar',['-czf','site/source.tar.gz','public']);const source=fs.readFileSync('site/source.tar.gz');fs.unlinkSync('site/source.tar.gz');
const chunk=524288;const parts=[];for(let i=0;i<source.length;i+=chunk){const name=`source-${String(i/chunk).padStart(3,'0')}.part`;fs.writeFileSync('site/'+name,source.subarray(i,i+chunk));parts.push(name)}
fs.writeFileSync('site/manifest.json',JSON.stringify({format:'tar.gz',sha256:createHash('sha256').update(source).digest('hex'),parts},null,2)+'\n');console.log(`Packed ${source.length} bytes in ${parts.length} parts.`);
