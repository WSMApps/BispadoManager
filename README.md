# BispadoManager

Aplicação estática para organizar a agenda da reunião sacramental, preparada
para publicação no GitHub Pages e integração futura com Supabase.

## Agenda sacramental

A aplicação tem duas telas: **Agenda preenchida**, que abre primeiro e permite
conferir ou imprimir a agenda, e **Criar agenda**, que contém o formulário.
Dados fictícios são carregados para demonstração; edite os campos e selecione
**Salvar e visualizar agenda** para atualizar a agenda preenchida. O campo
**Ala** é manual por enquanto e aparece nas boas-vindas junto à data.
Na prévia, cada folha aparece separada e a quebra de página indica onde começa
a segunda página.

No cartão **Designações**, presidente e dirigente aparecem lado a lado na
primeira linha; regente, organista e recepcionista ficam juntos na linha
seguinte. O formulário também inclui boas-vindas, anúncios, hinos, orações,
apoios e desobrigações e os demais itens da reunião.

O cartão **Anúncios** permanece na agenda mesmo sem texto e deixa três linhas
em branco para preenchimento à mão após a impressão.

O bloco **Designações** usa o mesmo estilo visual dos blocos de boas-vindas e
reconhecimento. Os nomes do presidente e de quem dirige aparecem abaixo dos
rótulos.

O cartão **Abertura** mostra o primeiro hino com seu número na mesma linha e a
primeira oração logo abaixo. Um campo opcional permite acrescentar uma
ordenança após a oração.

O cartão **Sacramento** mostra o hino sacramental com o número alinhado à
direita e a mensagem sobre a bênção e distribuição do sacramento.

Os cartões **Oradores** e **Encerramento** separam os dois primeiros oradores
e o hino especial/apresentação coral do último orador, último hino e última
oração.

Os cartões opcionais **Ordenanças** e **Apoios e desobrigações** aparecem em
uma nova folha quando houver conteúdo. “Ordenanças →”, “Apoios →” ou
“Ordenanças e Apoios →” indica a continuação à direita na linha da primeira
oração.

Na impressão em papel A4, o conteúdo da agenda principal é ajustado para que
o cartão **Encerramento** permaneça na primeira página. Ordenanças e apoios
continuam na página seguinte quando preenchidos.

As alterações do formulário só aparecem na agenda preenchida depois de
selecionar **Salvar e visualizar agenda**. Os dados permanecem apenas na página
aberta: não são salvos nem enviados ao Supabase. Atualizar a página carrega
novamente os dados fictícios; **Limpar campos** deixa o formulário vazio.

## Tecnologias

- HTML, CSS e JavaScript sem etapa de build ou dependências npm.
- Supabase JavaScript v2 carregado pelo CDN para autenticação e acesso ao banco.
- Supabase PostgreSQL com migrações SQL versionadas em `supabase/migrations/`.
- GitHub Pages publicado pelo GitHub Actions.

O backend Python/SQLite do repositório de referência não foi incluído porque o
GitHub Pages hospeda conteúdo estático. Persistência e regras de acesso devem
ficar no Supabase, protegidas por Row Level Security (RLS).

## Desenvolvimento local

1. Configure a URL do projeto e a chave pública `anon`/publishable em
   `supabase-config.js`.
2. Na raiz do projeto, inicie um servidor estático:

   ```powershell
   py -m http.server 8000
   ```

3. Abra <http://localhost:8000>.

Sem configuração do Supabase, a agenda continua disponível no navegador. A
chave pública é destinada ao navegador; nunca coloque a chave `service_role`,
senhas ou a string de conexão do PostgreSQL no frontend ou no repositório.

## Supabase

Crie um projeto Supabase e execute os arquivos SQL adicionados em
`supabase/migrations/` pelo SQL Editor, em ordem. As tabelas e políticas de
acesso específicas do BispadoManager devem ser definidas antes de armazenar
dados. Ative RLS em todas as tabelas acessíveis pelo navegador e conceda
somente as permissões necessárias.

## Publicação no GitHub Pages

O workflow `.github/workflows/pages.yml` publica a raiz do repositório quando
houver push na branch `main` ou execução manual. No GitHub, habilite Pages com
**Build and deployment → Source: GitHub Actions**. O endereço do site será
disponibilizado na execução do workflow.

Como o frontend é estático, valores usados no navegador não são secretos. A
segurança dos dados depende da autenticação e das políticas RLS no Supabase,
nunca de esconder controles na interface.
