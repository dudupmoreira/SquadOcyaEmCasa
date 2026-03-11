// Dados dos Planos e Produtos - Ocyá em Casa 2.0

export interface Plan {
    id: string
    slug: string
    name: string
    description: string
    price: number | null // null = preço a definir
    priceLabel: string
    recommendation: string
    type: 'assinatura' | 'alacarte'
    flowType: 'A' | 'B' | 'C' | 'D' | 'E'
    image: string
    features: string[]
    kitItems?: { name: string; qty: number; unit: string }[] // Composição do kit
}

export interface Product {
    id: string
    name: string
    category: 'peixes' | 'frutos-do-mar' | 'conservas' | 'prontos'
    price: number
    unit: string
    description: string
    image: string
}

export interface MerchandiseProduct {
    id: string
    name: string
    category: 'vestuario' | 'acessorios' | 'cozinha' | 'conservas-avulsas'
    price: number
    description: string
    image: string
}

// Grupo: ASSINATURA
export const subscriptionPlans: Plan[] = [
    {
        id: 'selecao-do-mar',
        slug: 'selecao-do-mar',
        name: 'Seleção do Mar',
        description: 'Uma seleção diversa do que o mar tem de melhor. Peixes e frutos do mar escolhidos conforme a safra, trazendo variedade, surpresa e qualidade para a mesa ao longo do tempo.',
        price: 340,
        priceLabel: 'R$ 340,00',
        recommendation: 'Para 2 pessoas',
        type: 'assinatura',
        flowType: 'A',
        image: '/images/food/clubeocya07.jpg',
        features: [
            '2 opções pré-prontas para compartilhar',
            '2 filés de peixe maturados e temperados',
            '1 opção pronta para consumo',
            '1 entradinha variada pré-pronta',
            '1 surpresa',
        ],
    },
    {
        id: 'peixe-essencial',
        slug: 'peixe-essencial',
        name: 'Peixe Essencial',
        description: 'Peixe fresco, já limpo e temperado, pensado para o dia a dia. Um plano para quem quer comer bem com praticidade, respeitando o ingrediente e o tempo de casa. Entregas recorrentes, sem complicação.',
        price: 189, // PLACEHOLDER
        priceLabel: 'A partir de R$ 189,00',
        recommendation: 'Para 2 pessoas',
        type: 'assinatura',
        flowType: 'B',
        image: '/images/food/clubeocya06.jpg',
        features: [
            'Peixe fresco limpo e temperado',
            'Quantidade personalizável',
            'Frequência flexível',
            'Ideal para o dia a dia',
        ],
    },
    {
        id: 'monte-o-seu-assinatura',
        slug: 'monte-o-seu-assinatura',
        name: 'Monte o Seu',
        description: 'Plano de assinatura do seu jeitinho. Selecione itens, quantidades e frequência de envio para incluir o mar na sua rotina alimentar, sem complicações. Variedade, sabor, nutrição e muita conveniência para você.',
        price: null, // Varia conforme seleção
        priceLabel: 'Preço variável',
        recommendation: 'Personalizável',
        type: 'assinatura',
        flowType: 'C',
        image: '/images/food/pratos-2.webp',
        features: [
            'Personalização total',
            'Escolha seus itens favoritos',
            'Frequência flexível',
            'Cancele quando quiser',
        ],
    },
]

