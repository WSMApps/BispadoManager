# BispadoManager

Aplicação estática para organizar a agenda da reunião sacramental, preparada
para publicação no GitHub Pages e integração futura com Supabase.

## Agenda sacramental

A página inicial contém um menu para acessar **Agenda Sacramental** e uma área
reservada para indicadores futuros. A tela da agenda permite conferir ou
imprimir a programação e acessar **Criar agenda**, que contém o formulário.
Dados fictícios são carregados para demonstração; edite os campos por etapa,
volte para corrigir o que precisar e selecione **Revisar agenda** para conferir
a prévia antes de imprimir. O campo **Ala** oferece as alas cadastradas no
Supabase e permite cadastrar novas pelo próprio formulário; o nome selecionado
aparece nas boas-vindas junto à data.
Na prévia, cada folha aparece separada e a quebra de página indica onde começa
a segunda página. Em telas pequenas, cartões e campos se reorganizam para
leitura e preenchimento no celular, mantendo a mesma disposição de
presidência, direção e designações da versão para computador, sem alterar a
paginação A4 da impressão. No formulário, a data fica compacta ao lado do campo
**Ala**.

O texto de boas-vindas é fixo e inclui a ala e a data quando informadas. O
reconhecimento dos visitantes complementa esse texto somente quando preenchido.

No cartão **Designações**, presidente e dirigente aparecem lado a lado na
primeira linha; regente, organista e recepcionista ficam juntos na linha
seguinte. O formulário também inclui reconhecimento, anúncios, hinos, orações,
apoios e desobrigações e os demais itens da reunião.
Os campos de hino sugerem títulos do catálogo local enquanto você digita;
escolher um título preenche o número, e informar um número reconhecido preenche
o título correspondente.
Na tela de cadastro, a seção **Abertura e cronograma** reúne reconhecimentos,
anúncios, hinos, orações, apoios e desobrigações. Os quatro hinos ficam agrupados
em um cartão, as duas orações em outro, e os campos dos três oradores ficam
reunidos em um grupo.

O cartão **Anúncios** permanece na agenda mesmo sem texto e deixa três linhas
em branco para preenchimento à mão após a impressão.

O bloco **Designações** usa o mesmo estilo visual do bloco de boas-vindas. Os
nomes do presidente e de quem dirige aparecem abaixo dos rótulos.

O cartão **Abertura** mostra o primeiro hino com seu número na mesma linha e a
primeira oração logo abaixo.

Os hinos de abertura, sacramental, especial/coral e de encerramento têm campo
próprio para o número, posicionado à direita do nome no formulário. Na agenda,
o número aparece em destaque pequeno à direita do nome.

Os cartões **Oradores** e **Encerramento** separam os dois primeiros oradores
e o hino especial do último orador, último hino e última
oração.

Na segunda folha, os cartões **Apoios** e **Desobrigações** dividem o espaço
igualmente. Cada um tem 10 linhas com colunas de nome e chamado; o cadastro
oferece os mesmos campos e preenche a agenda automaticamente. A seção
**Ordenanças** tem três linhas para tipo, responsável e observações, também
preenchidas pelo cadastro. **Testemunhos** oferece 15 linhas para escrita
manual na folha impressa. Na impressão, o conteúdo das duas folhas é
distribuído para ocupar melhor a página; as linhas da segunda folha mantêm
espaçamento uniforme mesmo com dados preenchidos.

