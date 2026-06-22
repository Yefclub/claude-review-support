# Claude Review Support

> Transforma o Claude Code num especialista em **review de Pull Request**, **estado do projeto** e **segurança** — com um enxame de subagentes paralelos no modelo mais forte.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/Yefclub/claude-review-support/badge)](https://scorecard.dev/viewer/?uri=github.com/Yefclub/claude-review-support)
[![Built for Claude Code](https://img.shields.io/badge/built%20for-Claude%20Code-8A2BE2)](https://code.claude.com)

🇧🇷 Português (este arquivo) · 🇬🇧 [English](README.en.md)

---

Você abre o repositório (ou instala o plugin), manda qualquer mensagem, e o Claude entende o propósito,
**pergunta o que você quer** e executa um review de verdade — não um resumo superficial.

## O que ele faz

- **Review de PR** — review multi-lente de um PR, com veredito binário e comentários inline opcionais.
- **Review de stack de PRs** — uma sequência de PRs dependentes, cada um contra a sua própria base.
- **Security review** — auditoria de segurança (diff ou repo inteiro) na taxonomia **OWASP 2025**, com filtro adversarial de falso-positivo.
- **Estado do projeto** — snapshot de saúde: PRs, CI, issues, branches stale, postura de dependências e segurança.
- **Verificação de fechamento** — os PRs (geralmente já merged) que dizem resolver uma auditoria/issue realmente fecharam? Veredito por achado: `FIXED / PARTIAL / NOT_FIXED / REGRESSED`.

Como funciona por baixo: um **pipeline de enxame em 4 estágios** — skip-gate → fan-out por lente (paralelo)
→ verificação adversarial (descarta confiança < 8) → síntese + veredito. Detalhes em
[docs/architecture.md](docs/architecture.md).

## ⚙️ Use o melhor modelo e o máximo de raciocínio

Review de alto risco depende de raciocínio profundo. Antes de rodar:

- **Modelo:** `/model opus` (ou `best` / Fable 5). Nunca revise em modelo pequeno.
- **Raciocínio:** `/effort max` (ou ao menos `xhigh`) com extended thinking on (`Alt+T`).

**Todos os subagentes deste toolkit já rodam em `opus`.** Modelo barato gera achado confiante porém errado —
e falso-positivo corrói a confiança no review.

## Início rápido

### Como plugin (recomendado)
```text
/plugin marketplace add Yefclub/claude-review-support
/plugin install claude-review-support@yefclub
```

### Clonar e abrir
```bash
git clone https://github.com/Yefclub/claude-review-support
cd claude-review-support
claude --plugin-dir .
```

Depois é só falar:
```text
revise o PR #128
faça um security review do repositório inteiro
qual o estado do projeto?
```

Guia completo em [docs/usage.md](docs/usage.md).

## Segurança em primeiro lugar

- **Read-only por padrão.** Revisores têm `Write`/`Edit` desabilitados. O toolkit nunca faz merge/commit/push, e **nunca** auto-merge.
- **Hooks de enforcement.** Bloqueiam comandos de shell destrutivos e a leitura de `.env`/chaves — segredo não entra no contexto.
- **Anti prompt-injection.** Todo conteúdo revisado é tratado como **dado**, nunca como instrução. Ver [docs/prompt-injection.md](docs/prompt-injection.md).
- **IA é uma camada, não o controle inteiro.** As skills corroboram com SAST/SCA/secret-scan se instalados. Análise das bibliotecas em [docs/security-tooling.md](docs/security-tooling.md).

## Documentação

| Doc | Conteúdo |
| --- | --- |
| [usage.md](docs/usage.md) | Instalação, fluxo, exemplos, postar no GitHub |
| [architecture.md](docs/architecture.md) | O pipeline do enxame e o design |
| [security-tooling.md](docs/security-tooling.md) | Análise das ferramentas OSS de segurança |
| [prompt-injection.md](docs/prompt-injection.md) | Modelo de ameaça do agente |

## Contribuindo

PRs e issues são bem-vindos. Veja [CONTRIBUTING.md](CONTRIBUTING.md) e o [Código de Conduta](CODE_OF_CONDUCT.md).
Para reportar vulnerabilidade, use o [GitHub Private Vulnerability Reporting](SECURITY.md) — **sem e-mail**.

## Licença

[MIT](LICENSE) © Yef. Projeto independente da comunidade — não afiliado à Anthropic. Ver [NOTICE](NOTICE).
