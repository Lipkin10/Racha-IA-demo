# RachaAI - Brazilian AI-First Bill Splitter
## Complete AI Project Brief

*Generated using BMAD methodology by Sofia Martinez - AI-First Orchestrator*
*Created: December 2024*

---

## 1. Visão Geral do Projeto

### Nome do Projeto
**RachaAI** - Brazilian AI-First Bill Splitter

### Objetivo Principal  
Transformar a experiência tradicional de divisão de contas (como Splitwise) em uma interface conversacional natural, onde usuários descrevem suas despesas em português/inglês e o Claude processa e divide inteligentemente, eliminando formulários e botões complexos.

### Público-Alvo
- **Primário**: Jovens brasileiros urbanos (18-35 anos) que frequentemente dividem contas em restaurantes, viagens, festas
- **Secundário**: Profissionais que organizam eventos corporativos e precisam dividir despesas
- **B2B Futuro**: Restaurantes e organizadores de eventos que querem oferecer divisão automática

### Proposta de Valor
**80% de redução no tempo de interação** vs apps tradicionais através de:
- Processamento de linguagem natural em português brasileiro
- Compreensão contextual inteligente (lembra grupos, preferências, padrões)
- Sistema de memória que aprende dinâmicas dos grupos
- Compliance total com LGPD desde o design

### Exemplo de Fluxo do Usuário

**Usuário**: "Acabei de pagar R$ 180 no jantar do restaurante. Éramos 4 pessoas: eu, Maria, João e Ana. Mas a Maria só bebeu água, então ela paga menos 20 reais da conta dela."

**RachaAI**: "Entendi! Dividindo R$ 180 entre 4 pessoas com desconto de R$ 20 para Maria: João e Ana pagam R$ 50 cada, Maria paga R$ 30, e você paga R$ 50. Confirma?"

---

## 2. Capacidades de IA Requeridas

### Funcionalidades Principais
- [x] **Chatbot Conversacional**: Interface principal em português brasileiro com suporte a inglês
- [x] **Processamento de Linguagem Natural**: Análise de descrições complexas de despesas
- [x] **Sistema de Memória Contextual**: Lembra grupos, preferências, padrões de divisão
- [x] **Cálculo Inteligente**: Divisão automática com regras personalizadas (descontos, proporções)
- [x] **Classificação de Despesas**: Categorização automática (restaurante, transporte, hospedagem)
- [x] **Recomendações de Pagamento**: Sugestões baseadas em preferências do usuário
- [x] **Análise de Padrões**: Detecta comportamentos recorrentes dos grupos
- [x] **Validação Contextual**: Confirma divisões antes de finalizar
- [x] **Multiidioma**: Processamento simultâneo PT-BR e EN com code-switching

### Modelos de IA por Uso Específico

**Claude Haiku (70% das operações)**
- Confirmações simples e validações
- Cálculos básicos de divisão
- Respostas de follow-up
- Processamento de comandos diretos
- Estimativa: ~R$ 0,02 por interação

**Claude Sonnet (25% das operações)** 
- Processamento de linguagem natural complexo
- Análise de contexto multi-pessoa
- Resolução de ambiguidades
- Sugestões inteligentes de divisão
- Estimativa: ~R$ 0,15 por interação

**Claude Opus (5% das operações)**
- Situações altamente complexas ou ambíguas
- Processamento de despesas corporativas elaboradas
- Resolução de conflitos de interpretação
- Casos edge que requerem raciocínio avançado
- Estimativa: ~R$ 0,50 por interação

### Capacidades Específicas do RachaAI

**Processamento Contextual Brasileiro**
- Entendimento de gírias e expressões regionais
- Reconhecimento de moedas (R$, reais, real, pila)
- Interpretação de quantidades ("uma galera", "nós quatro")
- Compreensão de situações culturais (rodízio, happy hour, vaquinha)

**Sistema de Memória Avançado**
- Grupos recorrentes e suas dinâmicas
- Preferências de pagamento por pessoa
- Histórico de divisões para sugestões futuras
- Padrões de comportamento (quem sempre esquece carteira, quem prefere PIX)

---

## 3. Requisitos do Mercado Brasileiro

### Conformidade LGPD (Lei Geral de Proteção de Dados)

**Requisitos Específicos para RachaAI**
- [x] **Consentimento Granular**: Consent para processamento de conversas e memória de grupos
- [x] **Finalidade Específica**: IA exclusivamente para cálculo e divisão, não pagamentos
- [x] **Minimização de Dados**: Apenas conversas para cálculo, **zero dados financeiros sensíveis**
- [x] **Transparência de IA**: Explicação de como Claude processa descrições de despesas
- [x] **Direito ao Esquecimento**: Exclusão de grupos, conversas e padrões
- [x] **Portabilidade**: Exportação de histórico de divisões
- [x] **DPO Designado**: Encarregado especializado em IA e processamento de linguagem natural