// Grupo: À LA CARTE
export const alaCartePlans: Plan[] = [
    {
        id: 'churrasco',
        slug: 'churrasco',
        name: 'Churrasco',
        description: 'Um kit com cortes de peixe e frutos do mar ideal para grelhar, pensado para churrascos, encontros e refeições sem pressa.',
        price: 249, // PLACEHOLDER
        priceLabel: 'R$ 249,00',
        recommendation: 'Para 2 pessoas',
        type: 'alacarte',
        flowType: 'D',
        image: '/images/food/pratos-1.webp',
        features: [
            'Cortes ideais para grelhar',
            'Perfeito para encontros',
            'Entrega em 48h',
        ],
        kitItems: [
            { name: 'Espetos de Peixe Temperado', qty: 4, unit: 'un' },
            { name: 'Filé de Robalo para Grelha', qty: 500, unit: 'g' },
            { name: 'Camarão Rosa Grande', qty: 400, unit: 'g' },
            { name: 'Lula em Anéis Temperada', qty: 300, unit: 'g' },
        ],
    },
    {
        id: 'reserva-do-mar',
        slug: 'reserva-do-mar',
        name: 'Reserva do Mar',
        description: 'Quatro conservas Ocyá, cada uma com seu papel e personalidade. Uma curadoria pronta para transformar refeições simples, compor pratos ou estar sempre à mão na despensa.',
        price: 119,
        priceLabel: 'R$ 119,00',
        recommendation: 'Para 2 pessoas',
        type: 'alacarte',
        flowType: 'E',
        image: '/images/food/clubeocya06.jpg',
        features: [
            '4 conservas artesanais',
            'Curadoria especial',
            'Ideal para despensa',
            'Entrega em 48h',
        ],
        kitItems: [
            { name: 'Conserva de Atum em Azeite', qty: 1, unit: 'un' },
            { name: 'Conserva de Sardinha Defumada', qty: 1, unit: 'un' },
            { name: 'Conserva de Polvo com Páprica', qty: 1, unit: 'un' },
            { name: 'Conserva de Anchova com Ervas', qty: 1, unit: 'un' },
        ],
    },
    {
        id: 'monte-o-seu-alacarte',
        slug: 'monte-o-seu-alacarte',
        name: 'Monte o Seu',
        description: 'Selecione itens, quantidades para incluir o mar na sua rotina alimentar, sem complicações. Variedade, sabor, nutrição e muita conveniência para você.',
        price: null, // Varia conforme seleção
        priceLabel: 'Preço variável',
        recommendation: 'Personalizável',
        type: 'alacarte',
        flowType: 'C',
        image: '/images/food/pratos-3.webp',
        features: [
            'Sem compromisso',
            'Escolha seus itens',
            'Entrega em 48h',
        ],
    },
]

export const allPlans = [...subscriptionPlans, ...alaCartePlans]

export function getPlanBySlug(slug: string): Plan | undefined {
    return allPlans.find(plan => plan.slug === slug)
}

// Produtos para E-commerce "Monte o Seu" - PLACEHOLDER
export const products: Product[] = [
    // Peixes
    { id: 'salmao', name: 'Filé de Salmão', category: 'peixes', price: 89, unit: '500g', description: 'Salmão fresco em filés', image: '/images/products/salmao.jpg' },
    { id: 'robalo', name: 'Filé de Robalo', category: 'peixes', price: 79, unit: '400g', description: 'Robalo selvagem em filés', image: '/images/products/robalo.jpg' },
    { id: 'atum', name: 'Filé de Atum', category: 'peixes', price: 99, unit: '400g', description: 'Atum fresco para tataki ou grelhar', image: '/images/products/atum.jpg' },
    { id: 'pescada', name: 'Filé de Pescada', category: 'peixes', price: 59, unit: '500g', description: 'Pescada branca em filés', image: '/images/products/pescada.jpg' },
    { id: 'linguado', name: 'Filé de Linguado', category: 'peixes', price: 89, unit: '400g', description: 'Linguado delicado em filés', image: '/images/products/linguado.jpg' },

    // Frutos do Mar
    { id: 'camarao', name: 'Camarão Rosa', category: 'frutos-do-mar', price: 75, unit: '500g', description: 'Camarão rosa limpo e descascado', image: '/images/products/camarao.jpg' },
    { id: 'lula', name: 'Anéis de Lula', category: 'frutos-do-mar', price: 65, unit: '400g', description: 'Lula em anéis pronta para preparar', image: '/images/products/lula.jpg' },
    { id: 'polvo', name: 'Polvo Cozido', category: 'frutos-do-mar', price: 129, unit: '500g', description: 'Polvo pré-cozido, pronto para finalizar', image: '/images/products/polvo.jpg' },
    { id: 'mexilhao', name: 'Mexilhão', category: 'frutos-do-mar', price: 49, unit: '500g', description: 'Mexilhões frescos na concha', image: '/images/products/mexilhao.jpg' },
    { id: 'vieira', name: 'Vieiras', category: 'frutos-do-mar', price: 99, unit: '6 unidades', description: 'Vieiras frescas para sear', image: '/images/products/vieira.jpg' },

    // Conservas
    { id: 'conserva-atum', name: 'Conserva de Atum', category: 'conservas', price: 35, unit: '200g', description: 'Atum em conserva artesanal', image: '/images/products/conserva-atum.jpg' },
    { id: 'conserva-sardinha', name: 'Conserva de Sardinha', category: 'conservas', price: 29, unit: '150g', description: 'Sardinhas em azeite especial', image: '/images/products/conserva-sardinha.jpg' },
    { id: 'conserva-polvo', name: 'Conserva de Polvo', category: 'conservas', price: 45, unit: '200g', description: 'Polvo em conserva com páprica', image: '/images/products/conserva-polvo.jpg' },

    // Prontos para Consumo
    { id: 'bolinho-bacalhau', name: 'Bolinho de Bacalhau', category: 'prontos', price: 39, unit: '12 unidades', description: 'Bolinhos prontos para fritar', image: '/images/products/bolinho.jpg' },
    { id: 'ceviche-pronto', name: 'Kit Ceviche', category: 'prontos', price: 59, unit: '2 porções', description: 'Peixe marinado pronto para servir', image: '/images/products/ceviche.jpg' },
    { id: 'risoto-frutos-mar', name: 'Kit Risoto', category: 'prontos', price: 69, unit: '2 porções', description: 'Risoto de frutos do mar semi-pronto', image: '/images/products/risoto.jpg' },
]

