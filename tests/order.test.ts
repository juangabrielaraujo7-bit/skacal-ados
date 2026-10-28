import test from 'node:test';
import assert from 'node:assert/strict';
import { demoCatalog } from '../shared/demo';
import { prepareQuote } from '../shared/order';
import { priceOf } from '../shared/types';
const shoe = {productId:'1005',variantId:'preto',size:'36',quantity:2};
test('usa preço autoritativo e inclui detalhes e frete a combinar',()=>{
 const q=prepareQuote(demoCatalog,[{...shoe,unitPrice:0.01,subtotal:0.02}],'delivery');
 assert.equal(q.subtotal,259.8); assert.equal(q.mode,'demo'); assert.match(q.message,/Valores não validados/); assert.match(q.message,/SKA-1005/); assert.match(q.message,/Número: 36/); assert.match(q.message,/Frete não incluído/);
});
test('exige número disponível por cor',()=>{
 assert.ok(prepareQuote(demoCatalog,[{...shoe,size:''}],'pickup').issues.length);
 assert.ok(prepareQuote(demoCatalog,[{...shoe,size:'35'}],'pickup').issues.length);
 assert.equal(prepareQuote(demoCatalog,[{...shoe,variantId:'dourado',size:'35'}],'pickup').issues.length,0);
 assert.ok(prepareQuote(demoCatalog,[{...shoe,variantId:'dourado',size:'38'}],'pickup').issues.length);
});
test('bolsas dispensam tamanho e rejeitam tamanho inventado',()=>{
 const bag={productId:'1013',variantId:'caramelo',size:'',quantity:1};
 assert.equal(prepareQuote(demoCatalog,[bag],'pickup').subtotal,159.9);
 assert.throws(()=>prepareQuote(demoCatalog,[{...bag,size:'36'}],'pickup'));
});
test('esgotados e removidos bloqueiam a geração de mensagem',()=>{
 for(const productId of ['1008','removido']) {const q=prepareQuote(demoCatalog,[{...shoe,productId}],'pickup'); assert.ok(q.issues.length);assert.equal(q.message,'');}
});
test('rejeita payloads inválidos, quantidades fracionárias e duplicatas',()=>{
 for(const quantity of [0,-1,100,1.5,'2']) assert.throws(()=>prepareQuote(demoCatalog,[{...shoe,quantity}],'pickup'));
 assert.throws(()=>prepareQuote(demoCatalog,[],'pickup'));assert.throws(()=>prepareQuote(demoCatalog,[shoe,shoe],'pickup'));
});
test('reconsulta preço atualizado e remove promoção inválida',()=>{
 const fresh=structuredClone(demoCatalog); fresh.mode='live';const p=fresh.products.find(p=>p.id==='1005')!;p.salePrice=139.9;
 const q=prepareQuote(fresh,[shoe],'pickup');assert.equal(q.subtotal,279.8);assert.doesNotMatch(q.message,/DEMONSTRAÇÃO/);
 p.salePrice=999;assert.equal(priceOf(p),p.price);
});
