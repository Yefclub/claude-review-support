# Uso

## Pré-requisitos

- **Claude Code** atualizado (com suporte a `/plugin`).
- **Node.js** no `PATH` (já vem com o Claude Code) — os hooks são `.mjs`.
- **`gh` CLI** autenticado (`gh auth login`) para review de PR. As skills usam `gh` por padrão.
- Recomendado: uma sessão em **Opus** (`/model opus`, ou `best`/Fable 5) com **`/effort max`**.

## Instalação

### A) Como plugin (marketplace) — recomendado para uso recorrente
```text
/plugin marketplace add Yefclub/claude-review-support
/plugin install claude-review-support@yefclub
```
As skills ficam namespaced: `/claude-review-support:review-pr`, `:security-review`, etc. Rode `/reload-plugins`
após atualizar. As skills também são **model-invoked**: basta descrever o que quer.

### B) Clonar e abrir
```bash
git clone https://github.com/Yefclub/claude-review-support
cd claude-review-support
claude --plugin-dir .          # carrega skills + agents + hooks desta pasta
```
Mesmo sem `--plugin-dir`, abrir a pasta já carrega o `CLAUDE.md` automaticamente — o Claude entende o propósito
e te guia pelo menu; o `--plugin-dir .` adiciona as skills polidas, o enxame e os hooks.

> Para usar em **outro** repositório (revisar o SEU projeto), instale via marketplace (A) ou aponte
> `claude --plugin-dir /caminho/para/claude-review-support` ao abrir o seu repo.

## Fluxo

Mande qualquer mensagem. O Claude se apresenta e pergunta o que você quer:

- **Review a PR** → review completo de um PR (enxame → veredito + comentários inline opcionais)
- **Review a PR stack** → sequência de PRs dependentes, cada um contra sua própria base
- **Security review** → auditoria de segurança (diff ou repo inteiro), OWASP 2025
- **Project state** → snapshot de saúde do repositório

Se você já for direto ("revise o PR #42", "auditar segurança de `src/auth`"), ele pula o menu.

### Exemplos
```text
revise o PR #128
revise a stack: PRs #20, #21, #22
faça um security review do diff atual
faça um security review do repositório inteiro
qual o estado do projeto?
```

### Comandos explícitos (power user)
```text
/claude-review-support:start
/claude-review-support:review-pr 128
/claude-review-support:review-pr-stack
/claude-review-support:security-review
/claude-review-support:project-state
```

## Postar review no GitHub

Por padrão o review **só mostra** o resultado. Para publicar, peça explicitamente. O toolkit usa:
- Comentário-resumo: `gh pr comment <PR> --body-file ...`
- Inline em lote (evita 422/spam): `gh api repos/{owner}/{repo}/pulls/<PR>/reviews --method POST --input review.json`

Nunca faz merge sozinho. Merge/close só a seu pedido, depois de você ver os achados.

## GitHub MCP (opcional)

As skills funcionam só com `gh`. Se preferir o GitHub MCP (comentários inline com mapeamento de posição
automático), veja `.mcp.json.example` e a doc oficial: <https://code.claude.com/docs/en/mcp>.

## Ferramentas de segurança opcionais

Instale Semgrep, Gitleaks, OSV-Scanner, Trivy, etc. para corroborar o review de IA. Ver
[security-tooling.md](security-tooling.md). Sem elas, o review roda **AI-only** e diz isso.

## Desligar um hook

Os hooks ficam em `hooks/hooks.json`. Remova a entrada correspondente (ou ajuste as regras em
`hooks/guard-bash.mjs` / `guard-sensitive-read.mjs`) e rode `/reload-plugins`.
