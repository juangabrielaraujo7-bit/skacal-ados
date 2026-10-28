# Verificação da demonstração

Conferência realizada em 28/10/2026. Sem publicação externa ou envio de mensagens.

## Automação

`npm run build`: TypeScript e build Vite aprovados.

`npm test`: seis testes aprovados, cobrindo preço autoritativo apesar de adulteração no payload, disponibilidade por cor/número, bolsas sem numeração, produtos removidos/esgotados, quantidades inválidas/duplicatas e atualização de promoção.

Studio: `npm run check` e `npm run build` aprovados. O build foi feito com identificador fictício apenas no ambiente do processo, sem autenticar, conectar dataset ou publicar. Sanity 6.20.0, com correções compatíveis de dependências indiretas registradas em `studio/package.json` e lockfile. As duas instalações terminaram com zero alertas conhecidos na auditoria do npm nesta data.

## Navegador

- Desktop 1366 × 900 e celular 390 × 844.
- Catálogo retornou 14 produtos pelo servidor local.
- Busca sem resultados mostrou estado vazio e caminho para limpar.
- Filtros de número 36 e preço até R$ 100 retornaram dois produtos.
- Nenhum transbordamento horizontal do documento ou fotografia quebrada detectada na inspeção.
- Scarpin: adicionar sem cor exibiu erro; na cor dourada, 38 ficou indisponível; 36 foi adicionado corretamente.
- Quantidade alterada para 2: subtotal R$ 259,80.
- Entrega selecionada e pedido preparado: mensagem identificou demonstração, referência, cor, número, quantidade, preço e frete a combinar.
- Botão de cópia apresentou confirmação na interface. Sem número configurado, não foi gerado link de envio para destinatário inventado.
- Recarregamento preservou o carrinho com dois itens. Remoção levou ao estado vazio.
- Bolsa Everyday foi adicionada com cor, sem exigência de número.
- Bota esgotada bloqueou o botão de adicionar. A opção de dúvida preparou a mensagem com referência e cor, sem destinatário inventado.

## Limites

O projeto Sanity da SKA ainda não foi informado. Schemas e configuração são preparados e verificados localmente; autenticação, edição, publicação e consulta do dataset real precisam ser conferidas após conexão. O servidor usa dados ilustrativos nesta etapa e a interface não os apresenta como valores validados para compras reais.

Screenshots em `docs/previews` documentam a apresentação. Não foi realizada auditoria Lighthouse; não há pontuação ou promessa de métricas de desempenho.
