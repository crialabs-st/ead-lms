---
name: breakdown-plan
description: 'Issue Planning and Automation prompt that generates comprehensive project plans with Epic > Feature > Story/Enabler > Test hierarchy, dependencies, priorities, and automated tracking.'
---

# Planejamento de Problemas e Automação de Projetos no GitHub

## Objetivo

Atue como um gerente de projeto sênior e especialista em DevOps com expertise em metodologia Ágil e gerenciamento de projetos no GitHub. Sua tarefa é pegar o conjunto completo de artefatos de recursos (PRD, design UX, detalhamento técnico, plano de testes) e gerar um plano de projeto abrangente no GitHub com criação automática de issues, vinculação de dependências, atribuição de prioridades e rastreamento no estilo Kanban.

## Gestão de Projetos no GitHub Melhores Práticas

### Hierarquia de Itens de Trabalho Ágil

- **Épico**: Grande capacidade de negócios que abrange múltiplas funcionalidades (nível de marco)
- **Funcionalidade**: Funcionalidade voltada para o usuário que pode ser entregue dentro de um épico
- **História**: Requisito focado no usuário que entrega valor de forma independente
- **Facilitador**: Trabalho de infraestrutura técnica ou arquitetônica que suporta histórias
- **Teste**: Trabalho de garantia de qualidade para validar histórias e habilitadores
- **Tarefa**: Desdobramento do trabalho em nível de implementação para histórias/enablers

### Princípios de Gestão de Projetos

- **Critérios INVEST**: Independente, Negociável, Valioso, Estimável, Pequeno, Testável
- **Definição de Pronto**: Critérios de aceitação claros antes do início do trabalho
- **Definição de Pronto**: Portões de qualidade e critérios de conclusão
- **Gestão de Dependências**: Relações de bloqueio claras e identificação do caminho crítico
- **Priorização Baseada em Valor**: Matriz de valor de negócio vs. esforço para tomada de decisão

## Requisitos de Entrada

Antes de usar este prompt, certifique-se de ter todos os artefatos completos do fluxo de trabalho de testes:

### Documentos de Recursos Principais

1. **PRD da Funcionalidade**: `/docs/ways-of-work/plan/{epic-name}/{feature-name}.md`
2. **Análise Técnica**: `/docs/ways-of-work/plan/{epic-name}/{feature-name}/technical-breakdown.md`
3. **Plano de Implementação**: `/docs/ways-of-work/plan/{epic-name}/{feature-name}/implementation-plan.md`

### Sugestões de Planejamento Relacionadas

- **Planejamento de Testes**: Use o prompt `plan-test` para uma estratégia de teste abrangente, planejamento de garantia de qualidade e criação de problemas de teste
- **Planejamento de Arquitetura**: Use o prompt `plan-epic-arch` para arquitetura de sistema e design técnico
- **Planejamento de Recursos**: Use o prompt `plan-feature-prd` para requisitos e especificações detalhadas de recursos

Formato de Saída

Crie dois entregáveis principais:

1. **Plano do Projeto**: `/docs/ways-of-work/plan/{epic-name}/{feature-name}/project-plan.md`
2. **Lista de Verificação para Criação de Problemas**: `/docs/ways-of-work/plan/{epic-name}/{feature-name}/issues-checklist.md`

### Estrutura do Plano do Projeto

#### 1. Visão Geral do Projeto

- **Resumo da Funcionalidade**: Breve descrição e valor comercial
- **Critérios de Sucesso**: Resultados mensuráveis e KPIs
- **Principais Marcos**: Desagregação dos principais entregáveis sem prazos
- **Avaliação de Risco**: Bloqueadores potenciais e estratégias de mitigação

#### 2. Hierarquia de Itens de Trabalho

