import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
if(fs.existsSync('site/manifest.json')){
 const manifest=JSON.parse(fs.readFileSync('site/manifest.json','utf8'));const archive=Buffer.concat(manifest.parts.map(p=>fs.readFileSync(path.join('site',p))));
 if(createHash('sha256').update(archive).digest('hex')!==manifest.sha256)throw new Error('The original site source archive failed integrity verification');
 fs.writeFileSync('site/source.tar.gz',archive);execFileSync('tar',['-xzf','site/source.tar.gz']);fs.unlinkSync('site/source.tar.gz');
}
if(fs.existsSync('site/pages-manifest.json')){
 const pages=JSON.parse(fs.readFileSync('site/pages-manifest.json','utf8'));const archive=Buffer.concat(pages.parts.map(p=>fs.readFileSync(path.join('site',p))));
 if(createHash('sha256').update(archive).digest('hex')!==pages.sha256)throw new Error('Page archive failed integrity verification');
 fs.writeFileSync('site/page-overrides.tar.gz',archive);execFileSync('tar',['-xzf','site/page-overrides.tar.gz']);fs.unlinkSync('site/page-overrides.tar.gz');
}
if(!fs.existsSync('public/index.html'))throw new Error('The original homepage is missing');
function unwrapProductLinks(text){const stack=[];return text.replace(/<\/?a\b[^>]*>/gi,tag=>{if(/^<\/a/i.test(tag))return stack.pop()?'':tag;const remove=/woocommerce-LoopProduct-link/.test(tag);stack.push(remove);return remove?'':tag})}
function clean(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())clean(file);else if(/\.(html|css|js|json|svg)$/.test(file)){let text=fs.readFileSync(file,'utf8');if(file.endsWith('.html'))text=unwrapProductLinks(text);text=text.replace(/http%3A%2F%2F(?:localhost%3A8084|pi2\.local%3A8084|127\.0\.0\.1%3A8084)/gi,'https%3A%2F%2Fprohibitioncakes.vercel.app');text=text.replace(/<link\b[^>]*type=["'](?:application\/json\+oembed|text\/xml\+oembed)["'][^>]*>/gi,'');fs.writeFileSync(file,text)}}}
clean('public');
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});console.log('Prohibition Cakes: original WordPress frontend exported to dist.');
