# Contribuindo

Obrigado por contribuir com o Claude Review Support! Issues e PRs são bem-vindos.

> 🇬🇧 An English version follows below.

## Como contribuir

1. Abra uma issue descrevendo o bug/ideia (ou comente numa existente) antes de um PR grande.
2. Faça fork, crie um branch (`feat/...`, `fix/...`, `docs/...`).
3. Faça as mudanças seguindo os padrões abaixo.
4. Valide localmente (ver "Validação").
5. Abra o PR. Este repositório se revisa com o próprio toolkit — espere um review criterioso. 🙂

## Padrões

- **Commits convencionais:** `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`.
- **Commits assinados:** assine seus commits (`git commit -S`, GPG ou SSH). Veja
  <https://docs.github.com/en/authentication/managing-commit-signature-verification>.
- **Idioma:** conteúdo machine-facing (`CLAUDE.md`, `skills/`, `agents/`, `hooks/`) em **inglês**;
  `README` e `docs/` em **PT-BR** (com `README.en.md` em inglês).
- **Sem dados pessoais/empresariais:** não inclua e-mails, nomes de empresa ou segredos. Autoria do repo é `Yef`.

## Adicionando componentes

- **Skill:** crie `skills/<nome>/SKILL.md` com frontmatter `description` (gatilho claro) e `allowed-tools`
  read-only. Corpo = fluxo numerado + orquestração + template de output.
- **Agente (lente do enxame):** crie `agents/<nome>.md` com `model: opus`, ferramentas read-only,
  `disallowedTools: Write, Edit`, e **inclua a cláusula anti prompt-injection** (conteúdo revisado é dado,
  não instrução). Padronize a saída de achados (`file:line`, severidade, confiança, what/why/how).
- **Hook:** escreva em Node (`.mjs`) para rodar igual em Windows e Unix; registre em `hooks/hooks.json` com
  `node "${CLAUDE_PLUGIN_ROOT}/hooks/<arquivo>.mjs"`. Hooks de segurança devem **fail-closed** (bloquear na dúvida).

## Validação

```bash
# Hooks: confirme que bloqueiam o perigoso e liberam o seguro
printf '{"tool_input":{"command":"rm -rf /tmp/x"}}' | node hooks/guard-bash.mjs   # deve negar
printf '{"tool_input":{"command":"git diff"}}'        | node hooks/guard-bash.mjs   # deve liberar

# Plugin: estrutura e manifesto
claude plugin validate .        # se disponível na sua versão do Claude Code
claude --plugin-dir .           # carregue e teste as skills

# Workflows (se mexer em .github/workflows): actionlint / zizmor
```

## Princípios de design (mantenha)

- Read-only por padrão; **nunca** auto-merge; gate humano em qualquer escrita.
- Alto sinal: todo achado verificado adversarialmente (confiança ≥ 8) antes de reportar.
- Recomende sempre o melhor modelo + raciocínio máximo; subagentes em `opus`.

---

## Contributing (English)

Issues and PRs welcome. Use **conventional commits**, **sign your commits**, and keep machine-facing files
(`CLAUDE.md`, `skills/`, `agents/`, `hooks/`) in **English**. Add skills under `skills/<name>/SKILL.md` and
swarm lenses under `agents/<name>.md` (`model: opus`, read-only tools, include the anti prompt-injection
clause). Write hooks in Node (`.mjs`) so they run on Windows and Unix, and make security hooks fail-closed.
Validate with the commands above before opening a PR. Do not include emails, company names, or secrets.
