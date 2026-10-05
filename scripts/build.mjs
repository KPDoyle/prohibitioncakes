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
if(fs.existsSync('site/overrides'))fs.cpSync('site/overrides','public',{recursive:true});
function unwrapProductLinks(text){const stack=[];return text.replace(/<\/?a\b[^>]*>/gi,tag=>{if(/^<\/a/i.test(tag))return stack.pop()?'':tag;const remove=/woocommerce-LoopProduct-link/.test(tag);stack.push(remove);return remove?'':tag})}
function clean(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())clean(file);else if(/\.(html|css|js|json|svg)$/.test(file)){let text=fs.readFileSync(file,'utf8');if(file.endsWith('.html'))text=unwrapProductLinks(text);text=text.replace(/http%3A%2F%2F(?:localhost%3A8084|pi2\.local%3A8084|127\.0\.0\.1%3A8084)/gi,'https%3A%2F%2Fprohibitioncakes.vercel.app');text=text.replace(/<link\b[^>]*type=["'](?:application\/json\+oembed|text\/xml\+oembed)["'][^>]*>/gi,'');fs.writeFileSync(file,text)}}}
clean('public');
// Use the full-size original photograph instead of the theme's 400px thumbnail.
function improveBanners(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())improveBanners(file);else if(file.endsWith('.html')){const text=fs.readFileSync(file,'utf8').replace(/src="\/wp-content\/themes\/cakeart\/images\/bg_header\.jpg"/g,'src="/assets/shop-banner-original.jpg" width="1920" height="420" decoding="async" fetchpriority="high"');fs.writeFileSync(file,text)}}}
improveBanners('public');
// Fail the build if a plain, escaped or percent-encoded local host remains.
function verifyIndependent(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())verifyIndependent(file);else if(/\.(html|css|js|json|svg|xml|map|txt|webmanifest)$/.test(file)){let text=fs.readFileSync(file,'utf8').replace(/\\u([0-9a-f]{4})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16))).replace(/\\\//g,'/');for(let n=0;n<3;n++)text=text.replace(/%([0-9a-f]{2})/gi,(_,hex)=>String.fromCharCode(parseInt(hex,16)));if(/\b(?:pi2\.local|localhost|127\.0\.0\.1)\b/i.test(text))throw new Error('Local WordPress dependency found in '+file)}}}
verifyIndependent('public');
fs.rmSync('dist',{recursive:true,force:true});fs.cpSync('public','dist',{recursive:true});console.log('Prohibition Cakes: original WordPress frontend exported to dist.');
