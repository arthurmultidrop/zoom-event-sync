# Sistema de Login - Zoom Event Sync

## Visão Geral

Este projeto agora inclui um sistema completo de autenticação que integra com o endpoint de login da API Multidrop e utiliza o token de acesso para todas as chamadas subsequentes aos endpoints do Zoom.

## Funcionalidades Implementadas

### 1. **Tela de Login** (`/login`)
- Formulário de login com email e senha
- Validação de campos obrigatórios
- Indicador de carregamento durante o processo de login
- Tratamento de erros com mensagens amigáveis
- Design responsivo e moderno usando Tailwind CSS e shadcn/ui

### 2. **Contexto de Autenticação** (`AuthContext`)
- Gerenciamento global do estado de autenticação
- Armazenamento seguro do token no localStorage
- Funções de login e logout
- Verificação automática de sessão existente

### 3. **Rotas Protegidas** (`ProtectedRoute`)
- Verificação automática de autenticação
- Redirecionamento para login se não autenticado
- Preservação da rota original para redirecionamento pós-login

### 4. **Integração com API**
- Endpoint de login: `https://multidrop-dev.ew.r.appspot.com/auth/v2/login`
- Uso automático do `accessToken` retornado para todas as chamadas do Zoom
- Substituição completa do `mockToken` anterior

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   └── ProtectedRoute.tsx       # Componente de rota protegida
├── pages/
│   ├── Login.tsx                # Página de login
│   └── Index.tsx                # Página principal (protegida)
├── hooks/
│   └── useZoom.ts               # Hook atualizado para usar token real
└── types/
    └── zoom.ts                  # Tipos atualizados para autenticação
```

## Como Usar

### 1. **Acesso Inicial**
- Acesse a aplicação
- Se não estiver autenticado, será redirecionado para `/login`
- Se já estiver autenticado, será redirecionado para `/`

### 2. **Processo de Login**
- Digite seu email e senha
- Clique em "Entrar"
- O sistema fará a chamada para o endpoint de login
- Em caso de sucesso, será redirecionado para a página principal
- O token será armazenado automaticamente

### 3. **Uso das Funcionalidades**
- Todas as chamadas para endpoints do Zoom agora usam o token real
- O status da conexão Zoom é verificado automaticamente
- Criação de reuniões funciona com autenticação real

### 4. **Logout**
- Clique no avatar do usuário no header
- Selecione "Sair" no menu dropdown
- Será redirecionado para a tela de login

## Resposta da API de Login

O endpoint retorna o seguinte objeto:

```typescript
interface LoginResponse {
  accessToken: string;        // Token JWT para autenticação
  firstName: string;          // Nome do usuário
  image: string;              // Identificador da imagem
  language: string;           // Idioma preferido
  urlImage: string;           // URL da imagem do usuário
  chatToken: string;          // Token para chat
  userViewPreference: any;    // Preferências de visualização
}
```

## Segurança

- Tokens são armazenados no localStorage (pode ser melhorado para httpOnly cookies em produção)
- Todas as rotas protegidas verificam autenticação
- Redirecionamento automático para login se não autenticado
- Validação de campos no frontend e backend

## Próximos Passos Sugeridos

1. **Implementar refresh token** para renovação automática de sessão
2. **Adicionar registro de usuários** se necessário
3. **Implementar recuperação de senha**
4. **Adicionar autenticação com provedores externos** (Google, GitHub, etc.)
5. **Melhorar segurança** com httpOnly cookies e CSRF protection

## Tecnologias Utilizadas

- **React 18** com TypeScript
- **React Router DOM** para navegação
- **Context API** para gerenciamento de estado
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes de interface
- **Lucide React** para ícones
- **Fetch API** para chamadas HTTP

## Executando o Projeto

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build
```

O sistema estará disponível em `http://localhost:5173` (ou a porta configurada pelo Vite).
