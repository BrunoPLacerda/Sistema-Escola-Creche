
# Sistema de Gestão Escolar - CEBE
**Centro de Educação Brincando e Educando**

Este projeto é uma aplicação web Single Page Application (SPA) desenvolvida com **React**, **TypeScript** e **Tailwind CSS**. O sistema gerencia alunos, professores, cursos, financeiro e emissão de recibos escolares.

---

## 1. Estrutura do Projeto

A estrutura de arquivos é organizada para separar responsabilidades de UI, Lógica e Tipagem.

```
/
├── index.html              # Ponto de entrada HTML
├── index.tsx               # Ponto de entrada React
├── App.tsx                 # Controlador Principal (Estado Global Mockado)
├── types.ts                # Definições de Tipos TypeScript
├── metadata.json           # Configurações do ambiente
├── database/
│   └── schema.sql          # Script SQL para criação de tabelas no Neon (PostgreSQL)
└── components/             # Componentes React
    ├── Login.tsx           # Autenticação (Admin + Responsável)
    ├── StudentManagement.tsx # CRUD de Alunos
    ├── Receipts.tsx        # Gerador de Recibos
    ├── ParentPortal.tsx    # Área da Família
    └── ... (outros componentes)
```

---

## 2. Persistência de Dados e Banco de Dados

### Status Atual: Client-Side (Frontend Only)
Atualmente, a aplicação roda em modo de demonstração/protótipo.
*   **Dados Voláteis**: Alunos, Cursos e Professores são resetados ao recarregar a página (definidos no `App.tsx`).
*   **Dados Persistentes (Local)**: O cadastro de **senhas dos responsáveis** e **admins** é salvo no `localStorage` do navegador. Isso permite testar o fluxo de "Primeiro Acesso" e Login sem precisar de um servidor ativo.

### Futuro: Integração com Neon (PostgreSQL)
Para tornar o sistema definitivo, deve-se integrar com um banco de dados.
*   O arquivo `database/schema.sql` foi criado contendo toda a estrutura de tabelas necessária (`students`, `courses`, `guardian_auth`, etc.).
*   Você pode copiar o conteúdo deste arquivo e rodar no **SQL Editor** do seu painel Neon para criar as tabelas.

---

## 3. Funcionalidades Principais

### 3.1. Autenticação e Primeiro Acesso
*   **Admin**: Login via CPF/Senha.
*   **Responsável**: O sistema verifica se o CPF digitado pertence a um aluno matriculado. Se sim, permite criar uma senha pessoal (armazenada localmente no protótipo).

### 3.2. Área da Família (Parent Portal)
*   Visualização de Boletim (Notas e Frequência).
*   Status Financeiro com botão simulado de "Pagar com PIX".
*   Acesso rápido ao grupo de WhatsApp da turma.

### 3.3. Gestão Administrativa
*   **Dashboard**: KPIs financeiros e acadêmicos.
*   **Recibos**: Geração de recibos A4 prontos para impressão.
*   **Financeiro**: Controle de inadimplência.
*   **Comunicação**: Disparo de mensagens para grupos de WhatsApp.

---

**Desenvolvido para CEBE - 2024/2025**
