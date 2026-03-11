/**
 * Rits Integration Service
 * 
 * Integração com Rits Pay para checkout recorrente e assinaturas.
 * O checkout será feito via sidebar Rits (R-Tag) no lado direito da tela.
 * 
 * Links importantes:
 * - Site: https://ritspay.com/
 * - API: https://app.swaggerhub.com/apis-docs/jucianoaraujo/rits-pay-api/1.0.0
 * 
 * NOTAS IMPORTANTES:
 * - Rits processa a recorrência, pagamento via Pagar.me ou outro gateway
 * - Checkout transparente com sidebar personalizável
 * - R-Dash para gestão de assinaturas
 * - Área do assinante para autogestão
 */

// ==================== CONFIGURAÇÃO DE ENTREGAS ====================

/**
 * Configurações de entrega por tipo de produto
 * Estas configurações serão sincronizadas com o Rits
 */
export const deliveryConfig = {
    // Assinaturas (Planos A, B, C recorrentes)
    subscription: {
        // Entregas somente para Rio de Janeiro
        zones: ['RJ'],
        // Dias de entrega disponíveis
        deliveryDays: ['quarta', 'quinta'],
        // Turnos disponíveis
        deliveryShifts: ['manhã', 'tarde'],
        // Prazo de processamento antes da entrega
        processingDays: 3,
    },

    // À La Carte (Planos D, E)
    alacarte: {
        zones: ['RJ'],
        // Entrega em até 48h úteis
        deliveryTimeHours: 48,
        deliveryDays: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
    },

    // Além da Mesa (E-commerce)
    merchandise: {
        // Futuro: todo Brasil
        zones: ['RJ'], // Por enquanto apenas RJ
        // TODO: Expandir para todo Brasil
        futureZones: ['SP', 'MG', 'ES', 'Brasil'],
        // Prazo de entrega
        deliveryTimeWorkingDays: 5,
    },
}

// ==================== TIPOS ====================

export interface CustomerData {
    name: string
    email: string
    phone: string
    cep: string
    cpf?: string
    address?: {
        street: string
        number: string
        complement?: string
        neighborhood: string
        city: string
        state: string
    }
}

export interface DeliveryPreferences {
    // Para assinaturas
    preferredDay?: 'quarta' | 'quinta'
    preferredShift?: 'manhã' | 'tarde'
    // Observações de entrega
    instructions?: string
}

export interface OrderItem {
    productId: string
    name: string
    quantity: number
    unitPrice: number
}

export interface SubscriptionPayload {
    customer: CustomerData
    delivery: DeliveryPreferences
    plan: {
        id: string
        name: string
        type: 'assinatura' | 'alacarte'
        flowType: 'A' | 'B' | 'C' | 'D' | 'E'
    }
    configuration: {
        persons?: number
        mealsPerWeek?: number
        frequency?: 'semanal' | 'quinzenal' | 'mensal'
        quantity?: number
        restriction?: string | null
    }
    items?: OrderItem[]
    total: number
    // Frequência de cobrança e entrega
    billing: {
        interval: 'weekly' | 'biweekly' | 'monthly'
        dayOfMonth?: number
    }
}

export interface OneTimeOrderPayload {
    customer: CustomerData
    items: OrderItem[]
    total: number
    shippingAddress?: CustomerData['address']
    deliveryInstructions?: string
}

export interface RitsResponse {
    success: boolean
    orderId?: string
    subscriptionId?: string
    error?: string
    checkoutUrl?: string
    // URL do checkout Rits (sidebar)
    widgetToken?: string
}

// ==================== CONFIGURAÇÃO ====================

const RITS_API_URL = process.env.NEXT_PUBLIC_RITS_API_URL || 'https://api.ritspay.com/v1'
const RITS_API_KEY = process.env.RITS_API_KEY || ''
const RITS_WIDGET_ID = process.env.NEXT_PUBLIC_RITS_WIDGET_ID || ''

// ==================== R-TAG (CHECKOUT WIDGET) ====================

/**
 * Inicializa o widget de checkout Rits (sidebar)
 * O widget aparecerá na lateral direita da tela
 */
