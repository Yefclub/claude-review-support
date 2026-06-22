# Arquitetura

O Claude Review Support é um **plugin do Claude Code** que vira o Claude num especialista em review.
Tudo gira em torno de um pipeline de enxame de subagentes em 4 estágios, executado pelas skills.

## Componentes

```
CLAUDE.md            cérebro: persona, boot protocol, princípios (auto-carregado)
skills/              fluxos acionáveis (o que o usuário pede)
agents/              o enxame: revisores especializados + verificador adversarial
hooks/               enforcement determinístico (bash/secret guards, contexto, setup)
docs/                referência (esta pasta)
.github/             hardening do próprio repo (Scorecard, CodeQL, gitleaks, Dependabot)
```

## O pipeline do enxame (4 estágios)

```
            ┌─ correctness-reviewer ─┐
            ├─ security-reviewer ─────┤
 PR/diff ─▶ ├─ performance-reviewer ──┤ ─▶ candidatos ─▶ finding-verifier (×N, adversarial)
            ├─ test-quality-reviewer ─┤                      │  refuta cada achado
 skip-gate  ├─ dependency-...-reviewer┤                      │  confiança 1–10
 (barato)   ├─ architecture-reviewer ─┤                      ▼
            └─ simplification-reviewer┘              mantém só ≥ 8  ─▶ síntese + veredito
                (paralelo, todos opus)                 dedup file:line
```

1. **Skip-gate (inline).** PR draft/fechado/trivial → para. Não gasta enxame à toa.
2. **Fan-out por lente (paralelo).** Um subagente por preocupação, todos em `opus`. Disparados em **uma única
   mensagem** com várias chamadas `Task` para rodarem concorrentes. O número de lentes escala com tamanho/risco do diff.
3. **Verificação adversarial + dedup.** Cada candidato vai para um `finding-verifier`, cujo viés padrão é
   _refutar_. Atribui confiança 1–10; **descarta < 8**. Dedup por `file:line`. É o maior redutor de falso-positivo.
4. **Síntese + atribuição.** Cada achado sobrevivente sai com `file:line`, severidade, categoria, exploit/impacto
   e fix concreto. Termina em **veredito binário** (APPROVE/REQUEST CHANGES, ou PASS/VULNERABILITIES FOUND).

> Para auditoria exaustiva, o usuário pode dizer **"use a workflow"** — aí o Claude roda um enxame multi-round
> (loop-until-dry) via Workflow tool. Nunca é acionado sem opt-in explícito.

## Por que enxame em vez de um revisor só

Pesquisa e prática convergem (Anthropic `code-review`/`/security-review`, hamy 9-agentes, adamsreview):
- **Contexto fresco** — um revisor que só vê o diff e o critério julga melhor do que quem escreveu o código.
- **Lentes independentes** — cada preocupação tem foco total; um agente "geral" dilui.
- **Verificação adversarial** — refutar antes de reportar derruba o falso-positivo, que é o que corrói confiança.

## Modelo e raciocínio

Todos os subagentes declaram `model: opus` e `effort: high` (`xhigh` em segurança/verificador). O toolkit
**sempre recomenda** ao usuário rodar a sessão principal em Opus (ou `best`/Fable 5) com `/effort max`.
Review de alto risco depende de raciocínio profundo; modelo barato gera achado confiante porém errado.

## Princípios de design

- **Read-only por padrão.** Revisores têm `Write`/`Edit` desabilitados. O toolkit nunca faz merge/commit/push.
- **Gate humano.** Postar comentário, fechar, mergear: só a pedido explícito, depois que o usuário viu os achados.
- **Conteúdo revisado é dado, não instrução.** Ver [prompt-injection.md](prompt-injection.md).
- **Alto sinal.** Achado só entra no relatório se foi verificado (confiança ≥ 8). Honestidade > cobertura.

## Referências

- Anthropic best practices (Writer/Reviewer, fresh context): <https://code.claude.com/docs/en/best-practices>
- `/security-review` oficial (MIT): <https://github.com/anthropics/claude-code-security-review>
- Multi-agent system: <https://www.anthropic.com/engineering/multi-agent-research-system>
- hamy, 9 revisores paralelos: <https://hamy.xyz/blog/2026-02_code-reviews-claude-subagents>
