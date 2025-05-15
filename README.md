# Cálculo de Progressões (IFCE) - Regra de Transição 2025

Este é um sistema simples para calcular datas de progressão funcional de servidores do IFCE, considerando as regras antigas e as novas regras a partir de 2025. O objetivo é ajudar servidores da CIS Local e CGP a prever as próximas progressões, levando em conta o saldo de tempo acumulado e as mudanças de legislação.

## Objetivo

- Calcular a próxima progressão funcional de acordo com a regra antiga (18 meses de interstício).
- Calcular o saldo de tempo acumulado até janeiro de 2025 e como ele pode ser aproveitado na nova regra (12 meses de interstício).
- Exibir as próximas datas de progressão e os respectivos interstícios, considerando o saldo e as novas regras.
- Facilitar a conferência e planejamento das progressões, evitando erros de interpretação das normas.

O sistema segue a interpretação do [Ofício-Circular nº 35/2025/GAB-PROGEP/PROGEP/REITORIA-IFCE](https://sei.ifce.edu.br/sei/controlador_externo.php?acao=documento_conferir&codigo_verificador=7312739&codigo_crc=3CFEF38D&hash_download=e6e4e56bdaee0319554a3d88fa0ae2741c225425cc78d17b36d4034f1840b9a900e720fa42f39a8f4c986dec0b6173d42190cbea8b2fff8e21075d324c660c0c&visualizacao=1&id_orgao_acesso_externo=0).

> **Atenção:** Os resultados são baseados em interpretações e podem ser ajustados conforme novas orientações oficiais.

## Principais Ferramentas utilizadas

- **[Nuxt 3](https://nuxt.com/)**: Framework principal para desenvolvimento web com Vue.js.
- **[Vue.js](https://vuejs.org/)**: Biblioteca JavaScript para construção da interface do usuário.
- **[PrimeVue](https://primevue.org/)**: Componentes UI prontos para Vue.js.
- **[Luxon](https://moment.github.io/luxon/)**: Manipulação e cálculo de datas.
- **[TailwindCSS](https://tailwindcss.com/)**: Utilitário para estilização rápida e responsiva.
- **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript para tipagem estática.
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)**: Padronização e formatação automática do código.
- **[GitHub Pages](https://pages.github.com/)**: Hospedagem gratuita do sistema estático.
- **[GitHub Actions](https://github.com/features/actions)**: Automatização do deploy.

## Como usar

O sistema será disponibilizado publicamente via **GitHub Pages**. Basta acessar o link do repositório e utilizar a interface web, sem necessidade de instalação.

Se quiser rodar localmente para testar ou contribuir:

```bash
# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:3000`.

## Build para produção

Para gerar a versão de produção (por exemplo, para publicar no GitHub Pages):

```bash
npm run build
```

Para testar o build localmente:

```bash
npm run preview
```

## Deploy no GitHub Pages

O deploy é feito automaticamente via GitHub Actions para o branch `gh-pages`. O sistema ficará disponível em:

```
https://<seu-usuario>.github.io/calculo-progressoes/
```

## Referências

- [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction)
- [Ofício-Circular nº 35/2025/GAB-PROGEP/PROGEP/REITORIA-IFCE](https://sei.ifce.edu.br/sei/controlador_externo.php?acao=documento_conferir&codigo_verificador=7312739&codigo_crc=3CFEF38D&hash_download=e6e4e56bdaee0319554a3d88fa0ae2741c225425cc78d17b36d4034f1840b9a900e720fa42f39a8f4c986dec0b6173d42190cbea8b2fff8e21075d324c660c0c&visualizacao=1&id_orgao_acesso_externo=0)

---
````
