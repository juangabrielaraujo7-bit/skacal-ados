import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { ptPTLocale } from '@sanity/locale-pt-pt';
import { schemaTypes } from './schemaTypes';
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
if (!projectId) throw new Error('Configure SANITY_STUDIO_PROJECT_ID com o projeto exclusivo da SKA no arquivo studio/.env.local.');
export default defineConfig({
  name: 'ska', title: 'SKA | Gestão do catálogo', projectId, dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [ptPTLocale(), structureTool({ title: 'Catálogo', structure: S => S.list().title('Gestão SKA').items([
    S.listItem().title('Produtos').child(S.documentTypeList('product').title('Produtos')),
    S.listItem().title('Categorias').child(S.documentTypeList('category').title('Categorias')),
    S.listItem().title('Linhas').child(S.documentTypeList('line').title('Linhas')),
    S.listItem().title('Marcas').child(S.documentTypeList('brand').title('Marcas')),
    S.divider(), S.listItem().title('Banner e contato da loja').child(S.document().schemaType('settings').documentId('settings').title('Banner e contato')),
  ]) })],
  schema: { types: schemaTypes },
  document: { newDocumentOptions: prev => prev.filter(item => item.templateId !== 'settings') },
});
