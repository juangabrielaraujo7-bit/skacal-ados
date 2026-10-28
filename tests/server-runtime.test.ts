import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

test('funções compiladas executam no Node ESM sem o carregador do Vite', t => {
  const folder = mkdtempSync(join(tmpdir(), 'ska-node-runtime-'));
  t.after(() => {
    if (dirname(resolve(folder)) !== resolve(tmpdir()) || !basename(folder).startsWith('ska-node-runtime-')) throw new Error('Pasta temporária inesperada.');
    rmSync(folder, { recursive: true, force: true });
  });
  execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.server.json', '--noEmit', 'false', '--outDir', folder, '--rootDir', '.', '--incremental', 'false'], { stdio: 'pipe' });
  writeFileSync(join(folder, 'package.json'), JSON.stringify({ type: 'module' }));
  const catalogUrl = pathToFileURL(join(folder, 'api/catalog.js')).href;
  const orderUrl = pathToFileURL(join(folder, 'api/order.js')).href;
  const script = `
    const {default: catalog} = await import(${JSON.stringify(catalogUrl)});
    const {default: order} = await import(${JSON.stringify(orderUrl)});
    async function invoke(handler, req) {
      let status, data, headers;
      await handler(req, {writeHead(code,h){status=code;headers=h}, end(body){data=JSON.parse(body)}});
      return {status, data, headers};
    }
    const listing = await invoke(catalog,{method:'GET'});
    const quote = await invoke(order,{method:'POST',body:{receiving:'pickup',items:[{productId:'1005',variantId:'preto',size:'36',quantity:2}]}});
    const unavailable = await invoke(order,{method:'POST',body:{receiving:'pickup',items:[{productId:'1005',variantId:'preto',size:'35',quantity:1}]}});
    console.log(JSON.stringify({listing:{status:listing.status,mode:listing.data.mode,count:listing.data.products.length,cache:listing.headers['Cache-Control']},quote:{status:quote.status,subtotal:quote.data.subtotal},unavailable:unavailable.status}));
  `;
  const result = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { encoding: 'utf8', env: { ...process.env, SANITY_PROJECT_ID: '', SANITY_API_READ_TOKEN: '' } }));
  assert.deepEqual(result.listing, { status: 200, mode: 'demo', count: 55, cache: 'no-store' });
  assert.deepEqual(result.quote, { status: 200, subtotal: 259.8 });
  assert.equal(result.unavailable, 409);
});
