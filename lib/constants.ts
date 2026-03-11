// Design Tokens - Ocyá em Casa
// Baseado no Manual de Marca Ocyá (ocya-guia-rapido-v1.pdf)

export const colors = {
  azul: '#2C3275',
  azulClaro: '#4A5390',
  azulEscuro: '#1d2667',
  offwhite: '#F5F5F5',
  areia: '#FBE4C5',
  branco: '#FFFFFF',
  cinza: '#6B7280',
  cinzaClaro: '#E5E7EB',
} as const

export const fonts = {
  display: 'IvyJournal, serif',
  body: 'Kumbh Sans, sans-serif',
} as const

// Configurações de navegação
export const navigation = {
  header: [
    { label: 'Planos', href: '#planos', type: 'anchor' },
    { label: 'Benefícios', href: '#beneficios', type: 'anchor' },
    { label: 'Os Restaurantes', href: 'https://ocya.com.br', type: 'external' },
    { label: 'Além da Mesa', href: '#', type: 'disabled' },
    { label: 'Dúvidas', href: '#faq', type: 'anchor' },
  ],
} as const

// Contatos
export const contacts = {
  phone: '(21) 97286-1250',
  phoneLink: 'tel:+5521972861250',
  whatsapp: 'https://api.whatsapp.com/send?phone=5521972861250',
  email: 'contato@ocya.com.br',
  website: 'https://ocyaemcasa.com.br',
  restaurant: 'https://ocya.com.br',
} as const

// SEO
export const siteConfig = {
  name: 'Ocyá em Casa',
  description: 'Receba frutos do mar frescos e preparados em casa. Assinatura de pescados do Grupo Ocyá.',
  tagline: 'O mar que nos alimenta',
  url: 'https://ocyaemcasa.com.br',
  ogImage: '/og-image.jpg',
} as const