```mermaid
graph TD
     A[Epic: {Nome do Épico}] --> B[Feature: {Nome da Funcionalidade}]
```

     A[Epic: {Nome do Épico}] --> B[Recurso: {Nome do Recurso}]
     B --> C[História 1: {História do Usuário}]
     B --> D[História 2: {História do Usuário}]
     B --> E[Facilitador 1: {Trabalho Técnico}]
     B --> F[Facilitador 2: {Infraestrutura}]

    C --> G[Tarefa: Implementação do Frontend]
     C --> H[Tarefa: Integração de API]
     C --> I[Teste: Cenários E2E]

    D --> J[Tarefa: Desenvolvimento de Componentes]
     D --> K[Tarefa: Gerenciamento de Estado]
     D --> L[Teste: Testes Unitários]

    E --> M[Tarefa: Esquema de Banco de Dados]
     E --> N[Tarefa: Scripts de Migração]

    F --> O[Tarefa: Pipeline CI/CD]
     F --> P[Tarefa: Configuração de Monitoramento]

#### 3. Análise de Problemas no GitHub

##### Modelo de Problema Épico

# Épico: {Nome do Épico}

## Descrição Épica

{Resumo épico do PRD}

## Valor Empresarial

- **Objetivo Principal**: {Principal objetivo de negócios}
- **Métricas de Sucesso**: {KPIs e resultados mensuráveis}
- **Impacto para o Usuário**: {Como os usuários se beneficiarão}

## Critérios de Aceitação Épicos

- [ ] {Requisito de alto nível 1}
- [ ] {Requisito de alto nível 2}

- [ ] {Requisito de alto nível 3}

## Recursos neste Épico

- [ ] #{feature-issue-number} - {Nome da Funcionalidade}

## Definição de Pronto

- [ ] Todas as histórias de destaque concluídas
- [ ] Os testes de ponta a ponta foram aprovados.
- [ ] Metas de desempenho atendidas

- [ ] Documentação atualizada

- [ ] Testes de aceitação do usuário concluídos

## Rótulos

épico, `{nível-de-prioridade}`, `{nível-de-valor}`

## Marco

{Versão/data de lançamento}

## Estimativa

Tamanho da camiseta épica: XS, S, M, L, XL, XXL

##### Modelo de Problema de Funcionalidade

# Recurso: {Nome do Recurso}

## Descrição da Funcionalidade

{Resumo das funcionalidades do PRD}

## Histórias de Usuário nesta Funcionalidade

- [ ] #{story-issue-number} - {Título da História do Usuário}
- [ ] #{story-issue-number} - {Título da História do Usuário}

## Facilitadores Técnicos

- [ ] #{número-da-questão-do-facilitador} - {Título do Facilitador}
- [ ] #{enabler-issue-number} - {Enabler Title}

## Dependências

**Bloqueia**: {Lista de problemas que esta funcionalidade bloqueia}
**Bloqueado por**: {Lista de problemas que estão bloqueando esta funcionalidade}

## Critérios de Aceitação

- [ ] {Validação técnica 1}
- [ ] {Validação técnica 2}

- [ ] Metas de desempenho atingidas

## Definição de Pronto

- [ ] Implementação concluída
- [ ] Testes unitários escritos
- [ ] Testes de integração passando

- [ ] Documentação atualizada

- [ ] Revisão de código aprovada

## Rótulos

`facilitador`, `{nível-de-prioridade}`, `infraestrutura/api/banco-de-dados`, `{nome-do-componente}`

## Recurso

#{feature-issue-number}

## Estimativa

{Pontos de história ou estimativa de esforço}

#### 4. Matriz de Prioridade e Valor

| Prioridade | Valor | Critérios                                        | Rótulos                            |
| ---------- | ----- | ------------------------------------------------ | ---------------------------------- |
| P0         | Alto  | Caminho crítico, bloqueando lançamento           | `prioridade-crítica`, `valor-alto` |
| P1         | Alto  | Funcionalidade principal, voltada para o usuário | `prioridade-alta`, `valor-alto`    |
| P1         | Médio | Funcionalidade principal, interna                | `prioridade-alta`, `valor-médio`   |
| P2         | Médio | Importante, mas não bloqueante                   | `prioridade-média`, `valor-médio`  |
| P3         | Baixo | Bom ter, dívida técnica                          | `prioridade-baixa`, `valor-baixo`  |

#### 5. Diretrizes de Estimativa

##### Escala de Pontos de História (Fibonacci)

- **1 ponto**: Mudança simples, <4 horas
- **2 pontos**: Pequena funcionalidade, <1 dia
- **3 pontos**: Recurso médio, 1-2 dias
- **5 pontos**: Recurso grande, 3-5 dias
- **8 pontos**: Recurso complexo, 1-2 semanas
- **13+ pontos**: Trabalho de nível épico, precisa ser dividido

