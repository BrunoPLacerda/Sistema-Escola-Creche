# Sistema de Gestão Escolar - CEBE
**Centro de Educação Brincando e Educando**

Este projeto é uma aplicação web Single Page Application (SPA) desenvolvida com **React**, **TypeScript** e **Tailwind CSS**. O sistema gerencia alunos, professores, cursos, financeiro e emissão de recibos escolares.

---

## 1. Estrutura do Projeto

A estrutura de arquivos é organizada para separar responsabilidades de UI, Lógica e Tipagem.

```
/
├── index.html              # Ponto de entrada HTML (Configuração do Tailwind e Fontes)
├── index.tsx               # Ponto de entrada React (Montagem da App)
├── App.tsx                 # Controlador Principal (Roteamento e Estado Global)
├── types.ts                # Definições de Tipos TypeScript (Interfaces globais)
├── metadata.json           # Configurações do ambiente de execução
└── components/             # Componentes React
    ├── Login.tsx           # Autenticação, Cadastro e Recuperação
    ├── Dashboard.tsx       # Painel de KPIs e Resumos
    ├── StudentManagement.tsx # CRUD de Alunos
    ├── TeacherManagement.tsx # CRUD de Professores
    ├── CourseManagement.tsx  # CRUD de Cursos
    ├── FinancialManagement.tsx # Controle de Mensalidades
    ├── Receipts.tsx        # Gerador e Impressão de Recibos
    ├── Calendar.tsx        # Calendário Acadêmico
    ├── Communications.tsx  # Integração com WhatsApp
    ├── Reports.tsx         # Relatórios e Gráficos
    ├── Sidebar.tsx         # Menu de Navegação Lateral
    ├── Header.tsx          # Cabeçalho Superior
    ├── Modal.tsx           # Componente Reutilizável de Janela Modal
    └── icons.tsx           # Biblioteca de Ícones SVG
```

---

## 2. Fluxo de Dados e Estado (App.tsx)

O arquivo `App.tsx` atua como a "Fonte da Verdade" (Single Source of Truth) para os dados em memória nesta versão da aplicação.

1.  **Estado Global**: Mantém listas de `students`, `courses`, `teachers` e `events` usando `useState`.
2.  **Roteamento Manual**: Utiliza um estado `currentPage` para renderizar condicionalmente os componentes centrais, simulando a navegação entre páginas sem recarregar o navegador.
3.  **Autenticação**: Controla o estado `isAuthenticated`. Se `false`, renderiza apenas o componente `Login`. Se `true`, renderiza o layout completo (`Sidebar` + Conteúdo).

---

## 3. Detalhamento dos Módulos

### 3.1. Autenticação (Login.tsx)
*   **Funcionalidade**: Permite Login, Cadastro de novos usuários e Recuperação de Senha.
*   **Persistência**: Utiliza o `localStorage` do navegador para salvar novos usuários registrados (`cebe_users`).
*   **Segurança Visual**: Possui botão para mostrar/ocultar senha.
*   **UX**: Máscaras automáticas para CPF (`000.000.000-00`) e Telefone. CSS personalizado para garantir que o *Autofill* do navegador não altere a cor de fundo para cinza/azul.

### 3.2. Dashboard (Dashboard.tsx)
*   Exibe cartões estatísticos (Total de Alunos, Receita, Inadimplência).
*   Calcula dinamicamente a receita baseada no status de pagamento dos alunos e valor dos cursos.

### 3.3. Gestão Acadêmica (CRUDs)
Os componentes `StudentManagement`, `TeacherManagement` e `CourseManagement` seguem um padrão:
1.  **Listagem**: Tabela exibindo os dados.
2.  **Adição/Edição**: Um formulário dentro de um `Modal` reaproveitável.
3.  **Exclusão**: Uma lógica de confirmação segura (Modal de Confirmação) antes de remover o item do estado global.

### 3.4. Financeiro (FinancialManagement.tsx)
*   Calcula **Receita Esperada** vs. **Receita Realizada**.
*   Permite alterar o status de pagamento do aluno (Pago, Pendente, Vencido).
*   Visualiza cores diferentes dependendo do status (Verde, Laranja, Vermelho).

### 3.5. Recibos (Receipts.tsx)
*   **Objetivo**: Gerar um recibo pronto para impressão no modelo A4.
*   **Tecnologia**: Utiliza `@media print` no CSS. Ao clicar em imprimir, o navegador oculta a Sidebar e o Formulário, deixando visível apenas a folha do recibo.
*   **Design**: Simula um papel timbrado com fonte estilo "manuscrita" para os dados variáveis (Nome, Valor, Data).

### 3.6. Calendário (Calendar.tsx)
*   Calendário interativo construído do zero.
*   Permite navegar entre meses e adicionar eventos (Provas, Reuniões, Feriados) clicando nos dias.

### 3.7. Comunicação (Communications.tsx)
*   Permite filtrar alunos por curso.
*   Gera links dinâmicos para grupos de WhatsApp cadastrados nos cursos.
*   Copia a mensagem para a área de transferência antes de abrir o WhatsApp Web.

---

## 4. Estilização e UI

*   **Tailwind CSS**: Todo o estilo é utilitário.
    *   Cores da marca definidas no `index.html` (`brand-primary`, `brand-secondary`).
    *   Design responsivo (mobile-first).
*   **Ícones**: Todos os ícones são SVGs inline definidos em `components/icons.tsx` para evitar dependências externas pesadas.

## 5. Banco de Dados (Simulação vs. Real)

*   **Atual**: O sistema roda inteiramente no navegador (`Client-Side`). Os dados iniciais são resetados ao recarregar a página (exceto o login que usa LocalStorage).
*   **Futuro (Neon DB)**: Um esquema SQL (`database/schema.sql`) foi desenhado para migrar este sistema para um banco de dados PostgreSQL real, permitindo persistência definitiva dos dados acadêmicos.

---

**Desenvolvido para CEBE - 2024/2025**
