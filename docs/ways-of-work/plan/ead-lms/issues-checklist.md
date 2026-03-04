# Checklist de Issues - Plataforma AVA/LMS

## 📋 Como Usar

1. Criar issue no GitHub
2. Copiar título e corpo de um dos templates abaixo
3. Preencher placeholders `{}`
4. Adicionar labels, assignee, e milestone

---

# 🎓 EPIC: EAD-LMS - Plataforma Educacional

## Título

```
Epic: EAD-LMS - Plataforma Educacional Completa
```

## Descrição

```markdown
# Epic: EAD-LMS - Plataforma Educacional Completa

## Descrição Épica

Plataforma LMS (Learning Management System) escalável que fornece gestão de cursos, turmas, disciplinas, aulas em múltiplos formatos (vídeo, quiz, atividades, fórum), submissões de trabalhos e sistema de avaliações. Baseado na estrutura Estácio.

## Valor Empresarial

- **Objetivo Principal**: Criar solução LMS moderna que substitua sistemas legados
- **Métricas de Sucesso**:
  - 100+ cursos hospedados
  - 10K+ alunos suportados
  - Tempo de carregamento < 2s (p95)
  - 99.5% uptime
  - NPS > 8/10
- **Impacto para o Usuário**:
  - Professores: Ferramenta intuitiva para criar/gerenciar conteúdo
  - Alunos: Experiência moderna de aprendizado
  - Admin: Controle completo e visibilidade

## Critérios de Aceitação Épicos

- [ ] Todos os serviços educacionais implementados (Course, Class, Discipline, Lesson, Enrollment, Submission)
- [ ] API RESTful completa com 30+ endpoints documentados
- [ ] Dashboards funcionais (aluno, professor, admin)
- [ ] Testes de integração com 80%+ cobertura
- [ ] UX responsiva em desktop e mobile
- [ ] Performance: p95 < 2s, p99 < 5s

## Features neste Epic

- [ ] #XXX - Feature: Gestão de Cursos
- [ ] #XXX - Feature: Gestão de Turmas
- [ ] #XXX - Feature: Aulas & Conteúdo
- [ ] #XXX - Feature: Atividades & Submissões
- [ ] #XXX - Feature: Avaliações & Notas
- [ ] #XXX - Feature: Comunicação (Fórum)
- [ ] #XXX - Enabler: Infraestrutura & Otimização

## Definição de Pronto

- [ ] Todas as Features concluídas e merged em main
- [ ] Testes E2E: 80%+ cobertura de fluxos críticos
- [ ] Benchmarks de performance atendidos
- [ ] Documentação de API (OpenAPI/Swagger) completa
- [ ] Guia de usuário para cada role (aluno/professor/admin)
- [ ] Deployment em staging validado
- [ ] Code review aprovado por lead tech

## Rótulos

`epic`, `prioridade-crítica`, `valor-alto`, `sprint-1`

## Milestone

v1.0.0 - MVP LMS

## Estimativa

Tamanho: XXL (200+ story points)
Timeline: 5 semanas
```

**Labels**: epic, prioridade-crítica, valor-alto
**Milestone**: v1.0.0

---

# 📚 FEATURE: Gestão de Cursos

## Title

```
Feature: Gestão de Cursos (Criar, Editar, Listar)
```

## Body

```markdown
# Feature: Gestão de Cursos

## Descrição

Administradores podem criar, editar, listar e deletar cursos. Cada curso é o nível mais alto da hierarquia (Curso > Turma > Disciplina > Aula).

## Histórias de Usuário nesta Feature

- [ ] #XXX - Story: Criar Curso
- [ ] #XXX - Story: Editar Curso
- [ ] #XXX - Story: Listar Cursos com Paginação
- [ ] #XXX - Story: Deletar Curso (Soft-delete)

## Enablers Técnicos

- [ ] Database schema: tabela 'courses' finalizada ✅
- [ ] Prisma client gerado ✅
- [ ] Validação Zod para Course schema ✅
- [ ] CourseService implementado ✅

## Critérios de Aceitação

- [ ] POST /api/courses cria novo curso com code, name, description
- [ ] Validação: code deve ser únido
- [ ] Validação: apenas admin pode criar
- [ ] GET /api/courses retorna listagem paginada (limit, page, sortBy)
- [ ] PUT /api/courses/:courseId atualiza nome, descrição, imagem
- [ ] Validação: apenas admin ou course admin pode editar
- [ ] DELETE /api/courses/:courseId efetua soft-delete (não remove dados)
- [ ] Todos endpoints testados (integration tests)

## Dependências

**Bloqueado por**:

- Enabler: Implementação de auth hooks ✅
- Better Auth configurado ✅

**Bloqueia**:

- Feature: Gestão de Turmas

## Definição de Pronto

- [ ] Implementação completada
- [ ] Testes de integração escritos (>80% cobertura)
- [ ] Documentação de API atualizada
- [ ] Code review aprovado
- [ ] Lint/format passando: `pnpm lint`
- [ ] Typecheck: `pnpm typecheck` sem erros

## Rótulos

`feature`, `prioridade-crítica`, `valor-alto`, `backend`, `database`

## Recurso

Épic #XXX

## Estimativa

13 story points (4 stories)
```