**Implementação LGPD para IA Conversacional**
- **Consent Flow**: "Posso lembrar deste grupo para próximas divisões?" (opt-in explícito)
- **AI Transparency**: "O Claude analisou sua mensagem e sugeriu..." (explicabilidade)
- **Data Retention**: Conversas deletadas após 90 dias, padrões anonimizados após 1 ano
- **User Control**: Dashboard para gerenciar memórias, grupos e preferências armazenadas

### Preferências de Pagamento (Profile-Based)

**Sistema de Preferências Simples**
- **Método Preferido**: PIX, Transferência, Dinheiro, "Depois acerto"
- **Chave PIX**: Armazenada no perfil para fácil compartilhamento
- **Limite Confortável**: Valor máximo para "aceitar dever"
- **Observações**: "Só tenho PIX", "Prefiro dinheiro", "Sempre esqueço carteira"

**Smart Suggestions (Sem Transações)**
- "João prefere PIX - chave: joao@email.com"
- "Maria sempre paga em dinheiro"
- "Ana aceita ficar devendo até R$ 50"
- "Grupo costuma fazer PIX para Pedro e ele paga tudo"

### Localização Cultural Específica

**Linguagem e Comunicação**
- **Português Brasileiro**: Foco em informalidade natural ("Oi! Como vai dividir hoje?")
- **Regionalização**: Suporte a expressões regionais (SP: "balada", RJ: "night", NE: "forró")
- **Code-switching**: Processamento natural de mistura português/inglês
- **Formalidade Adaptável**: Contexto corporativo = formal, amigos = informal

**Contextos Culturais Brasileiros**
- **Cenários Típicos**: Churrasco, happy hour, rodízio, viagem de formatura, vaquinha
- **Padrões Sociais**: "Quem convida paga", "dividir igualzinho", "fulano sempre esquece carteira"
- **Eventos Regionais**: Festa junina, carnaval, shows sertanejo, praia
- **Timing Cultural**: Jantar às 20h+, balada após 23h, almoço entre 12-14h

### Hospedagem e Dados

**Residência de Dados LGPD**
- **Servidor Principal**: AWS sa-east-1 (São Paulo)
- **Backup Secundário**: Google Cloud southamerica-east1
- **Redis Cache**: Região brasileira obrigatória
- **Supabase**: Instância dedicada em São Paulo
- **Claude API**: Proxies brasileiros para compliance

**Performance e Disponibilidade**
- **Latência Target**: <1.5s São Paulo, <2.5s demais capitais
- **Uptime**: 99.9% com SLA específico para horários brasileiros
- **Peak Hours**: 19h-23h (jantar) e fins de semana
- **Mobile-First**: 80% tráfego mobile, otimização 4G/5G

---

## 4. Especificações Técnicas

### Arquitetura Simplificada

**Core Stack - Claude + Supabase + Redis**
- **LLM Provider**: Claude (Anthropic) com distribuição 70/25/5 (Haiku/Sonnet/Opus)
- **Database**: Supabase PostgreSQL + Vector Store para memória conversacional
- **Caching**: Redis para sessões ativas e grupos recorrentes
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind
- **Deployment**: Vercel + AWS sa-east-1 para compliance brasileiro
- **Monitoring**: Supabase Analytics + Claude API metrics

### Estimativas de Volume (MVP 6-8 semanas)

**Usuários Target**
- **Usuários Simultâneos**: 50-200 (MVP validation)
- **Interações/Dia**: 500-2000 (10-40 por usuário ativo)
- **Grupos Ativos**: 100-500 grupos recorrentes
- **Crescimento Mensal**: 50% após product-market fit

**Dados Armazenados (Simplificado)**
- **Conversas**: ~100MB (texto apenas, 90 dias retenção)
- **Grupos**: ~10MB (perfis, preferências, padrões)
- **Histórico Divisões**: ~50MB (cálculos e resultados)
- **Vector Embeddings**: ~200MB (memória contextual)

### Claude Model Distribution Strategy

**Haiku (70%)**: Confirmações simples, cálculos diretos, follow-ups básicos, validações de entrada
**Sonnet (25%)**: Processamento NLP complexo, análise de contexto multi-pessoa, sugestões baseadas em histórico, resolução de ambiguidades
**Opus (5%)**: Casos edge altamente complexos, conflitos de interpretação, despesas corporativas elaboradas, situações que falharam em Sonnet

### Caching Strategy (Redis)
- **Active Sessions**: 15min TTL para conversas ativas
- **Group Memory**: 24h TTL para grupos usados recentemente  
- **User Preferences**: 7 dias TTL, refresh on update
- **Common Patterns**: 1h TTL para divisões típicas ("dividir igualmente")

