import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { demoCatalog } from '../shared/demo';
import { brands, categoryPath, resolvePage } from '../shared/navigation';
const categories=[...new Set(demoCatalog.products.map(p=>p.category))];
test('cada categoria e marca possui endereço próprio e resolvível',()=>{
 const names=[...categories,...brands.map(b=>b.name),'Todos','Ofertas','Feminino','Masculino'];
 assert.equal(new Set(names.map(categoryPath)).size,names.length);
 for(const name of names)assert.equal(resolvePage(categoryPath(name),categories),name);
 assert.equal(categoryPath('Tênis casuais'),'/categoria/tenis-casuais');
 assert.equal(resolvePage('/categoria/inexistente',categories),null);
});
test('todas as marcas possuem produtos e imagens locais disponíveis',()=>{
 for(const brand of brands){assert.ok(existsSync('public'+brand.logo),brand.name);assert.ok(demoCatalog.products.some(p=>p.brand===brand.name||p.line===brand.name),brand.name);}
 for(const p of demoCatalog.products)for(const v of p.variants)for(const image of v.images)assert.ok(existsSync('public'+image),image);
 assert.equal(new Set(demoCatalog.products.map(p=>p.id)).size,demoCatalog.products.length);
});
