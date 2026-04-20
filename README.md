# TechInfo Manager

Sistema web completo para gestão de informações técnicas de clientes de informática.

## Stack
- **Frontend/Backend:** Next.js 14 (App Router + Route Handlers)
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT em cookie HttpOnly
- **Estilo:** Tailwind CSS
- **PDF:** PDFKit

## Arquitetura
- `src/app/(auth)`: fluxo de autenticação.
- `src/app/(dashboard)`: interface administrativa com telas obrigatórias.
- `src/app/api`: API REST para autenticação, CRUD, busca global, logs e PDF.
- `prisma/schema.prisma`: modelagem relacional completa (users, clients, routers, cameras, services, attachments, logs).
- `prisma/seed.ts`: dados de exemplo.

## Segurança implementada
- Hash de senha com bcrypt.
- Sessão com JWT assinado e cookie HttpOnly.
- Proteção de rotas via middleware e `requireAuth`.
- Controle de acesso por perfil (ADMIN, TECNICO, VISUALIZADOR).
- Logs de ações críticas no `activity_logs`.
- Mascaramento visual de segredos técnicos no detalhe do cliente.

## Funcionalidades entregues
- Login com perfis e autorização.
- Dashboard com indicadores e últimos registros.
- CRUD de clientes, roteadores, câmeras/CFTV e serviços.
- Busca global por múltiplos critérios técnicos.
- Página de detalhes do cliente com histórico consolidado.
- Gestão de usuários.
- Log de auditoria.
- Exportação de relatório técnico em PDF.

## Executar localmente
1. Copie variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Gere e migre banco:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Suba a aplicação:
   ```bash
   npm run dev
   ```

## Usuários de teste
- admin@sistema.local / Admin@123
- tecnico@sistema.local / Admin@123
- viewer@sistema.local / Admin@123