Na impressão em papel A4, o conteúdo da agenda principal é ajustado para que
O cartão **Encerramento** permaneça na primeira página; apoios, desobrigações,
ordenanças e testemunhos ficam na segunda.
A prévia e as duas folhas impressas exibem uma fotografia discreta do Templo
de Salt Lake como marca d'água. A foto é de Farragutful, publicada no Wikimedia
Commons sob a licença [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

As alterações do formulário são salvas automaticamente como rascunho no
armazenamento local deste navegador e são recuperadas ao reabrir a página.
**Limpar campos** apaga o rascunho e deixa o formulário vazio. Os dados do
rascunho não são enviados ao Supabase.

## Tecnologias

- HTML, CSS e JavaScript sem etapa de build ou dependências npm.
- Supabase JavaScript v2 carregado pelo CDN para autenticação e acesso ao banco.
- Supabase PostgreSQL com migrações SQL versionadas em `supabase/migrations/`.
- GitHub Pages publicado pelo GitHub Actions.

O backend Python/SQLite do repositório de referência não foi incluído porque o
GitHub Pages hospeda conteúdo estático. Persistência e regras de acesso devem
ficar no Supabase, protegidas por Row Level Security (RLS).

## Assistente virtual (SecretárioAI)

O SecretárioAI é um chat local em português, com respostas preparadas sobre o
preenchimento, a visualização e a impressão da agenda. O formulário é preenchido
diretamente na tela **Criar agenda**, fora do chat. O assistente também responde
a interações básicas, dúvidas sobre o site e pedidos de ajuda, e permite abrir
o cadastro ou a agenda. O chat usa respostas preparadas e busca local por assunto
no índice do Manual Geral; não carrega modelos generativos nem envia perguntas a
serviços externos. A busca por palavras-chave retorna títulos, números de item
e páginas para facilitar a consulta da edição oficial. Quando a busca encontra
títulos aproximados, o chat também oferece botões com os itens e páginas
sugeridos; selecionar uma opção consulta o item pelo número. O avatar está em
`assets/images/secretario-ai-avatar.png`.
As respostas sociais são agrupadas por intenção, aceitam abreviações usuais e
pequenas variações de digitação, e alternam entre opções sem variar
aleatoriamente. Se uma expressão ficar ambígua, o chat pede esclarecimento.
Pedidos que acompanham um agradecimento ou cumprimento continuam sendo
processados. Mensagens que terminam na resposta de fallback ficam apenas na
memória da página atual, limitadas às 20 mais recentes; podem ser consultadas
com **ver falhas** e apagadas com **limpar falhas**. Elas não são salvas após
recarregar a página nem enviadas a serviços externos.
Também há respostas resumidas para as reuniões da ala, da estaca, conselhos,
serviços fúnebres e orientações relacionadas do capítulo 29, além de assuntos
dos capítulos 30 (chamados) e 18 (ordenanças e bênçãos) do Manual Geral.
As respostas resumidas e suas palavras-chave ficam em `knowledge-base.js`.
`manual-index.js` indexa, a partir do PDF enviado (versão 2/25), 1.317 títulos
de capítulos, seções e subseções numeradas, com seus identificadores e páginas.
As respostas indexadas incluem um link para o Manual Geral oficial. O índice é
um localizador, não reproduz o texto integral nem resume cada item; o capítulo
29 tem resumos próprios por subtópico, e as demais respostas detalhadas cobrem
temas selecionados. O SecretárioAI é uma persona
sintética de IA, não uma pessoa real, membro ou líder eclesiástico, e não
substitui fontes oficiais nem orientação da liderança local.
Os PDFs não são publicados nem consultados diretamente. O chat também consulta
`hymn-catalog.js`, com títulos, números e categorias informadas: os hinos 1 a
204, os hinos 1001 a 1022, 1043, 1046 a 1078 e 1201 a 1212 informados. Também
identifica os títulos sacramentais fornecidos. Não inclui letras ou partituras.
Para orientações completas, consulte as edições oficiais vigentes.

## Desenvolvimento local

1. A URL do projeto já está em `supabase-config.js`; configure nele a chave
   pública `anon`/publishable do projeto para habilitar a lista de alas.
2. O assistente funciona localmente, sem chave de API ou dependência de serviço
   generativo externo.
3. Na raiz do projeto, inicie um servidor estático:

   ```powershell
   py -m http.server 8000
   ```

4. Abra <http://localhost:8000>.

Sem configuração do Supabase, a agenda continua disponível no navegador. A
chave pública é destinada ao navegador; nunca coloque a chave `service_role`,
senhas ou a string de conexão do PostgreSQL no frontend ou no repositório.

## Supabase

Crie um projeto Supabase e execute os arquivos SQL adicionados em
`supabase/migrations/` pelo SQL Editor, em ordem. A migração
`001_wards.sql` cria o catálogo de alas e inclui os oito nomes iniciais
informados. A política atual permite que visitantes anônimos leiam e cadastrem
alas; não permite editar ou apagar registros. Como o cadastro é público, novas
entradas ficam visíveis a todos e podem exigir moderação se houver abuso.
Ative RLS em todas as tabelas acessíveis pelo navegador e conceda somente as
permissões necessárias.

## Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` publica a raiz do repositório quando
houver push na branch `main` ou execução manual. No GitHub, habilite Pages com
**Build and deployment → Source: GitHub Actions**. O endereço do site será
disponibilizado na execução do workflow.

Como o frontend é estático, valores usados no navegador não são secretos. A
segurança dos dados depende da autenticação e das políticas RLS no Supabase,
nunca de esconder controles na interface.