### Requisitos de Performance

**Response Time Targets**
- **Haiku Operations**: < 1 segundo (confirmações, cálculos simples)
- **Sonnet Operations**: < 2.5 segundos (processamento NLP)
- **Opus Operations**: < 5 segundos (casos complexos)
- **Cache Hits**: < 200ms (respostas instantâneas)

**Availability & Scalability**
- **Uptime**: 99.9% (SLA focado em horários brasileiros)
- **Auto-scaling**: Baseado em concurrent conversations
- **Peak Performance**: 19h-23h dias úteis, fins de semana integrais
- **Graceful Degradation**: Fallback para cálculos simples se Claude indisponível

---


### Estratégia de Otimização de Custos

**Intelligent Model Routing**
- Cache-first: Redis lookup antes de qualquer Claude call
- Pattern recognition: Respostas templated para cenários comuns
- Batch processing: Agrupar múltiplas validações em single request
- Context minimization: Enviar apenas contexto essencial para Claude

**Smart Fallbacks**
- Claude down: Cálculos básicos matemáticos locais
- Rate limited: Queue + batch processing
- Cost threshold: Downgrade Sonnet → Haiku quando possível

### Budget Breakdown por Fase

**Fase 1: Development (Semanas 1-4) - R$ 800 total**
**Fase 2: MVP Launch (Semanas 5-8) - R$ 1.500 total**
**Fase 3: Growth (Meses 3-6) - R$ 3.500/mês**

### ROI & Unit Economics

**Cost per Active User (Target)**
- **Month 1**: R$ 25-40 por usuário ativo
- **Month 3**: R$ 8-15 por usuário ativo  
- **Month 6**: R$ 3-6 por usuário ativo (economy of scale)

**Revenue Model (Future)**
- **Freemium**: 10 divisões/mês gratuitas
- **Premium**: R$ 9,90/mês (divisões ilimitadas + features)
- **Team**: R$ 29,90/mês (grupos corporativos + analytics)

---

## 6. Conformidade e Segurança

### Requisitos LGPD Específicos

**Conformidade para IA Conversacional**
- [x] **DPO Designado**: Encarregado especializado em processamento de linguagem natural
- [x] **RIPD**: Relatório de Impacto específico para IA conversacional (baixo risco)
- [x] **Política de Privacidade**: Transparência sobre processamento Claude + memória contextual
- [x] **Termos de Uso**: Cobertura específica para interações de IA e divisão de contas
- [x] **Consentimento de IA**: "Posso usar IA para processar suas mensagens e melhorar sugestões?"
- [x] **Consentimento de Memória**: "Posso lembrar suas preferências e grupos para próximas divisões?"
- [x] **Auditoria Conversacional**: Logs de processamento Claude para contestação
- [x] **Explicabilidade**: "Claude interpretou sua mensagem como..." 

### Implementação de Direitos dos Usuários

**Data Access**: Exportar todas as conversas (90 dias), ver grupos e padrões salvos, histórico de interpretações Claude, preferências e configurações
**Data Correction**: Corrigir nomes/preferências, atualizar método preferido, marcar interpretação incorreta da IA
**Data Portability**: JSON estruturado + CSV para planilhas, grupos/divisões/preferências/conversas, download imediato via dashboard
**Right to Erasure**: Deletar tudo + desanonimizar padrões, remover grupos específicos, limpar histórico mantendo preferências, resetar padrões aprendidos pela IA

### Segurança Técnica

**Autenticação e Autorização**
- [x] **Supabase Auth**: Email/password + social logins (Google, Apple)
- [x] **MFA Opcional**: Authenticator apps para usuários premium
- [x] **Session Management**: JWT com refresh tokens, 7 dias TTL
- [x] **Device Management**: Logout remoto, sessões ativas visíveis
- [x] **Rate Limiting**: 100 requests/min por usuário, 10 Claude calls/min

**Proteção de Dados Conversacionais**
- **Encryption at Rest**: AES-256 Supabase native encryption para conversas, encrypted PII fields, vector embeddings anonymized, Redis with encryption enabled
- **Encryption in Transit**: TLS 1.3 (HTTPS only), direct HTTPS to Anthropic, native encrypted connections Supabase, TLS encrypted cache connections
- **Access Controls**: Only group members see conversations, complete data separation per user, zero admin access to conversation content, technical logs only

### Incident Response & Monitoring

**Security Monitoring**
- **Anomaly Detection**: Unusual conversation patterns, spam detection
- **Access Monitoring**: Failed logins, suspicious locations
- **AI Abuse Detection**: Attempts to manipulate Claude for non-expense tasks
- **Data Breach Response**: 72h ANPD notification, user communication protocol

