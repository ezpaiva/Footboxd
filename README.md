# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# Footboxd

Aplicação web desenvolvida com React, Vite e TypeScript para visualização de jogos de futebol, incluindo resultados, partidas ao vivo, próximos jogos e informações de elencos.

## Objetivo do Projeto

O projeto tem como objetivo apresentar uma aplicação funcional com foco em boas práticas de desenvolvimento front-end, incluindo organização de código, componentização, tipagem com TypeScript e uso de layout responsivo.

## Arquitetura do Projeto

A aplicação foi estruturada com base na separação de responsabilidades, visando facilitar manutenção, escalabilidade e reutilização de código.

Estrutura principal:

src/
├── components/
├── pages/
├── services/
├── types/
├── styles/

### Justificativa da Arquitetura

A divisão do projeto foi realizada da seguinte forma:

* components/
  Responsável por componentes reutilizáveis da interface, como layout, sidebar e cards. Essa separação evita duplicação de código e melhora a organização.

* pages/
  Contém as páginas da aplicação, cada uma com responsabilidade específica. Essa abordagem facilita o entendimento e manutenção do sistema.

* services/
  Centraliza a comunicação com APIs e o uso de dados mockados. Isso permite isolar regras de negócio e facilitar futuras integrações com serviços externos.

* types/
  Define as interfaces TypeScript utilizadas no projeto, garantindo tipagem forte e reduzindo erros em tempo de desenvolvimento.

* styles/
  Armazena os arquivos de estilo separados por contexto, contribuindo para organização visual e manutenção.

Essa arquitetura segue boas práticas modernas de desenvolvimento front-end e favorece a escalabilidade do projeto.

## Tecnologias Utilizadas

* React
* Vite
* TypeScript
* Bootstrap (via CDN)
* API-Football

## Integração com API

A aplicação pode utilizar dados da API externa disponível em:
https://www.api-football.com/

### Como gerar a chave da API

1. Acesse o site https://www.api-football.com/
2. Crie uma conta na plataforma
3. Acesse o painel do usuário (Dashboard)
4. Copie a chave de API disponibilizada

## Configuração do ambiente (.env)

Para utilizar a API, é necessário configurar uma variável de ambiente.

Crie um arquivo na raiz do projeto chamado:

.env

Adicione o seguinte conteúdo:

VITE_API_FOOTBALL_KEY=sua_chave_aqui

Observações importantes:

* O prefixo VITE_ é obrigatório para que o Vite reconheça a variável

## Como executar o projeto

Instale as dependências:

npm install

Execute o projeto:

npm run dev

## Funcionalidades

* Listagem de jogos ao vivo
* Exibição de resultados de partidas
* Visualização de próximos jogos
* Exibição de elencos de times
* Estrutura preparada para dashboard dinâmico

## Interface

A aplicação utiliza layout responsivo com Bootstrap e elementos HTML5 semânticos, como header, main, section, aside e footer.

## Versionamento

O projeto segue padrão de commits semânticos:

feat: nova funcionalidade
fix: correção de erro
refactor: melhoria de código
style: ajustes visuais
docs: documentação

## Autor

Desenvolvido por Ezequiel Paiva