// Produtos Merchandising "Além da Mesa" - PLACEHOLDER
export const merchandiseProducts: MerchandiseProduct[] = [
    // Vestuário
    { id: 'camiseta-ocya-branca', name: 'Camiseta Ocyá Branca', category: 'vestuario', price: 89, description: 'Camiseta 100% algodão com logo Ocyá', image: '/images/merch/camiseta-branca.jpg' },
    { id: 'camiseta-ocya-azul', name: 'Camiseta Ocyá Azul', category: 'vestuario', price: 89, description: 'Camiseta 100% algodão cor azul mar', image: '/images/merch/camiseta-azul.jpg' },
    { id: 'bone-ocya', name: 'Boné Ocyá', category: 'vestuario', price: 69, description: 'Boné trucker com logo bordado', image: '/images/merch/bone.jpg' },
    { id: 'avental-ocya', name: 'Avental Ocyá', category: 'vestuario', price: 79, description: 'Avental de cozinha em linho', image: '/images/merch/avental.jpg' },

    // Acessórios
    { id: 'ecobag-ocya', name: 'Ecobag Ocyá', category: 'acessorios', price: 49, description: 'Sacola reutilizável 100% algodão', image: '/images/merch/ecobag.jpg' },
    { id: 'caneca-ocya', name: 'Caneca Ocyá', category: 'acessorios', price: 59, description: 'Caneca de porcelana 350ml', image: '/images/merch/caneca.jpg' },
    { id: 'garrafa-termica', name: 'Garrafa Térmica Ocyá', category: 'acessorios', price: 99, description: 'Garrafa térmica 500ml aço inox', image: '/images/merch/garrafa.jpg' },

    // Cozinha
    { id: 'tabua-corte', name: 'Tábua de Corte Ocyá', category: 'cozinha', price: 129, description: 'Tábua de bambu com gravação', image: '/images/merch/tabua.jpg' },
    { id: 'kit-facas', name: 'Kit Facas Ocyá', category: 'cozinha', price: 249, description: 'Kit com 3 facas para pescados', image: '/images/merch/facas.jpg' },
    { id: 'luva-termica', name: 'Luva Térmica Ocyá', category: 'cozinha', price: 49, description: 'Luva térmica para forno', image: '/images/merch/luva.jpg' },

    // Conservas Avulsas
    { id: 'conserva-atum-premium', name: 'Conserva Atum Premium', category: 'conservas-avulsas', price: 45, description: 'Atum em azeite extra virgem', image: '/images/merch/conserva-atum.jpg' },
    { id: 'conserva-bacalhau', name: 'Conserva de Bacalhau', category: 'conservas-avulsas', price: 55, description: 'Bacalhau desfiado em azeite', image: '/images/merch/conserva-bacalhau.jpg' },
    { id: 'conserva-anchova', name: 'Conserva de Anchova', category: 'conservas-avulsas', price: 39, description: 'Anchovas em azeite com ervas', image: '/images/merch/conserva-anchova.jpg' },
    { id: 'conserva-lula', name: 'Conserva de Lula', category: 'conservas-avulsas', price: 49, description: 'Lula em molho mediterrâneo', image: '/images/merch/conserva-lula.jpg' },
]

// Helpers para filtrar produtos
export function getProductsByCategory(category: Product['category']): Product[] {
    return products.filter(p => p.category === category)
}

export function getMerchandiseByCategory(category: MerchandiseProduct['category']): MerchandiseProduct[] {
    return merchandiseProducts.filter(p => p.category === category)
}

// Tabela de preços por pessoas (placeholder) - SELEÇÃO DO MAR
export const priceTable = {
    'selecao-do-mar': {
        1: 220,
        2: 340,
        3: 450,
        4: 560,
        5: 660,
        6: 750,
    },
    'peixe-essencial': {
        // base: pessoas × refeições × 45 (placeholder)
        basePerMealPerPerson: 45,
    },
    'churrasco': {
        1: 249,
        2: 450,
        3: 620,
    },
    'reserva-do-mar': {
        1: 119,
        2: 220,
        3: 310,
    },
}
