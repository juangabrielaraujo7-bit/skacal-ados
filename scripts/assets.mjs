import fs from 'node:fs/promises';
const read=k=>fs.readFile(`docs/sources/${k}`,'utf8');
const attr=(tag,name)=>tag.match(new RegExp('(?:^|\\s)'+name+'="([^"]*)"','i'))?.[1]?.replaceAll('&amp;','&')||'';
const imgs=h=>[...h.matchAll(/<img\b[^>]*>/gi)].map(x=>x[0]);
const sources=[];
async function download(url,path){const r=await fetch(url,{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error(`${r.status} ${url}`);await fs.writeFile('public'+path,Buffer.from(await r.arrayBuffer()));sources.push({path,url});}
const logos={usaflex:attr(imgs(await read('usaflex.html')).find(x=>x.includes('Logotipo de Usaflex')),'data-src'),democrata:attr(imgs(await read('democrata.html')).find(x=>x.includes('Democrata Logo')),'data-src'),vizzano:'https://www.vizzano.com.br/wp-content/uploads/2025/02/Logo_Vizzano-PRETO.png',mezzo:JSON.parse((await read('mezzo.html')).match(/"logo":\s*("[^"]+")/)[1]),wj:'https://s3.sa-east-1.amazonaws.com/s.v2wjstore.com.br/gallery/LOGO/logo-wj.svg'};
await Promise.all(Object.entries(logos).map(async([k,u])=>{try{await download(u,`/assets/brands/${k}.${u.includes('.svg')?'svg':'png'}`);console.log('logo',k)}catch(e){console.log(e.message)}}));
const list=[];
for(const [file,brand] of [['usaProducts.txt','Usaflex'],['vizzProducts.txt','Vizzano']]){const raw=JSON.parse(await read(file));for(const p of raw.slice(0,8))list.push({brand,name:p.productName,images:p.items[0].images.slice(0,2).map(x=>x.imageUrl),source:brand==='Usaflex'?'https://www.usaflex.com.br/':'https://www.clovis.com.br/'});}
for(const [key,brand,pattern] of [['democrata','Democrata',/mainImageHovered|vtex-product-summary-2-x-imageNormal/],['mezzo','MZQ (Mezzo Punto)',/block-img lazy-img/],['wj','WJ Acessórios',/primary/]]){const seen=new Set();for(const tag of imgs(await read(key+'.html')).filter(x=>pattern.test(x))){const name=attr(tag,'alt');if(!name||seen.has(name)|| (key==='wj'&&!/bolsa|bag|mochila/i.test(name)))continue;seen.add(name);list.push({brand,name,images:[attr(tag,'src')],source:{democrata:'https://www.democrata.com.br/',mezzo:'https://www.mezzopunto.com.br/',wj:'https://wjstore.com.br/'}[key]});if(seen.size>=6)break;}}
for(const tag of imgs(await read('newface.txt')).filter(x=>/item-image-featured/.test(x)).slice(0,5)){list.push({brand:'New Face',name:attr(tag,'alt').replace(/ - comprar online/,'').replace(/ - .*$/,''),images:['https:'+attr(tag,'data-srcset').split(',').find(x=>x.includes('640w')).trim().split(' ')[0]],source:'https://www.wnshoes.com.br/marcas/new-face/'});}
const products=[];
await Promise.all(list.map(async(p,index)=>{try{const paths=[];for(const [i,url]of p.images.entries()){const path=`/assets/products/${index}-${i}.jpg`;await download(url,path);paths.push(path);}products.push({...p,id:`brand-${index}`,images:paths});console.log(index,p.brand,p.name);}catch(e){console.log('FAIL',index,e.message)}}));
products.sort((a,b)=>Number(a.id.slice(6))-Number(b.id.slice(6)));
await fs.writeFile('shared/brand-products.json',JSON.stringify(products,null,2));await fs.writeFile('docs/sources/brand-assets.json',JSON.stringify(sources,null,2));
const html=await (await fetch('https://www.tontricalcados.com/marca/new-face.html')).text();await fs.writeFile('docs/sources/newface-logo.html',html);console.log('NEWLOGO',imgs(html).filter(x=>/new.face/i.test(x)).map(x=>({src:attr(x,'src'),alt:attr(x,'alt')})));