**Labels**: feature, prioridade-crítica, valor-alto, backend

---

# 👥 FEATURE: Gestão de Turmas

## Title

```
Feature: Gestão de Turmas (T01, T02, Matrículas)
```

## Body

```markdown
# Feature: Gestão de Turmas

## Descrição

Professores e admins criam turmas específicas de um curso (semestres, períodos). Cada turma pode ter múltiplas disciplinas e alunos matriculados.

## Histórias de Usuário nesta Feature

- [ ] #XXX - Story: Criar Turma para um Curso
- [ ] #XXX - Story: Listar Turmas de um Curso
- [ ] #XXX - Story: Editar Turma
- [ ] #XXX - Story: Inscrever Aluno em Turma
- [ ] #XXX - Story: Listar Alunos Matriculados

## Enablers Técnicos

- [ ] Database schema: tabela 'classes' finalizada ✅
- [ ] Prisma migration aplicada ✅
- [ ] ClassService implementado ✅
- [ ] EnrollmentService implementado ✅

## Critérios de Aceitação

- [ ] POST /api/courses/:courseId/classes cria turma (semester: "2024.1", code: "T01")
- [ ] Turma é automaticamente vinculada ao instrutor (request.user.id)
- [ ] GET /api/courses/:courseId/classes retorna turmas paginadas
- [ ] Validação: semester em formato "YYYY.N"
- [ ] Validação: code único dentro do curso+semestre
- [ ] PUT /api/classes/:classId atualiza datas, capacidade, instrutor
- [ ] DELETE /api/classes/:classId remove turma vazia
- [ ] POST /api/classes/:classId/enroll inscreve aluno autenticado
- [ ] GET /api/classes/:classId/enrollments lista alunos (apenas prof/admin)
- [ ] Integração com authentication: roles validados

## Dependências

**Bloqueado por**:

- Feature: Gestão de Cursos ✅

**Bloqueia**:

- Feature: Aulas & Conteúdo
- Feature: Atividades & Submissões

## Definição de Pronto

- [ ] Implementação completa
- [ ] Testes de integração (cenários: criar, inscrever, listar)
- [ ] Testes de permissão (apenas prof edita sua turma)
- [ ] Documentação API
- [ ] Code review aprovado

## Rótulos

`feature`, `prioridade-crítica`, `valor-alto`, `backend`, `enrollment`

## Recurso

Epic #XXX

## Estimativa

8 story points
```

**Labels**: feature, prioridade-crítica, valor-alto, backend

---

# 📖 FEATURE: Aulas & Conteúdo (Tipos Polimórficos)

## Title

```
Feature: Aulas & Conteúdo Multi-tipo (Vídeo, Quiz, Texto, Arquivo, Atividade)
```

## Body

```markdown
# Feature: Aulas & Conteúdo

## Descrição

Gerenciamento de aulas com suporte a múltiplos tipos: VIDEO, QUIZ, TEXT, FILE, ACTIVITY, FORUM, LIVE. Cada tipo tem estrutura de content JSON específica.

## Histórias de Usuário

- [ ] #XXX - Story: Criar Aula de Vídeo
- [ ] #XXX - Story: Criar Quiz com Questões
- [ ] #XXX - Story: Criar Aula de Texto/HTML
- [ ] #XXX - Story: Criar Tarefa/Atividade
- [ ] #XXX - Story: Listar Aulas de Disciplina
- [ ] #XXX - Story: Publicar Aula

## Enablers Técnicos

- [ ] Database schema: tabela 'lessons', 'quiz_questions' ✅
- [ ] JSON field type para 'content' ✅
- [ ] Zod schemas para cada tipo de lesson ✅
- [ ] LessonService implementado ✅

## Critérios de Aceitação

- [ ] POST /api/disciplines/:disciplineId/lessons cria aula com type
- [ ] Content JSON validado conforme tipo:
  - VIDEO: { videoUrl, duration?, transcript? }
  - QUIZ: { questions: [...] }
  - TEXT: { htmlContent }
  - FILE: { fileUrl, mimeType }
  - ACTIVITY: { instructions, allowedFormats?, maxSubmissions }
- [ ] GET /api/lessons/:lessonId retorna aula completa
- [ ] PUT /api/lessons/:lessonId atualiza conteúdo
- [ ] DELETE /api/lessons/:lessonId soft-delete
- [ ] GET /api/disciplines/:disciplineId/lessons paginado
- [ ] POST /api/lessons/:lessonId/publish define publishedAt
- [ ] Validação: apenas instructor da disciplina pode criar/editar

## Dependências

**Bloqueado por**:

- Feature: Gestão de Turmas ✅

**Bloqueia**:

- Feature: Atividades & Submissões
- Feature: Avaliações & Notas
- Feature: Comunicação

## Definição de Pronto

- [ ] Implementação de todos os 7 tipos
- [ ] Testes: criar cada tipo de aula
- [ ] Testes: content JSON validado por tipo
- [ ] Testes: permissões (instrutor only)
- [ ] Documentação de schemas para cada tipo
- [ ] Code review aprovado

## Rótulos

`feature`, `prioridade-alta`, `valor-alto`, `backend`, `polimórfico`

## Recurso

Epic #XXX

## Estimativa

21 story points
```