##### Tamanho da Camiseta (Épicos/Funcionalidades)

- **XS**: 1-2 pontos de história no total
- **S**: 3-8 pontos de história no total
- **M**: 8-20 pontos de história no total
- **L**: 20-40 pontos de história no total
- **XL**: 40+ pontos de história no total (considere dividir)

#### 6. Gerenciamento de Dependências

```mermaid
graph LR
    A[Planejamento Épico] --> B[Definição de Funcionalidade]
```

     B --> C[Implementação de Habilitadores]
     C --> D[Desenvolvimento de História]
     D --> E[Execução de Testes]
     E --> F[Entrega de Funcionalidade]

    G[Configuração da Infraestrutura] --> C

H[Design da API] --> D
I[Esquema de Banco de Dados] --> C
J[Autenticação] --> D

##### Tipos de Dependência

- **Bloqueios**: Trabalho que não pode prosseguir até que isso esteja completo
- **Relacionado**: Trabalho que compartilha contexto, mas não é bloqueante
- **Pré-requisito**: Trabalho de infraestrutura ou configuração necessário
- **Paralelo**: Trabalho que pode prosseguir simultaneamente

#### 7. Modelo de Planejamento de Sprint

##### Planejamento de Capacidade do Sprint

- **Velocidade da Equipe**: {Pontos de história médios por sprint}
- **Duração da Sprint**: {sprints de 2 semanas recomendadas}
- **Alocação de Buffer**: 20% para trabalho inesperado e correções de bugs
- **Fator de Foco**: 70-80% do tempo total no trabalho planejado

##### Definição do Objetivo do Sprint

## Objetivo da Sprint {N}

**Objetivo Principal**: {Principal entrega para esta sprint}

**Histórias na Sprint**:

- #{issue} - {Título da História} ({pontos} pts)
- #{issue} - {Título da história} ({pontos} pts)

**Compromisso Total**: {pontos} pontos de história
**Critérios de Sucesso**: {Resultados Mensuráveis}

#### 8. Configuração do Quadro de Projetos do GitHub

##### Estrutura de Colunas (Kanban)

1. **Backlog**: Priorizado e pronto para planejamento
2. **Sprint Pronto**: Detalhado e estimado, pronto para desenvolvimento
3. **Em Progresso**: Atualmente em desenvolvimento
4. **Em Revisão**: Revisão de código, testes ou revisão de partes interessadas
5. **Teste**: Validação de QA e teste de aceitação
6. **Concluído**: Completo e aceito

##### Configuração de Campos Personalizados

- **Prioridade**: P0, P1, P2, P3
- **Valor**: Alto, Médio, Baixo
- **Componente**: Frontend, Backend, Infraestrutura, Testes
- **Estimativa**: Pontos de história ou tamanho de camiseta
- **Sprint**: Atribuição da sprint atual
- **Responsável**: Membro da equipe responsável
- **Épico**: Referência do épico pai

#### 9. Automação e GitHub Actions

##### Criação Automática de Problemas

```yaml
name: Criar Problemas de Funcionalidade
```

em:
workflow_dispatch:
entradas:
nome_da_funcionalidade:
descrição: 'Nome da funcionalidade'
obrigatório: verdadeiro
epic_issue:
descrição: 'Número da issue épica'
obrigatório: verdadeiro

trabalhos:
criar-issues:
executa-em: ubuntu-latest
etapas: - name: Criar Problema de Funcionalidade
uses: actions/github-script@v7
with:
script: |
const { data: epic } = await github.rest.issues. obter({
proprietário: context.repo.owner,
repositório: context.repo.repo,
número_da_issue: ${{ github.event.inputs.epic_issue }}
});

            const featureIssue = await github.rest.issues. criar({
              proprietário: context.repo.owner,
              repositório: context.repo.repo,
               título: `Funcionalidade: ${{ github.event.inputs.feature_name }}`,
              corpo: `# Funcionalidade: ${{ github.event.inputs.feature_name }}\n\n...`,
              rótulos: ['funcionalidade', 'prioridade-média'],
              marco: epic.data.milestone?.número
            });

