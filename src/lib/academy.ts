import { HOTMART_COURSE_URL } from '../constants'

// Fase do curso: 'coming-soon' mostra teaser + lista VIP; 'available' revela o
// curso e manda pra Hotmart. Trocar o status (e preencher title/description/
// benefit/hotmartUrl) é tudo que a dona precisa fazer no lançamento.
export type CourseStatus = 'coming-soon' | 'available'

export type Course = {
  id: string
  index: string // rótulo visual: '01', '02', '03'
  kicker: string
  image: string | null
  status: CourseStatus
  // teaser (status coming-soon)
  teaserReveal: string
  // revelados no lançamento (status available)
  title?: string
  description?: string
  benefit?: string
  hotmartUrl?: string // sobrescreve HOTMART_COURSE_URL para este curso
}

export const ACADEMY_COURSES: Course[] = [
  {
    id: 'lancamento-1',
    index: '01',
    kicker: 'Primeiro lançamento',
    image: '/images/works/AUTORAL%201.webp',
    status: 'coming-soon',
    teaserReveal: 'Revelação em breve',
  },
  {
    id: 'capitulo-2',
    index: '02',
    kicker: 'Próximo capítulo',
    image: '/images/works/GOTICO%201.webp',
    status: 'coming-soon',
    teaserReveal: 'Em breve',
  },
  {
    id: 'academy',
    index: '03',
    kicker: 'Rockstar Academy',
    image: null,
    status: 'coming-soon',
    teaserReveal: 'Novos conteúdos sendo preparados',
  },
]

// URL de checkout de um curso (a própria, ou o fallback global da Hotmart).
export function courseCheckoutUrl(course: Course) {
  return course.hotmartUrl || HOTMART_COURSE_URL
}

// A Academia entra em modo "lançada" quando pelo menos um curso está disponível.
export const ACADEMY_LAUNCHED = ACADEMY_COURSES.some(
  (course) => course.status === 'available',
)

export function primaryCheckoutUrl() {
  const available = ACADEMY_COURSES.find((c) => c.status === 'available')
  return (available && courseCheckoutUrl(available)) || HOTMART_COURSE_URL
}
