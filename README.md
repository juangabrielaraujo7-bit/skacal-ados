# SKA Calçados | Demonstração navegável

Catálogo em React, Vite e TypeScript, com API Node preparada para Vercel e Sanity Studio separado. Nenhum serviço foi publicado, nenhuma conta foi criada e nenhuma mensagem é enviada automaticamente.

## Executar a demonstração

Requer Node.js 22.13 ou superior (validado com Node 24).

```powershell
npm ci
npm run dev -- --port 5173
```

Abra http://127.0.0.1:5173/. Mantenha esse terminal aberto durante a apresentação. O comando `dev` também disponibiliza as APIs locais; `vite preview` isolado serve apenas os arquivos estáticos e não substitui esse comando.

```powershell
npm test
npm run build
```

## O que está pronto

- 55 produtos ilustrativos, 13 categorias e sete seleções por marca, incluindo linhas femininas e masculinas e bolsas.
- Páginas próprias de categorias e marcas, navegação pelo histórico, acesso direto e recarregamento.
- Banner comercial, logo original, destaques, ofertas e seleção Ska Confort.
- Busca por nome, referência, categoria, marca, linha ou público; filtros por marca, número disponível e preço; ordenação.
- Galeria, cores com fotos correspondentes e disponibilidade por número. O Scarpin Clássico demonstra duas cores com numerações diferentes.
- Seleção obrigatória de cor e tamanho quando aplicável. Bolsas dispensam tamanho. A bota demonstra uma variação esgotada.
- Carrinho salvo no navegador, quantidade, remoção, subtotal calculado em centavos e escolha de recebimento.
- Conferência no servidor, apresentação de indisponibilidade e aceitação explícita de mudanças de preço antes de preparar novamente.
- Mensagem com referências, variações, quantidades, valores e recebimento. Sem telefone configurado, permite visualizar e copiar, sem inventar destinatário.
- Caminho para dúvidas por produto. Nenhum pagamento, cupom, frete gratuito ou reserva de estoque.
- Modais nativos com contenção de foco, fechamento por Escape, estados vazios, carregamento, falha e botões com nomes acessíveis.

## Publicar pela Vercel

O projeto principal fica na raiz deste repositório. Na Vercel, use **Framework Preset: Vite**, **Root Directory: raiz**, **Build Command: npm run build** e **Output Directory: dist**. O arquivo `vercel.json` já define o build e o encaminhamento das páginas internas; as funções em `api/` atendem o catálogo e o pedido.

O build também verifica as funções com as regras de módulos do Node. As importações relativas no servidor e em seus arquivos compartilhados usam a extensão `.js`, resolvida para os fontes TypeScript durante o desenvolvimento e para JavaScript após a compilação. `npm test` inclui execução das funções compiladas em um processo Node, cobrindo catálogo, pedido e indisponibilidade sem depender do Vite.

Para publicar esta demonstração, nenhuma variável de ambiente é obrigatória. Sem configuração do Sanity, a aplicação mostra os 55 produtos demonstrativos. O Studio é um projeto separado dentro de `studio/` e não é a raiz de publicação da loja.

WhatsApp informado pela loja: **(11) 94180-7394**, configurado em `shared/contact.ts` no formato internacional `5511941807394`. Os atalhos de atendimento abrem a conversa diretamente; o pedido mantém a revisão dos itens antes de abrir o WhatsApp com a mensagem preparada. Um contato preenchido no Sanity substitui esse número padrão.

Para usar o catálogo real, configure `SANITY_PROJECT_ID`, `SANITY_DATASET` e, apenas se necessário para leitura privada, `SANITY_API_READ_TOKEN` nas variáveis de ambiente da Vercel. Os valores secretos não devem entrar no Git. Veja abaixo como configurar o conteúdo e o contato da loja.

## Demonstração e dados reais

Sem `SANITY_PROJECT_ID`, `/api/catalog` e `/api/order` usam `shared/demo.ts`. Todo o fluxo sinaliza demonstração; as mensagens dizem que os valores não foram validados para compra real. As descrições não prometem propriedades técnicas ou terapêuticas.

As fotografias são referências temporárias de terceiros, e não comprovam produtos ou marcas comercializados pela SKA. Antes de publicar, substitua por fotografias próprias ou autorizadas e cadastre os dados reais. A logo original da pasta foi preservada e copiada para `public/assets/ska-logo.png`. O vídeo mencionado no briefing não estava disponível nos anexos acessíveis.

Fontes das imagens: `public/assets/photo-sources.json` (DummyJSON) e `public/assets/extra-photo-sources.json` (páginas públicas de referência). Alguns nomes de referência nas fotos podem ser de outras marcas; não há alegação de fabricação ou revenda. Não publicar as referências temporárias como catálogo real.

## Conectar o Sanity exclusivo da SKA

