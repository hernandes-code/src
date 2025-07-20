
import { GameCard } from '../types/game';

// Personalização de estilo inicial
export const PLAYER_STYLES = [
  {
    id: 'tech',
    name: 'Tecnológico',
    bonus: { technology: 15 },
    penalty: { budget: -10 },
    description: 'Começa com mais tecnologia, mas menos orçamento.'
  },
  {
    id: 'budget',
    name: 'Orçamentário',
    bonus: { budget: 15 },
    penalty: { satisfaction: 0 },
    description: 'Começa com mais orçamento.'
  },
  {
    id: 'popular',
    name: 'Popular',
    bonus: { audience: 15 },
    penalty: { technology: 0 },
    description: 'Começa com mais público.'
  }
];

// Função para balanceamento dinâmico dos eventos aleatórios
export function getBalancedRandomEvent(metrics) {
  // Se orçamento baixo, menos chance de evento negativo de orçamento
  const filtered = randomEvents.filter(ev => {
    if (metrics.budget < 30 && ev.effects.budget && ev.effects.budget < 0) return false;
    if (metrics.satisfaction < 30 && ev.effects.satisfaction && ev.effects.satisfaction < 0) return false;
    return true;
  });
  if (filtered.length === 0) return randomEvents[Math.floor(Math.random() * randomEvents.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// Função para aplicar curva de dificuldade
export function applyDifficultyCurve(card, index, total) {
  // Suaviza efeitos nas primeiras cartas, intensifica nas últimas
  const factor = index < total * 0.3 ? 0.7 : index > total * 0.7 ? 1.2 : 1;
  ['budget', 'audience', 'satisfaction', 'technology'].forEach(key => {
    if (card.leftChoice.effects[key]) card.leftChoice.effects[key] = Math.round(card.leftChoice.effects[key] * factor);
    if (card.rightChoice.effects[key]) card.rightChoice.effects[key] = Math.round(card.rightChoice.effects[key] * factor);
  });
  return card;
}

// Combos de escolhas: se o jogador faz sequência de escolhas "tecnológicas", ganha bônus
export function checkCombo(history) {
  // Exemplo: 3 escolhas tecnológicas seguidas
  const lastThree = history.slice(-3);
  if (lastThree.every(h => h.type === 'technology')) {
    return { technology: 10 };
  }
  return null;
}

// Oportunidade de recuperação: se algum status < 20, próxima carta tem bônus
export function recoveryBonus(metrics) {
  const bonus = {};
  Object.keys(metrics).forEach(key => {
    if (metrics[key] < 20) bonus[key] = 10;
  });
  return Object.keys(bonus).length ? bonus : null;
}

export const gameCards: GameCard[] = [
  {
    id: 'venue-choice',
    title: 'Escolha do Local',
    description: 'Evento para 500 pessoas. Local A: R$ 8.000, 800 lugares, bairro afastado. Local B: R$ 15.000, 600 lugares, centro.',
    leftChoice: {
      text: 'Local A - R$ 8.000 (afastado)',
      effects: { budget: 20, audience: 5, satisfaction: 3, technology: 2 },
      consequence: 'Economizou R$ 7.000, mas 25% desistiram pela localização. Transporte público limitado.',
      tip: '💡 Dica: Locais centrais reduzem custos de transporte e aumentam presença.',
      category: 'budget', // categoria para tracking
      teachingMoment: 'Uma plataforma de eventos teria mostrado dados de localização e histórico de presença por região.'
    },
    rightChoice: {
      text: 'Local B - R$ 15.000 (centro)',
      effects: { budget: -15, audience: 20, satisfaction: 15, technology: 10 },
      consequence: 'Investimento alto, mas 95% de presença. Localização facilitou parcerias locais.',
      tip: '💡 Dica: Locais centrais facilitam logística e aumentam valor percebido.',
      category: 'strategic', // categoria para tracking  
      teachingMoment: 'Com uma plataforma integrada, você teria acesso a métricas de locais similares e ROI projetado.'
    },
    icon: '🏢',
    educationalContent: 'Localização representa 40% do sucesso. Lugares centrais aumentam presença em 35%.',
    points: { left: 10, right: 25 }
  },
  {
    id: 'pre-event-marketing',
    title: 'Marketing (60 dias)',
    description: 'R$ 5.000 para marketing. Tudo em influenciadores agora ou dividir: R$ 2.000 influenciadores + R$ 3.000 anúncios escalonados?',
    leftChoice: {
      text: 'R$ 5.000 só influenciadores',
      effects: { budget: -15, audience: 12, satisfaction: 8, technology: 5 },
      consequence: 'Buzz inicial forte, mas caiu 70% após 2 semanas. Perdeu timing final.',
      tip: '💡 Dica: Campanhas concentradas geram picos, mas perdem momentum.',
      category: 'improvised',
      teachingMoment: 'Uma plataforma de marketing teria automatizado campanhas escalonadas e retargeting.'
    },
    rightChoice: {
      text: 'R$ 2.000 + R$ 3.000 escalonado',
      effects: { budget: -12, audience: 25, satisfaction: 15, technology: 20 },
      consequence: 'Estratégia sustentada! Buzz inicial + retargeting converteu indecisos.',
      tip: '💡 Dica: Marketing escalonado mantém "top of mind" e otimiza conversões.',
      category: 'organized',
      teachingMoment: 'Plataformas integradas automatizam campanhas escalonadas, otimizando budget e timing.'
    },
    icon: '📈',
    educationalContent: 'Marketing escalonado tem 60% mais vendas nos últimos 15 dias.',
    points: { left: 15, right: 30 }
  },
  {
    id: 'ticketing-dilemma',
    title: 'Precificação',
    description: '400 ingressos. Lotes progressivos: 1º R$ 80, 2º R$ 120, 3º R$ 150. Ou preço único R$ 100?',
    leftChoice: {
      text: 'Lotes R$ 80→120→150',
      effects: { budget: 25, audience: 30, satisfaction: 15, technology: 12 },
      consequence: 'Estratégia de urgência funcionou! Vendas explodiram no 1º lote. Total: R$ 44.000. Público se sentiu recompensado por comprar cedo.',
      tip: '💡 Dica: Lotes progressivos criam urgência de compra e recompensam clientes fiéis.',
      category: 'strategic',
      teachingMoment: 'Plataformas de bilheteria modernas automatizam lotes e disparam notificações de urgência.'
    },
    rightChoice: {
      text: 'Preço único R$ 100',
      effects: { budget: 15, audience: 15, satisfaction: 20, technology: 8 },
      consequence: 'Vendas constantes, boa satisfação. Total: R$ 40.000. Perdeu oportunidade de criar urgência inicial.',
      tip: '💡 Dica: Preços fixos geram confiança, mas reduzem urgência de compra.',
      category: 'simple',
      teachingMoment: 'Ferramentas de precificação dinâmica poderiam ter otimizado o valor automaticamente.'
    },
    icon: '💰',
    educationalContent: 'Lotes aumentam vendas antecipadas em 45% e criam sensação de exclusividade.',
    points: { left: 25, right: 15 }
  },
  {
    id: 'technology-choice',
    title: 'Sistema de Vendas',
    description: 'Escolha sua plataforma de vendas. Sistema básico tradicional que só vende ingressos, ou plataforma completa que inclui criação de evento, marketing e análise de dados?',
    leftChoice: {
      text: 'Sistema básico tradicional',
      effects: { budget: 10, audience: 8, satisfaction: 5, technology: 5 },
      consequence: 'Sistema funcionou, mas você teve que fazer tudo manualmente. Vendas básicas, sem insights de marketing ou facilidades extras.',
      tip: '💡 Dica: Sistemas básicos funcionam, mas limitam seu potencial de crescimento.',
      category: 'basic',
      teachingMoment: 'Perdeu oportunidade de automatizar processos e ter insights valiosos de vendas.'
    },
    rightChoice: {
      text: 'Plataforma completa com marketing',
      effects: { budget: -5, audience: 35, satisfaction: 30, technology: 45 },
      consequence: 'Plataforma auxiliou muito! Criação automática de landing page, campanhas de email e relatórios de vendas. Vendas 60% maiores que o esperado.',
      tip: '💡 Dica: Plataformas completas oferecem ferramentas que potencializam seus resultados.',
      category: 'platform_user',
      teachingMoment: 'Plataformas integradas economizam tempo e multiplicam resultados com automação inteligente.'
    },
    icon: '🎫',
    educationalContent: 'Plataformas completas aumentam vendas em até 60% comparado a sistemas básicos.',
    points: { left: 10, right: 35 } // Aumentei os pontos da escolha estratégica
  },
  {
    id: 'payment-strategy',
    title: 'Estratégia de Pagamento',
    description: 'Pesquisa mostra que 60% do público prefere PIX, 30% cartão e 10% boleto. Você pode: aceitar apenas PIX (economia de 2% em taxas) ou aceitar todos os métodos.',
    leftChoice: {
      text: 'Apenas PIX (economia de 2% em taxas)',
      effects: { budget: 20, audience: 5, satisfaction: 3, technology: 18 },
      consequence: 'Economizou R$ 800 em taxas, mas perdeu 40% das vendas. Público mais velho ficou excluído do processo.',
      tip: '💡 Dica: Economias em taxas podem custar mais em vendas perdidas.',
      category: 'improvised',
      teachingMoment: 'Plataformas de pagamento integradas oferecem múltiplas opções sem complicação técnica.'
    },
    rightChoice: {
      text: 'Todos os métodos (PIX, cartão, boleto)',
      effects: { budget: -8, audience: 40, satisfaction: 35, technology: 30 },
      consequence: 'Vendas aumentaram 35%! Diversidade de pagamento incluiu todos os perfis. Custo extra se pagou com volume.',
      tip: '💡 Dica: Inclusão de métodos de pagamento amplia alcance e aumenta conversões.',
      category: 'inclusive',
      teachingMoment: 'Sistemas modernos integram automaticamente múltiplos gateways, maximizando conversão.'
    },
    icon: '💳',
    educationalContent: 'Eventos que oferecem 3+ métodos de pagamento vendem 35% mais ingressos que os com opção única.',
    points: { left: 10, right: 30 }
  },
  {
    id: 'crisis-management',
    title: 'Gestão de Crise',
    description: 'Faltam 5 dias para o evento. O artista principal cancelou! Você pode: contratar um substituto famoso (R$ 12.000 extra) ou promover o co-headliner + oferecer experiências VIP gratuitas.',
    leftChoice: {
      text: 'Contratar substituto famoso (R$ 12.000)',
      effects: { budget: -30, audience: 25, satisfaction: 15, technology: 5 },
      consequence: 'Público aceitou bem, mas orçamento estourou. Tiveram que cortar outros itens. Evento aconteceu, mas com prejuízo.',
      tip: '💡 Dica: Soluções caras de última hora podem comprometer todo o orçamento.',
      category: 'panic',
      teachingMoment: 'Um sistema de gestão teria alertado sobre riscos de artista único e sugerido planos B.'
    },
    rightChoice: {
      text: 'Promover co-headliner + experiências VIP gratuitas',
      effects: { budget: -8, audience: 15, satisfaction: 35, technology: 25 },
      consequence: 'Transformou crise em oportunidade! Público adorou as experiências VIP. Co-headliner brilhou e ganhou novos fãs.',
      tip: '💡 Dica: Criatividade na crise pode gerar mais valor que soluções caras.',
      category: 'creative',
      teachingMoment: 'Plataformas modernas têm módulos de gestão de crise com soluções pré-configuradas.'
    },
    icon: '🚨',
    educationalContent: 'Produtores experientes sempre têm "Plano B" para artistas principais, reduzindo riscos em 80%.',
    points: { left: 15, right: 30 }
  },
  {
    id: 'data-strategy',
    title: 'Estratégia de Dados',
    description: 'Você pode coletar dados do público via: formulário obrigatório no ingresso (conversão 60%) ou pesquisa opcional pós-evento (conversão 15%) com incentivo R$ 20 desconto no próximo.',
    leftChoice: {
      text: 'Formulário obrigatório na compra',
      effects: { budget: -5, audience: 8, satisfaction: 5, technology: 35 },
      consequence: 'Coletou 240 dados qualificados, mas 16% desistiram da compra. Dados ricos, mas impacto nas vendas.',
      tip: '💡 Dica: Formulários obrigatórios geram dados melhores, mas podem reduzir conversão.',
      category: 'data_focused',
      teachingMoment: 'Sistemas inteligentes coletam dados de forma natural durante a jornada de compra.'
    },
    rightChoice: {
      text: 'Pesquisa opcional + incentivo R$ 20',
      effects: { budget: -12, audience: 20, satisfaction: 30, technology: 25 },
      consequence: 'Apenas 60 respostas, mas todas super qualificadas. Gasto R$ 1.200 em incentivos, mas gerou goodwill positivo.',
      tip: '💡 Dica: Incentivos voluntários geram dados mais honestos e melhor relacionamento.',
      category: 'relationship_focused',
      teachingMoment: 'Plataformas modernas usam gamificação e incentivos automáticos para coleta de dados.'
    },
    icon: '📊',
    educationalContent: 'Dados coletados voluntariamente têm 3x mais precisão que formulários obrigatórios.',
    points: { left: 20, right: 25 }
  },
  {
    id: 'social-media-crisis',
    title: 'Crise nas Redes Sociais',
    description: 'Um influenciador criticou seu evento online (30k visualizações). Você pode: responder publicamente defendendo o evento ou convidar para uma conversa privada + ingresso VIP.',
    leftChoice: {
      text: 'Resposta pública defendendo o evento',
      effects: { budget: -3, audience: 5, satisfaction: 2, technology: 12 },
      consequence: 'Virou debate público! Mais 100k pessoas viram a polêmica. Alguns apoiaram, mas imagem ficou associada ao conflito.',
      tip: '💡 Dica: Respostas públicas podem amplificar crises ao invés de resolvê-las.',
      category: 'reactive',
      teachingMoment: 'Ferramentas de monitoramento de redes sociais alertam sobre crises antes que virem problemas.'
    },
    rightChoice: {
      text: 'Conversa privada + ingresso VIP',
      effects: { budget: -8, audience: 30, satisfaction: 25, technology: 20 },
      consequence: 'Influenciador virou embaixador! Postou story positivo (50k visualizações) elogiando o atendimento. Crise virou oportunidade.',
      tip: '💡 Dica: Diálogo privado transforma críticos em embaixadores.',
      category: 'proactive',
      teachingMoment: 'Sistemas de CRM integrados facilitam gestão personalizada de relacionamentos.'
    },
    icon: '📱',
    educationalContent: '90% das crises nas redes sociais podem ser resolvidas com diálogo direto, evitando exposição pública.',
    points: { left: 5, right: 30 }
  },
  {
    id: 'partnership-dilemma',
    title: 'Dilema de Parcerias',
    description: 'Uma marca quer patrocinar R$ 10.000, mas exige exclusividade da categoria e 3 posts no Instagram do evento. Você já tem interesse de 2 marcas menores (R$ 3.000 cada) da mesma categoria.',
    leftChoice: {
      text: 'Aceitar patrocínio exclusivo R$ 10.000',
      effects: { budget: 35, audience: 12, satisfaction: 8, technology: 5 },
      consequence: 'Mais dinheiro, mas marca gigante "engoliu" a identidade do evento. Público reclamou do excesso de branding.',
      tip: '💡 Dica: Patrocínios grandes podem comprometer a autenticidade do evento.',
      category: 'money_focused',
      teachingMoment: 'Plataformas de gestão de patrocínio ajudam a equilibrar valor financeiro e identidade do evento.'
    },
    rightChoice: {
      text: 'Duas marcas menores (R$ 6.000 total)',
      effects: { budget: 22, audience: 18, satisfaction: 25, technology: 15 },
      consequence: 'Menos dinheiro, mas parcerias mais equilibradas. Marcas menores se engajaram mais e público aprovou a diversidade.',
      tip: '💡 Dica: Múltiplas parcerias podem gerar mais valor agregado que uma grande.',
      category: 'balanced',
      teachingMoment: 'Sistemas de gestão facilitam coordenação de múltiplos patrocinadores e suas ativações.'
    },
    icon: '🤝',
    educationalContent: 'Eventos com 3-5 patrocinadores têm 40% mais engajamento que os com patrocínio único.',
    points: { left: 20, right: 25 }
  },
  {
    id: 'final-decision',
    title: 'Pós-Evento: Próximos Passos',
    description: 'Seu evento foi um sucesso! Agora você pode: coletar feedback detalhado dos participantes para melhorar o próximo evento, ou já começar a planejar e divulgar o próximo evento para aproveitar o momentum.',
    leftChoice: {
      text: 'Coletar feedback e analisar dados',
      effects: { budget: -5, audience: 25, satisfaction: 40, technology: 35 },
      consequence: 'Análise revelou insights valiosos! Descobriu pontos de melhoria que aumentarão satisfação em 40% no próximo evento. Base sólida para crescimento.',
      tip: '💡 Dica: Dados do evento anterior são o segredo para eventos cada vez melhores.',
      category: 'data_driven',
      teachingMoment: 'Plataformas integradas automatizam coleta de feedback e geram relatórios de insights.'
    },
    rightChoice: {
      text: 'Já iniciar planejamento do próximo evento',
      effects: { budget: 18, audience: 35, satisfaction: 12, technology: 8 },
      consequence: 'Momentum aproveitado, vendas antecipadas boas! Porém, repetiu alguns erros do evento anterior que poderiam ter sido evitados.',
      tip: '💡 Dica: Pressa pode fazer você repetir erros que dados mostrariam como evitar.',
      category: 'momentum_focused',
      teachingMoment: 'Ferramentas de gestão permitem aproveitar momentum E coletar insights simultaneamente.'
    },
    icon: '📊',
    educationalContent: 'Produtores que analisam dados entre eventos têm 70% mais chances de criar eventos de referência.',
    points: { left: 35, right: 20 }
  }
];

// Eventos aleatórios que podem acontecer durante o jogo
export const randomEvents = [
  {
    id: 'weather-crisis',
    title: 'Crise Climática',
    description: 'Previsão de chuva forte no dia do evento!',
    effects: { budget: -15, satisfaction: -10 },
    message: 'Chuva inesperada! Custos extras com cobertura e alguns convidados não vieram.'
  },
  {
    id: 'viral-moment',
    title: 'Momento Viral',
    description: 'Seu evento viralizou no TikTok!',
    effects: { audience: 30, satisfaction: 20 },
    message: 'Um tiktoker famoso postou sobre seu evento! Alcance orgânico explodiu.'
  },
  {
    id: 'technical-issue',
    title: 'Problema Técnico',
    description: 'Falha no sistema de som durante 15 minutos',
    effects: { budget: -12, satisfaction: -15, technology: -10 },
    message: 'Som falhou no meio do show. Equipe técnica resolveu, mas afetou a experiência.'
  },
  {
    id: 'celebrity-surprise',
    title: 'Surpresa Especial',
    description: 'Um artista famoso apareceu de surpresa!',
    effects: { audience: 35, satisfaction: 30 },
    message: 'Uma celebridade apareceu de surpresa! Público ficou eufórico e experiência foi única.'
  },
  {
    id: 'sponsor-bonus',
    title: 'Patrocínio Extra',
    description: 'Um patrocinador decidiu dobrar o investimento!',
    effects: { budget: 25, technology: 15 },
    message: 'Patrocinador ficou tão satisfeito que dobrou o investimento! Recursos extras na conta.'
  }
];

export const INITIAL_METRICS = {
  budget: 100,
  audience: 0,
  satisfaction: 0,
  technology: 0
};

export const GAME_BADGES = {
  PLATFORM_ADOPTER: {
    name: 'Nativo Digital',
    description: 'Reconheceu o valor de usar plataformas completas',
    icon: '🚀',
    image: 'badge-digital-native.png',
    requirement: 'platform_choices >= 3',
    educationalMessage: 'Você entendeu que plataformas integradas multiplicam resultados! Continue investindo em ferramentas que automatizam seu trabalho.'
  },
  STRATEGIC_MIND: {
    name: 'Mente Estratégica',
    description: 'Priorizou decisões estratégicas ao invés de soluções improvisadas',
    icon: '🧠',
    image: 'badge-strategic-mind.png',
    requirement: 'strategic_choices >= 4',
    educationalMessage: 'Sua visão estratégica se destacou! Produtores organizados criam eventos mais lucrativos e sustentáveis.'
  },
  DATA_MASTER: {
    name: 'Mestre da Tecnologia',
    description: 'Valorizou coleta e análise de dados',
    icon: '📊',
    image: 'badge-tech-master.png',
    requirement: 'data_choices >= 2',
    educationalMessage: 'Dados são o combustível do sucesso! Continue usando analytics para otimizar cada evento.'
  },
  RELATIONSHIP_BUILDER: {
    name: 'Agrada Multidões',
    description: 'Priorizou relacionamentos duradouros',
    icon: '🤝',
    image: 'badge-crowd-pleaser.png',
    requirement: 'relationship_choices >= 3',
    educationalMessage: 'Relacionamentos sólidos são a base do sucesso! Ferramentas de CRM ajudam a escalar essa habilidade.'
  },
  PROBLEM_SOLVER: {
    name: 'Gestor de Crises',
    description: 'Transformou crises em oportunidades',
    icon: '💡',
    image: 'badge-crisis-manager.png',
    requirement: 'creative_choices >= 2',
    educationalMessage: 'Sua criatividade impressiona! Sistemas de gestão dão mais tempo para focar na criatividade.'
  },
  TECH_ENTHUSIAST: {
    name: 'Arriscado Estratégico',
    description: 'Abraçou soluções tecnológicas ousadas',
    icon: '💻',
    image: 'badge-risk-taker.png',
    requirement: 'technology >= 80',
    educationalMessage: 'Tecnologia é sua aliada! Continue explorando ferramentas que automatizam processos manuais.'
  },
  BUDGET_CONSCIOUS: {
    name: 'Mago do Orçamento',
    description: 'Manteve equilíbrio financeiro',
    icon: '💰',
    image: 'badge-budget-wizard.png',
    requirement: 'budget >= 80',
    educationalMessage: 'Controle financeiro é essencial! Plataformas com dashboard financeiro facilitam essa gestão.'
  },
  PEOPLE_PERSON: {
    name: 'Produtor Inteligente',
    description: 'Focou na experiência e satisfação do público',
    icon: '👥',
    image: 'badge-satisfaction-guru.png',
    requirement: 'satisfaction >= 80',
    educationalMessage: 'Foco no público é fundamental! Ferramentas de feedback automatizado ajudam a manter essa conexão.'
  }
};