**Labels**: feature, prioridade-alta, valor-alto, backend

---

# ✏️ FEATURE: Atividades & Submissões

## Title

```
Feature: Atividades & Submissões (Aluno Entregar, Prof Avaliar)
```

## Body

```markdown
# Feature: Atividades & Submissões

## Descrição

Alunos submitem trabalhos (atividades), professores avaliam, atribuem notas e fornecem feedback.

## Histórias de Usuário

- [ ] #XXX - Story: Aluno Submeter Atividade
- [ ] #XXX - Story: Aluno Ver Histórico de Submissões
- [ ] #XXX - Story: Professor Listar Submissões de Atividade
- [ ] #XXX - Story: Professor Avaliar e Dar Feedback

## Enablers Técnicos

- [ ] Database schema: tabela 'lesson_submissions' ✅
- [ ] SubmissionService implementado ✅
- [ ] Validação: apenas lessons com type=ACTIVITY permitem submission

## Critérios de Aceitação

- [ ] POST /api/lessons/:lessonId/submit cria submission
- [ ] Validação: lesson.type === ACTIVITY
- [ ] Validação: aluno autenticado
- [ ] Content field: string (URL de arquivo ou texto)
- [ ] GET /api/lessons/:lessonId/submissions retorna todas submissions (prof only)
- [ ] PUT /api/submissions/:submissionId/grade atualiza grade + feedback
- [ ] Validação: apenas instrutor da disciplina pode gravar
- [ ] GET /api/student/submissions retorna minhas submissões (aluno)
- [ ] Integration test de fluxo completo: aluno submete → prof avalia

## Dependências

**Bloqueado por**:

- Feature: Aulas & Conteúdo (lesson com type=ACTIVITY) ✅

**Bloqueia**: Nada

## Definição de Pronto

- [ ] Implementação completa do fluxo
- [ ] Testes: aluno consegue submeter
- [ ] Testes: professor consegue avaliar
- [ ] Testes: permissões (apenas prof da disciplina)
- [ ] Code review aprovado

## Rótulos

`feature`, `prioridade-alta`, `valor-alto`, `backend`, `submissions`

## Recurso

Epic #XXX

## Estimativa

13 story points
```

**Labels**: feature, prioridade-alta, valor-alto, backend

---

# ⭐ FEATURE: Avaliações & Notas

## Title

```
Feature: Avaliações & Notas (Quiz Automático, Boletim)
```

## Body

```markdown
# Feature: Avaliações & Notas

## Descrição

Quizzes são corrigidos automaticamente pelo sistema (múltipla escolha). Notas consolidadas em boletim por aluno/semestre.

## Histórias de Usuário

- [ ] #XXX - Story: Aluno Responder Quiz
- [ ] #XXX - Story: Sistema Corrigir Automaticamente
- [ ] #XXX - Story: Professor Ver Analytics de Quiz
- [ ] #XXX - Story: Aluno Ver Boletim de Notas

## Enablers Técnicos

- [ ] Database schema: tabelas 'quiz_questions', 'quizzes_taken' ✅
- [ ] Lógica de correção automática (múltipla escolha)
- [ ] Query para consolidar boletim por aluno

## Critérios de Aceitação

- [ ] POST /api/lessons/:lessonId/take-quiz submete respostas
- [ ] Format: { answers: { questionId: answerIndex } }
- [ ] Validação: lesson.type === QUIZ
- [ ] Sistema calcula score automaticamente
- [ ] GET /api/student/transcript retorna boletim consolidado
- [ ] Boletim mostra: disciplina, nota, status (aprovado/reprovado)
- [ ] Professor pode ver estatísticas por questão (qual % errou)
- [ ] Quiz pode ser refeito: score máximo conta

## Dependências

**Bloqueado por**:

- Feature: Aulas & Conteúdo (lesson com type=QUIZ) ✅

**Bloqueia**: Nada

## Definição de Pronto

- [ ] Implementação de correção automática
- [ ] Testes: aluno tira 100% em quiz
- [ ] Testes: aluno tira 50% em quiz
- [ ] Testes: boletim consolida múltiplos quizzes
- [ ] Testes: prof vê analytics

## Rótulos

`feature`, `prioridade-alta`, `valor-alto`, `backend`, `analytics`

## Recurso

Epic #XXX

## Estimativa

13 story points
```