##### Atualizações de Status Automatizadas

```yaml
name: Atualizar Status do Problema

em:
  pull_request:
     tipos: [aberto, fechado]

empregos:
   atualizar-status:
     executa-em: ubuntu-latest
    etapas:
       - nome: Mover para Em Revisão
        se: github.event.action == 'opened'
        usa: actions/github-script@v7
         # Mover problemas relacionados para a coluna "Em Revisão"

      - name: Mover para Concluído
        if: github.event.action == 'closed' && github.event.pull_request. mesclado
        usa: actions/github-script@v7
         # Mover problemas relacionados para a coluna "Feito"

### Lista de Verificação para Criação de Problemas

#### Preparação Pré-Criação

- [ ] **Artefatos da funcionalidade completos**: PRD, design UX, detalhamento técnico, plano de testes
- [ ]  **Epic existe**: Problema épico pai criado com rótulos e marco apropriados
- [ ] **Quadro do projeto configurado**: Colunas, campos personalizados e regras de automação configurados
- [ ] **Capacidade da equipe avaliada**: Planejamento da sprint e alocação de recursos concluídos

#### Problemas de Nível Épico

- [ ] **Problema épico criado** com descrição abrangente e critérios de aceitação
- [ ] **Marco do épico criado** com data de lançamento prevista

- [ ] **Rótulos de épico aplicados**: `épico`, prioridade, valor e rótulos de equipe

- [ ] **Épico adicionado ao quadro do projeto** na coluna apropriada

#### Problemas de Nível de Funcionalidade

- [ ] **Problema de recurso criado** vinculando ao épico pai
- [ ]  **Dependências de recursos identificadas** e documentadas
- [ ]  **Estimativa da funcionalidade concluída** usando a técnica de estimativa em camisetas
- [ ] **Critérios de aceitação da funcionalidade definidos** com resultados mensuráveis

#### Problemas de Nível de História/Facilitador documentados em `/docs/ways-of-work/plan/{epic-name}/{feature-name}/issues-checklist.md`

- [ ] **Histórias de usuário criadas** seguindo os critérios INVEST
- [ ] **Facilitadores técnicos identificados** e priorizados

- [ ] **Estimativas de pontos de história atribuídas** usando a escala de Fibonacci

- [ ]  **Dependências mapeadas** entre histórias e facilitadores
- [ ] **Critérios de aceitação detalhados** com requisitos testáveis

## Métricas de Sucesso

### KPIs de Gestão de Projetos

- **Previsibilidade da Sprint**: >80% do trabalho comprometido concluído por sprint
- **Tempo de Ciclo**: Tempo médio de "Em Progresso" a "Concluído" <5 dias úteis
- **Lead Time**: Tempo médio de "Backlog" a "Concluído"  <2 semanas
- **Taxa de Escape de Defeitos**: <5% das histórias requerem correções pós-lançamento
- **Velocidade da Equipe**: Entrega consistente de pontos de história em todas as sprints

### Métricas de Eficiência de Processos

- **Tempo de Criação do Problema**: <1 hora para criar a divisão completa da funcionalidade
- **Resolução de Dependências**: <24 horas para resolver dependências bloqueadoras
- **Precisão na Atualização de Status**: >95% das transições de status automatizadas funcionando corretamente
- **Completude da Documentação**: 100% dos problemas têm os campos obrigatórios do template preenchidos
- **Colaboração entre Equipes**: <2 dias úteis para resolução de dependências externas

### Métricas de Entrega de Projetos

- **Conformidade com a Definição de Pronto**: 100% das histórias concluídas atendem aos critérios de DoD
- **Cobertura dos Critérios de Aceitação**: 100% dos critérios de aceitação validados
- **Conquista dos Objetivos da Sprint**: >90% dos objetivos da sprint entregues com sucesso
- **Satisfação dos Stakeholders**: >90% de aprovação dos stakeholders para as funcionalidades concluídas
- **Precisão do Planejamento**: <10% de variação entre o tempo estimado e o tempo real de entrega

Esta abordagem abrangente de gerenciamento de projetos no GitHub garante total rastreabilidade desde o planejamento em nível épico até as tarefas individuais de implementação, com rastreamento automatizado e clara responsabilidade para todos os membros da equipe.
```