**Backup & Recovery**
- **Supabase Backups**: Daily automated backups, 30 days retention, Brazilian region only, AES-256 encrypted at rest
- **Redis Recovery**: RDB snapshots every 6 hours, primary + replica in São Paulo, graceful degradation without cache
- **Disaster Recovery**: <4 hours RTO, <1 hour RPO, monthly disaster recovery drills

---

## 7. Critérios de Sucesso

### Métricas Técnicas (MVP + 3 meses)

**AI Performance & Accuracy**
- **Expense Understanding**: >90% accuracy na interpretação de descrições de despesas em português
- **Context Retention**: >85% precisão em lembrar grupos e preferências após 3+ interações
- **Language Processing**: >95% success rate para code-switching português/inglês
- **Calculation Accuracy**: 100% precisão matemática em divisões (zero tolerância a erros)
- **Edge Case Handling**: <5% de casos que escalam para suporte humano

**Performance & Reliability**
- **Response Time**: Haiku <1s, Sonnet <2.5s, Opus <5s, Cache hits <200ms
- **Availability**: 99.9% uptime (SLA brasileiro, 19h-23h crítico), <0.1% error rate
- **Scalability**: 200+ usuários simultâneos, 50+ conversas/minuto peak, <100ms query time average

### Métricas de Experiência do Usuário

**Conversational UX (Objetivo Principal)**
- **Time Reduction**: 80% redução vs apps tradicionais (5min → 1min para divisão complexa)
- **User Satisfaction**: >4.5/5.0 rating para naturalidade conversacional
- **Conversation Success**: >95% de divisões completadas sem necessidade de interface manual
- **Error Recovery**: >90% de mal-entendidos resolvidos em 1 follow-up
- **Learning Effectiveness**: 50% improvement em speed após 5 interações do mesmo grupo

**Adoption & Engagement (Específico Brasil)**
- **Week 1 Retention**: >60% (usuários voltam na semana 1)
- **Month 1 Retention**: >40% (permanecem ativos mês 1)
- **Group Formation**: >70% criam pelo menos 1 grupo recorrente
- **Referral Rate**: >30% convidam amigos orgânicamente
- **Portuguese Preference**: >80% conversas em português
- **Regional Adoption**: Todas regiões brasileiras representadas

### Métricas de Negócio

**Unit Economics & Cost Optimization**
- **Cost per Interaction**: <R$ 0.80 média (target R$ 0.50 até mês 6)
- **Claude Cost Breakdown**: 70% Haiku, 25% Sonnet, 5% Opus mantido
- **Cache Hit Rate**: >40% interações resolvidas via Redis
- **Revenue per User**: R$ 12+ mensais (post-monetization)

**Market Penetration (Brazilian Focus)**
- **Geographic Coverage**: Presença em 15+ cidades brasileiras
- **Demographics**: 60% São Paulo/Rio, 40% demais regiões
- **Competitive Position**: Top 3 em "bill splitting" App Store Brasil
- **Word-of-Mouth**: 40% novos usuários via referral orgânico

### Timeline BMAD Story-by-Story

**Sprint 0: Foundation (Semanas 1-2)**
- **Story 1**: Basic Claude integration + simple expense parsing
- **Story 2**: Supabase setup + user authentication
- **Story 3**: Basic conversation flow + response system
- **Success Gate**: Claude responde "Olá" e faz divisão simples

**Sprint 1: Core MVP (Semanas 3-4)** 
- **Story 4**: Complex expense parsing (discounts, different amounts)
- **Story 5**: Group creation and member management
- **Story 6**: Memory system + preference storage
- **Success Gate**: Divisão complexa real com grupo de 4 pessoas

**Sprint 2: Brazilian Polish (Semanas 5-6)**
- **Story 7**: Portuguese optimization + cultural contexts
- **Story 8**: Payment preferences + PIX integration suggestions
- **Story 9**: LGPD compliance + privacy controls
- **Success Gate**: Usuário brasileiro real consegue usar naturalmente

**Sprint 3: Production Ready (Semanas 7-8)**
- **Story 10**: Performance optimization + caching
- **Story 11**: Error handling + edge cases
- **Story 12**: Analytics + monitoring + user feedback
- **Success Gate**: 50 usuários beta usando sem suporte técnico

### Success Validation Checkpoints

**Week 4**: Core Functionality - Claude interpreta 80%+ das descrições, divisões 100% precisas, usuários conseguem criar e usar grupos
**Week 6**: Brazilian Market Fit - Conversas fluem em português, contextos culturais funcionam, LGPD compliance básica
**Week 8**: Production Readiness - Performance targets atingidos, 20+ usuários beta ativos, zero critical bugs
**Month 3**: Product-Market Fit - 200+ usuários ativos, 60% month-1 retention, NPS >50, organic growth >30%

---

