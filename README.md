# BispadoManager

Base técnica de um site estático preparado para GitHub Pages e Supabase. Este
repositório não contém funcionalidades de negócio nem identidade visual; a
estrutura está pronta para receber as próximas definições do projeto.

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

Sem configuração do Supabase, a página informa que o cliente não está
configurado. A chave pública é destinada ao navegador; nunca coloque a chave
`service_role`, senhas ou a string de conexão do PostgreSQL no frontend ou no
repositório.

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