export function initRitsWidget() {
    if (typeof window === 'undefined') return

    // TODO: Implementar quando credenciais disponíveis
    // A R-Tag é um script que integra o checkout ao site
    // Referência: https://ritspay.com/ (seção R-Tag)

    console.log('[Rits] Widget initialization placeholder')
    console.log('[Rits] Widget ID:', RITS_WIDGET_ID)
}

/**
 * Abre o checkout Rits em sidebar
 * @param payload Dados do pedido/assinatura
 */
export function openRitsCheckout(payload: SubscriptionPayload | OneTimeOrderPayload) {
    // TODO: Implementar quando credenciais disponíveis
    // O checkout Rits abre uma sidebar na direita da tela

    console.log('[Rits] Opening checkout sidebar with:', payload)

    if (!RITS_API_KEY) {
        console.warn('[Rits] API Key não configurada')
        return null
    }

    // Placeholder para integração
    // window.RitsWidget.open(payload)
    return null
}

// ==================== API FUNCTIONS ====================

/**
 * Verifica se o CEP está na zona de entrega
 */
export async function checkDeliveryAvailability(cep: string, productType: 'subscription' | 'alacarte' | 'merchandise') {
    const config = deliveryConfig[productType]
    const address = await fetchAddressByCep(cep)

    if (!address) {
        return { available: false, reason: 'CEP não encontrado' }
    }

    const isAvailable = config.zones.includes(address.state)

    return {
        available: isAvailable,
        reason: isAvailable ? null : `Entrega não disponível para ${address.state}`,
        address,
        deliveryInfo: isAvailable ? config : null,
    }
}

/**
 * Cria uma nova assinatura via Rits
 * 
 * TODO: Implementar quando credenciais disponíveis
 */
export async function createSubscription(payload: SubscriptionPayload): Promise<RitsResponse> {
    console.log('[Rits] createSubscription called with:', payload)

    if (!RITS_API_KEY) {
        console.warn('[Rits] API Key não configurada - checkout desabilitado')
        return { success: false, error: 'Integração Rits pendente' }
    }

    try {
        const response = await fetch(`${RITS_API_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RITS_API_KEY}`,
            },
            body: JSON.stringify(payload),
        })

        return await response.json()
    } catch (error) {
        console.error('[Rits] Error creating subscription:', error)
        return { success: false, error: 'Erro ao criar assinatura' }
    }
}

/**
 * Cria um pedido único (à la carte) via Rits
 * 
 * TODO: Implementar quando credenciais disponíveis
 */
export async function createOrder(payload: OneTimeOrderPayload): Promise<RitsResponse> {
    console.log('[Rits] createOrder called with:', payload)

    if (!RITS_API_KEY) {
        console.warn('[Rits] API Key não configurada - checkout desabilitado')
        return { success: false, error: 'Integração Rits pendente' }
    }

    try {
        const response = await fetch(`${RITS_API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RITS_API_KEY}`,
            },
            body: JSON.stringify(payload),
        })

        return await response.json()
    } catch (error) {
        console.error('[Rits] Error creating order:', error)
        return { success: false, error: 'Erro ao criar pedido' }
    }
}

// ==================== UTILITIES ====================

/**
 * Busca endereço pelo CEP (Via CEP)
 */
export async function fetchAddressByCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, '')

    if (cleanCep.length !== 8) {
        return null
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()

        if (data.erro) {
            return null
        }

        return {
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
        }
    } catch {
        return null
    }
}

/**
 * Formata os dias de entrega disponíveis para exibição
 */
export function getDeliveryOptionsText(productType: 'subscription' | 'alacarte' | 'merchandise') {
    if (productType === 'subscription') {
        const config = deliveryConfig.subscription
        return `Entregas às ${config.deliveryDays.join(' e ')} (${config.deliveryShifts.join(' ou ')})`
    }

    if (productType === 'alacarte') {
        const config = deliveryConfig.alacarte
        return `Entrega em até ${config.deliveryTimeHours}h úteis`
    }

    const config = deliveryConfig.merchandise
    return `Entrega em até ${config.deliveryTimeWorkingDays} dias úteis`
}
