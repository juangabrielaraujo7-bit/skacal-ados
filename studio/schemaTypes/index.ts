import { defineType, defineField, defineArrayMember } from 'sanity';
const named = (name: string, title: string) => defineType({ name, title, type: 'document', fields: [defineField({ name: 'name', title: 'Nome', type: 'string', validation: r => r.required().max(80) })] });
const sizeOption = defineType({ name: 'sizeOption', title: 'Numeração', type: 'object', fields: [
  defineField({ name: 'size', title: 'Número', type: 'string', validation: r => r.required().regex(/^\d{2}$/), options: { list: Array.from({length:20}, (_,i) => String(25+i)) } }),
  defineField({ name: 'available', title: 'Disponível', description: 'Desmarque para exibir este número como esgotado. Não há controle de quantidade.', type: 'boolean', initialValue: true }),
], preview: { select: { title: 'size', available: 'available' }, prepare: ({ title, available }) => ({ title: `Número ${title}`, subtitle: available ? 'Disponível' : 'Esgotado' }) } });
const colorVariant = defineType({ name: 'colorVariant', title: 'Cor e disponibilidade', type: 'object', fields: [
  defineField({ name: 'color', title: 'Nome da cor', type: 'string', validation: r => r.required() }),
  defineField({ name: 'hex', title: 'Cor da amostra (hexadecimal)', type: 'string', description: 'Exemplo: #292826. As fotos devem mostrar esta mesma cor.', validation: r => r.required().regex(/^#[0-9a-fA-F]{6}$/) }),
  defineField({ name: 'images', title: 'Fotos desta cor', type: 'array', of: [defineArrayMember({type:'image', options:{hotspot:true}})], validation: r => r.required().min(1) }),
  defineField({ name: 'available', title: 'Cor disponível', type: 'boolean', initialValue: true, description: 'Desmarque para esgotar toda esta cor.' }),
  defineField({ name: 'sizes', title: 'Numerações e disponibilidade', description: 'Deixe vazio em bolsas e itens sem numeração.', type: 'array', of: [defineArrayMember({type:'sizeOption'})], validation: r => r.custom(value => { const entries = (value || []) as {size?:string}[]; return new Set(entries.map(v => v.size)).size === entries.length || 'Não repita números na mesma cor.'; }) }),
], preview: { select: { title: 'color', media: 'images.0', available: 'available' }, prepare: ({title, media, available}) => ({title, media, subtitle: available ? 'Disponível' : 'Esgotado'}) } });
const product = defineType({ name: 'product', title: 'Produto', type: 'document', groups: [{name:'details',title:'Informações',default:true},{name:'prices',title:'Preços'},{name:'variants',title:'Cores e números'}], fields: [
  defineField({ name:'name', title:'Nome do produto', type:'string', group:'details', validation:r=>r.required().max(100) }),
  defineField({ name:'reference', title:'Referência', description:'Use uma referência única da loja.', type:'string', group:'details', validation:r=>r.required().custom(async (value, context) => { if (!value) return true; const id = context.document?._id.replace(/^drafts\./,''); const found = await context.getClient({apiVersion:'2026-03-01'}).fetch('count(*[_type=="product" && reference==$reference && !(_id in [$id,$draftId])])',{reference:value,id,draftId:`drafts.${id}`}); return found === 0 || 'Esta referência já está em outro produto.'; }) }),
  defineField({ name:'category', title:'Categoria', type:'reference', to:[{type:'category'}], group:'details', validation:r=>r.required() }),
  defineField({ name:'brand', title:'Marca', type:'reference', to:[{type:'brand'}], group:'details' }),
  defineField({ name:'line', title:'Linha', type:'reference', to:[{type:'line'}], group:'details' }),
  defineField({ name:'audience', title:'Público', type:'string', options:{list:['Feminino','Masculino','Unissex']}, group:'details', validation:r=>r.required() }),
  defineField({ name:'description', title:'Descrição', type:'text', rows:4, group:'details', validation:r=>r.required().max(1000) }),
  defineField({ name:'specifications', title:'Especificações', description:'Cadastre apenas informações confirmadas sobre materiais e medidas.', type:'array', of:[{type:'string'}], group:'details' }),
  defineField({ name:'featured', title:'Produto em destaque', type:'boolean', initialValue:false, group:'details' }),
  defineField({ name:'price', title:'Preço normal (R$)', type:'number', group:'prices', validation:r=>r.required().positive().precision(2) }),
  defineField({ name:'salePrice', title:'Preço promocional (R$)', description:'Deixe vazio se não houver promoção.', type:'number', group:'prices', validation:r=>r.positive().precision(2).custom((value,context)=> value == null || value < Number(context.document?.price) || 'A promoção deve ser menor que o preço normal.') }),
  defineField({ name:'requiresSize', title:'Exige numeração?', description:'Desative para bolsas e acessórios sem tamanho.', type:'boolean', initialValue:true, group:'variants', validation:r=>r.required() }),
  defineField({ name:'variants', title:'Cores', type:'array', of:[defineArrayMember({type:'colorVariant'})], group:'variants', validation:r=>r.required().min(1).custom((value,context)=> { const variants = (value || []) as {sizes?:{size:string}[]}[]; return !context.document?.requiresSize || variants.every(v=>v.sizes?.length) || 'Cadastre as numerações de cada cor.'; }) }),
], preview:{select:{title:'name',subtitle:'reference',media:'variants.0.images.0'}} });
const settings = defineType({ name:'settings',title:'Banner e contato',type:'document',fields:[
  defineField({name:'whatsapp',title:'WhatsApp da loja',description:'Somente dígitos, com código do país e DDD. Exemplo de formato: 55 + DDD + número. Deixe vazio até confirmar.',type:'string',validation:r=>r.custom(value=>!value || /^\d{10,15}$/.test(value) || 'Informe somente de 10 a 15 dígitos, com código do país e DDD.')}),
  defineField({name:'bannerTitle',title:'Título do banner',type:'string',validation:r=>r.required().max(70)}),
  defineField({name:'bannerText',title:'Texto do banner',type:'text',rows:2,validation:r=>r.max(180)}),
  defineField({name:'bannerImage',title:'Foto do banner',type:'image',options:{hotspot:true}}),
  defineField({name:'bannerCategory',title:'Destino do botão do banner',type:'string',initialValue:'Ofertas',options:{list:['Todos','Ofertas','Ska Confort','Feminino','Masculino','Bolsas e acessórios']}}),
  defineField({name:'operatingNotes',title:'Orientações internas de atendimento',description:'Anotações internas; não são expostas no site.',type:'text'}),
],preview:{prepare:()=>({title:'Banner e contato da SKA'})} });
export const schemaTypes = [named('category','Categoria'),named('line','Linha'),named('brand','Marca'),sizeOption,colorVariant,product,settings];
