# Ferramentas de segurança — análise das bibliotecas OSS

O Claude Review Support faz review com IA, mas **IA é uma camada, não o controle inteiro**. As skills
detectam e usam ferramentas determinísticas **se estiverem instaladas** (`PATH`), de forma read-only, e
usam o resultado como _dica_ — nunca como veredito. Esta página analisa o que vale a pena ter instalado.

> Princípio: combine review de IA + SAST/SCA/secret-scan determinísticos + gate humano em qualquer
> escrita/merge. Nenhuma das ferramentas abaixo é instalada automaticamente; você escolhe e instala.

## Resumo (stack recomendada, tudo OSS e grátis)

| Categoria | Recomendado | Por quê |
| --- | --- | --- |
| SAST geral | **Semgrep** (ou o fork **Opengrep**) | Multilíngua, regras YAML legíveis, registry enorme |
| SAST por linguagem | **Bandit** (Python), **gosec** (Go), **Brakeman** (Rails) | Baixo falso-positivo por serem específicos |
| Secret scan (rápido) | **Gitleaks** | Binário único Go, regex + entropia, ótimo em pre-commit |
| Secret scan (verificado) | **TruffleHog** | Valida se a credencial está **ativa** agora |
| Dependências / SCA | **OSV-Scanner** + **Grype** | Cobertura ampla, baixo ruído, scoring de risco |
| SBOM | **Syft** | Gera SPDX/CycloneDX; casa com Grype |
| Containers / IaC | **Trivy** | Um binário p/ imagem, FS, IaC e SBOM |
| Supply-chain comportamental | **Socket.dev** (freemium) | Detecta scripts de install maliciosos, não só CVE conhecida |

Tudo isso emite **SARIF**, que pode subir para a aba Security do GitHub mesmo sem GHAS.

## SAST (análise estática)

- **Semgrep** — `semgrep --config auto`. Melhor opção geral; 30+ linguagens. Após o relicenciamento do core
  (jan/2025) surgiu o fork **Opengrep**; a edição CE continua grátis, análise cross-file/Pro é paga.
  Site: <https://semgrep.dev> · Wiz comparativo: <https://www.wiz.io/academy/application-security/top-open-source-sast-tools>
- **CodeQL** — taint/dataflow profundo, o melhor em análise semântica. **Grátis só para repositórios públicos**;
  curva de aprendizado da linguagem QL; build do DB leva 10–30 min. <https://codeql.github.com>
- **Bandit** (Python), **gosec** (Go), **Brakeman** (Rails) — linters de segurança específicos, baixo ruído.
  <https://github.com/PyCQA/bandit> · <https://github.com/securego/gosec> · <https://brakemanscanner.org>

> Pesquisa recente mostra que **IA + CodeQL supera CodeQL sozinho**, e que LLMs são bons em **filtrar
> falso-positivo de SAST** — exatamente o padrão deste toolkit (detectar → verificar adversarialmente).
> <https://arxiv.org/pdf/2504.20814>

## Secret scanning

- **Gitleaks** — `gitleaks detect`. Rápido o bastante para pre-commit; regex + entropia de Shannon.
  <https://github.com/gitleaks/gitleaks>
- **TruffleHog** — verifica a credencial fazendo chamada real à API (confirma se está viva). Mais pesado;
  bom em agenda/CI. <https://github.com/trufflesecurity/trufflehog>
- **detect-secrets** (Yelp) — metodologia de _baseline_, foco em impedir vazamentos **novos**.
  <https://github.com/Yelp/detect-secrets>

Melhor prática: **Gitleaks na borda (velocidade) + TruffleHog agendado (confiança verificada)**.

## Dependências / supply-chain + SBOM

- **OSV-Scanner** (Google) — CLI contra o OSV DB. <https://google.github.io/osv-scanner/>
- **Grype** + **Syft** (Anchore) — Syft gera o SBOM, Grype casa CVEs com scoring EPSS.
  <https://github.com/anchore/grype> · <https://github.com/anchore/syft>
- **Trivy** (Aqua) — um binário p/ container, FS, IaC e SBOM (CycloneDX). <https://github.com/aquasecurity/trivy>
- **OWASP Dependency-Check** — SCA clássico baseado em NVD. <https://owasp.org/www-project-dependency-check>
- **Dependabot** — alertas + PRs de correção, nativo do GitHub.
- **Socket.dev** — supply-chain comportamental (detecta `postinstall` malicioso, typosquat). <https://socket.dev>

Stack grátis: auditorias nativas do ecossistema (`npm audit`, `pip-audit`) em todo build + **Syft → Grype/OSV-Scanner** +
Dependabot + Trivy para containers/IaC.

## Taxonomia de vulnerabilidade usada no review

- **OWASP Top 10 — 2025** (app web): <https://owasp.org/Top10/2025/> — destaque para A01 Broken Access Control
  (inclui SSRF e BOLA/BFLA) e A03 Software Supply Chain Failures (subiu para #3).
- **OWASP Top 10 for LLM Apps — 2025** (o próprio agente): <https://genai.owasp.org/llm-top-10/> — LLM01 Prompt
  Injection é #1. Ver [prompt-injection.md](prompt-injection.md).

## Como as skills usam tudo isso

As skills `security-review` e `project-state` checam o `PATH`; se a ferramenta existir, rodam read-only e
passam o resultado como hint para o `security-reviewer`/`finding-verifier`. Sem ferramenta, caem para
**AI-only** e dizem isso no relatório. **Nunca instalam nada** — instalação é decisão do usuário.

_Fontes verificadas em 2025–2026. Reavalie periodicamente: este espaço muda rápido._