**Labels**: feature, prioridade-alta, valor-alto, backend

---

# 💬 FEATURE: Comunicação (Fórum MVP)

## Title

```
Feature: Comunicação - Fórum de Discussão (MVP)
```

## Body

```markdown
# Feature: Comunicação - Fórum

## Descrição

Fórum simples para discussão dentro de cada aula. Alunos/professores criam tópicos e respostas.

## Histórias de Usuário

- [ ] #XXX - Story: Criar Tópico no Fórum
- [ ] #XXX - Story: Responder Tópico
- [ ] #XXX - Story: Listar Tópicos de Aula

## Enablers Técnicos

- [ ] Database schema: tabelas 'forum_posts', 'forum_replies' ✅
- [ ] ForumService (future)

## Critérios de Aceitação

- [ ] POST /api/lessons/:lessonId/forum cria post
- [ ] POST /api/forum/:postId/reply cria resposta
- [ ] GET /api/lessons/:lessonId/forum lista threads (paginado)
- [ ] Validação: apenas enrolled users podem ver/postar

## Dependências

**Bloqueado por**:

- Feature: Aulas & Conteúdo ✅

**Bloqueia**: Nada

## Definição de Pronto

- [ ] MVP básico de forum funcionando
- [ ] Code review aprovado

## Rótulos

`feature`, `prioridade-média`, `valor-médio`, `backend`, `comunicação`

## Recurso

Epic #XXX

## Estimativa

8 story points
```

**Labels**: feature, prioridade-média, valor-médio, backend

---

# 🔧 ENABLER: Infraestrutura & Otimização

## Title

```
Enabler: Infraestrutura - Índices, Testing, CI/CD
```

## Body

```markdown
# Enabler: Infraestrutura & Otimização

## Descrição

Trabalho técnico de suporte: índices de database, framework de testes, CI/CD pipeline, monitoring.

## Enablers Específicos

- [ ] #XXX - Enabler: Índices de Database
- [ ] #XXX - Enabler: Testing Framework & Fixtures
- [ ] #XXX - Enabler: Web Components (shadcn/ui integration)
- [ ] #XXX - Enabler: CI/CD Pipeline
- [ ] #XXX - Enabler: Logging & Monitoring

## Critérios de Aceitação

- [ ] Índices criados: courseId, classId, disciplineId, lessonId, userId em todas tabelas
- [ ] Índices em timestamps (createdAt, publishedAt) para paginação
- [ ] Constraints única em compostas (class: courseId+semester+code)
- [ ] Fixtures de dados de teste para cada feature
- [ ] Testes de integração rodando em cada feature
- [ ] `pnpm lint` sem erros
- [ ] `pnpm typecheck` sem erros
- [ ] Database performance benchmarked

## Dependências

**Bloqueado por**: Nada
**Bloqueia**: Tudo (suporte transversal)

## Definição de Pronto

- [ ] Índices criados e migração aplicada
- [ ] Fixtures de teste documentadas
- [ ] Pipeline CI/CD verde
- [ ] Lint & typecheck passando

## Rótulos

`enabler`, `prioridade-crítica`, `infraestrutura`, `backend`

## Recurso

Epic #XXX

## Estimativa

21 story points (5 enablers)
```

**Labels**: enabler, prioridade-crítica, infraestrutura

---

## 🎯 PRÓXIMAS AÇÕES

### Para criar issues automaticamente:

1. Copie o conteúdo de um template acima
2. Crie novo issue no GitHub
3. Cole título e body
4. Preencha labels, assignee, milestone
5. Vincule ao epic usando "Related Issues"

### Ordem de Criação Recomendada:

1. ✅ Epic: EAD-LMS (já temos o plano-plan.md)
2. ✅ Feature: Gestão de Cursos
3. ✅ Feature: Gestão de Turmas
4. ✅ Feature: Aulas & Conteúdo
5. ✅ Feature: Atividades & Submissões
6. ✅ Feature: Avaliações & Notas
7. ✅ Feature: Comunicação
8. ✅ Enabler: Infraestrutura
9. Stories individuais (debaixo de cada feature)

### Automação Future:

- GitHub Actions para criar issues via API
- Vinculação automática de PRs a issues
- Auto-close quando PR mergea