1. Criar um projeto e dataset próprios da SKA. Não usar projeto, tokens ou conteúdo da Capucho. Nenhum código ou credencial da Capucho estava disponível; esta implementação segue as regras de arquitetura do briefing.
2. Copiar `.env.example` para `.env.local` e preencher `SANITY_PROJECT_ID` e `SANITY_DATASET`. Para dataset privado, informar `SANITY_API_READ_TOKEN` com permissão mínima de leitura, apenas no servidor. Não usar prefixo `VITE_` em tokens.
3. Copiar `studio/.env.example` para `studio/.env.local` e preencher o mesmo projeto/dataset. O ID de projeto é público; tokens privados não são necessários na configuração do Studio, que usa autenticação do editor.
4. No diretório `studio`, executar `npm ci` e `npm run dev`. O painel só pode se conectar e permitir edição com um projeto real e acesso autorizado.
5. Cadastrar categorias (Sapatilhas, Rasteiras, Tamancos, Anabelas, Scarpins, Mocassins, Botas, Tênis casuais, Slip-on, Sociais, Sapatênis, Sandálias e Bolsas e acessórios) e linhas (Essenciais e Ska Confort).
6. Cadastrar produtos, referência única, público, descrição, especificações confirmadas, preços, cores, fotos e numeração de cada cor. Marcar manualmente a disponibilidade. Em bolsas, desativar a exigência de numeração e deixar os tamanhos vazios.
7. Em **Banner e contato da loja**, configurar título, texto, imagem e destino do banner. Informar WhatsApp confirmado com código do país e DDD, apenas dígitos. O documento tem ID fixo `settings`.
8. Publicar o conteúdo. Rascunhos não aparecem no site. Testar no projeto SKA a consulta, alterações de preços, esgotados e contato antes de liberar pedidos reais.

O Studio contém grupos de Informações, Preços e Cores e números; navegação em português e pacote de tradução para português. Configurações comerciais incluem contato e orientações internas; as orientações internas não são expostas no catálogo.

Validação local do painel: na pasta `studio`, `npm run check`. O build exige o ID de projeto configurado. A versão Sanity é 6.20.0; as substituições compatíveis de dependências indiretas em `overrides` corrigem avisos das ferramentas de desenvolvimento e devem ser reavaliadas nas futuras atualizações.

## Arquitetura de conteúdo e pedido

- `GET /api/catalog`: consulta o Sanity em tempo de execução, com `perspective=published`, sem CDN e com `Cache-Control: no-store`. Sem projeto, retorna a seleção demonstrativa. Se um projeto configurado falhar, retorna erro, sem misturar dados locais com catálogo real.
- A interface busca o catálogo ao abrir, ao voltar à janela e a cada 60 segundos enquanto visível. Conteúdo publicado não exige novo deploy de código. Novas categorias publicadas entram nos filtros.
- `POST /api/order`: recebe somente identificadores de produto/cor, número e quantidade, além da opção de recebimento. Não recebe nem confia em totais do navegador. Valida formato, quantidade, duplicatas, cor e tamanho; consulta novamente os dados publicados e calcula preço normal/promocional e subtotal no servidor.
- Itens removidos ou esgotados geram bloqueio e mensagem para revisão do carrinho. Diferenças de preço entre a resposta e o carrinho geram aviso; o cliente aceita o novo valor e prepara novamente, provocando outra consulta.
- Endereço e frete são combinados no atendimento. O subtotal contém apenas produtos. Não há persistência de pedidos no servidor nem reserva de pares.
- A mensagem real pode abrir `wa.me` somente depois da revisão e de um clique explícito. O atendimento ainda precisa confirmar disponibilidade.
- `shared/order.ts` concentra regras verificáveis; handlers em `api/` funcionam no Vite local e nas funções Vercel.
- Carrinho é local ao navegador/dispositivo. Navegação privada, limpeza dos dados ou bloqueio de armazenamento podem impedir a persistência.

Referências oficiais usadas: [perspectivas de conteúdo](https://www.sanity.io/docs/content-lake/perspectives), [consulta HTTP](https://www.sanity.io/docs/http-reference/query) e [configuração do Studio](https://www.sanity.io/docs/studio/configuration).

## Publicação futura na Vercel

O arquivo `vercel.json` define Vite, build e saída `dist`. A pasta `api` contém as funções Node. Configurar as variáveis de servidor no projeto Vercel da SKA. O Studio tem instalação e build separados e não integra o bundle público. Não houve deploy nesta etapa.

## Decisões visuais

Loja comercial clara, base nativa de CSS, Manrope hospedada localmente e ícones Phosphor. Dourado escuro para contraste, superfícies neutras, quatro colunas no computador e duas no celular. Banner compacto para aproximar os produtos da abertura. Design variance 4, motion intensity 2 e visual density 6: a clareza de compra orienta as decisões. Tema claro solicitado no briefing; não há alternância automática para tema escuro. Camadas: cabeçalho 10 (reservado), notificações 30, modais na camada superior nativa do navegador.

## Gestão após a entrega

As três alternativas comerciais permanecem abertas: atualização feita pelo responsável pelo site; gestão compartilhada com a loja; ou autonomia da loja após 30 dias de acompanhamento e treinamento. Em todos os casos, usar contas individuais e treinar cadastro de fotos por cor, numeração, disponibilidade, promoções e publicação. Não compartilhar tokens privados com editores.

## Próxima etapa

- Confirmar telefone, fotos autorizadas, preços, referências e disponibilidade reais.
- Conectar e testar o projeto Sanity próprio da SKA e cadastrar todo o catálogo.
- Definir operação de entrega antes de implementar cálculo por CEP.
- Definir domínio definitivo e publicação.
- Avaliar futuras integrações de estoque e pagamento.

Ver `docs/VERIFICACAO.md` para evidências e limites da conferência desta demonstração.
