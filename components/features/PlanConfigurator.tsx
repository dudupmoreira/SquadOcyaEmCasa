'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Minus, Plus, Users, Calendar, CalendarDays, Package, ShoppingCart, Truck, Copy, Sun, Moon, MapPin, Loader2, CheckCircle2, AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { type Plan, products, getProductsByCategory, priceTable } from '@/lib/plans'
import { contacts } from '@/lib/constants'

interface PlanConfiguratorProps {
    plan: Plan
}

type Step = 'restrictions' | 'persons' | 'meals' | 'config' | 'frequency' | 'quantity' | 'purchase-type' | 'ecommerce' | 'delivery-preference' | 'delivery-date' | 'customer-data' | 'summary'

const restrictions = [
    { id: 'polvo', name: 'Polvo', emoji: '🐙' },
    { id: 'lula', name: 'Lula', emoji: '🦑' },
    { id: 'camarao', name: 'Camarão', emoji: '🦐' },
    { id: 'mexilhao', name: 'Mexilhão', emoji: '🦪' },
]

const frequencies = [
    { id: 'semanal', name: 'Semanal', description: '4 entregas/mês', deliveries: 4 },
    { id: 'quinzenal', name: 'Quinzenal', description: '2 entregas/mês', deliveries: 2 },
    { id: 'mensal', name: 'Mensal', description: '1 entrega/mês', deliveries: 1 },
]

export function PlanConfigurator({ plan }: PlanConfiguratorProps) {
    const [currentStep, setCurrentStep] = useState<Step>(getInitialStep(plan.flowType))

    // State for all flows
    const [selectedRestriction, setSelectedRestriction] = useState<string | null>(null)
    const [persons, setPersons] = useState(2)
    const [mealsPerWeek, setMealsPerWeek] = useState(1)
    const [frequency, setFrequency] = useState('quinzenal')
    const [quantity, setQuantity] = useState(1)
    const [purchaseType, setPurchaseType] = useState<'alacarte' | 'assinatura'>('alacarte')
    const [cart, setCart] = useState<Record<string, number>>({})
    const [direction, setDirection] = useState<1 | -1>(1)
    const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '', cep: '', city: '', state: '' })
    // Delivery preferences (subscription)
    const [deliveryDay, setDeliveryDay] = useState<'quarta' | 'quinta'>('quarta')
    const [deliveryShift, setDeliveryShift] = useState<'manhã' | 'tarde'>('manhã')
    // Delivery date (à la carte)
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null)
    
    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const isSubscription = plan.type === 'assinatura'
    const flowType = plan.flowType

    // Get steps based on flow type
    function getInitialStep(flow: Plan['flowType']): Step {
        switch (flow) {
            case 'A': return 'restrictions'
            case 'B': return 'frequency'
            case 'C': 
                if (plan.type === 'assinatura') return 'frequency'
                return 'purchase-type'
            case 'D':
            case 'E': return 'purchase-type'
            default: return 'customer-data'
        }
    }

    const getSteps = (): Step[] => {
        switch (flowType) {
            case 'A': // Seleção do Mar: Restrições → Frequência → Pessoas → Entrega → Dados → Resumo
                return ['restrictions', 'frequency', 'persons', 'delivery-preference', 'customer-data', 'summary']
            case 'B': // Peixe Essencial: Frequência → Pessoas → Refeições → Entrega → Dados → Resumo
                return ['frequency', 'persons', 'meals', 'delivery-preference', 'customer-data', 'summary']
            case 'C': // Monte o Seu
                if (plan.type === 'assinatura') {
                    return ['frequency', 'ecommerce', 'delivery-preference', 'customer-data', 'summary']
                } else {
                    return ['purchase-type', 'ecommerce', 'delivery-date', 'customer-data', 'summary']
                }
            case 'D': // Kit Churrasco
            case 'E': // Reserva do Mar
                if (purchaseType === 'assinatura') {
                    return ['purchase-type', 'quantity', 'frequency', 'delivery-preference', 'customer-data', 'summary']
                }
                return ['purchase-type', 'quantity', 'delivery-date', 'customer-data', 'summary']
            default:
                return ['customer-data', 'summary']
        }
    }

    const steps = getSteps()
    const currentStepIndex = steps.indexOf(currentStep)
    const isFirstStep = currentStepIndex === 0
    const isLastStep = currentStepIndex === steps.length - 1

    const goNext = () => {
        // Handle purchase type redirect (only for Monte o Seu à la carte -> assinatura)
        if (currentStep === 'purchase-type' && purchaseType === 'assinatura' && flowType === 'C') {
            window.location.href = '/planos/monte-o-seu-assinatura'
            return
        }
        if (!isLastStep) {
            setDirection(1)
            setCurrentStep(steps[currentStepIndex + 1])
        }
    }

    const goBack = () => {
        if (!isFirstStep) {
            setDirection(-1)
            setCurrentStep(steps[currentStepIndex - 1])
        }
    }

    // Cart functions
    const addToCart = (productId: string) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0
            if (currentQty >= 6) return prev // Max 6 of the same item

            const totalItems = Object.values(prev).reduce((a, b) => a + b, 0)
            if (totalItems >= 6) return prev // Max 6 items in total

            return { ...prev, [productId]: currentQty + 1 }
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => {
            const newCart = { ...prev }
            if (newCart[productId] > 1) {
                newCart[productId]--
            } else {
                delete newCart[productId]
            }
            return newCart
        })
    }

    const cartTotal = Object.entries(cart).reduce((total, [productId, qty]) => {
        const product = products.find(p => p.id === productId)
        return total + (product?.price || 0) * qty
    }, 0)

    const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0)

    // Calculate price based on flow
    const calculatePrice = () => {
        switch (flowType) {
            case 'A': // Seleção do Mar
                const table = priceTable['selecao-do-mar']
                return table[persons as keyof typeof table] || 340
            case 'B': // Peixe Essencial
                const base = priceTable['peixe-essencial'].basePerMealPerPerson
                return persons * mealsPerWeek * base
            case 'C': // Monte o Seu
                return cartTotal
            case 'D': // Churrasco
                return (priceTable['churrasco'][1] || 249) * quantity
            case 'E': // Reserva do Mar
                return (priceTable['reserva-do-mar'][1] || 119) * quantity
            default:
                return 0
        }
    }

    const handleSubmitOrder = async () => {
        if (!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) {
            alert('URL do Google Script não configurada!')
            return
        }

        // Validação mínima dos dados do cliente
        if (!customerData.name.trim() || !customerData.email.trim() || !customerData.phone.trim()) {
            alert('Por favor, preencha nome, e-mail e telefone antes de finalizar.')
            return
        }

        setIsSubmitting(true)

        try {
            // Monta o resumo em texto
            let summaryText = `Plano: ${plan.name}\n`
            if (plan.flowType === 'A' || plan.flowType === 'B') summaryText += `Pessoas: ${persons}\n`
            if (plan.flowType === 'B') summaryText += `Refeições/sem: ${mealsPerWeek}\n`
            if (plan.flowType === 'D' || plan.flowType === 'E') summaryText += `Quantidade: ${quantity} kit(s)\n`
            if (selectedRestriction) summaryText += `Restrição: Sem ${selectedRestriction}\n`
            
            if (isSubscription) {
                const selectedFrequency = frequencies.find(f => f.id === frequency)
                summaryText += `Frequência: ${selectedFrequency?.name}\n`
                summaryText += `Entrega: ${deliveryDay}-feira, turno da ${deliveryShift}\n`
            } else if (deliveryDate) {
                summaryText += `Entrega: ${deliveryDate.toLocaleDateString('pt-BR')}, turno da ${deliveryShift}\n`
            }

            if (Object.keys(cart).length > 0) {
                summaryText += `\nItens adicionados:\n`
                Object.entries(cart).forEach(([id, qty]) => {
                    const p = products.find(p => p.id === id)
                    if (p) summaryText += `- ${qty}x ${p.name}\n`
                })
            }

            const payload = {
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                cep: customerData.cep,
                purchaseType: isSubscription ? 'Assinatura' : 'Avulso',
                summary: summaryText,
                total: calculatePrice().toFixed(2).replace('.', ',')
            }

            console.log('[Squad Ocyá] Enviando pedido para webhook:', payload)
            console.log('[Squad Ocyá] URL do webhook:', process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL)

            await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8',
                },
                body: JSON.stringify(payload)
            })

            console.log('[Squad Ocyá] fetch concluído (no-cors — resposta não legível)')
            // Com no-cors não é possível ler a resposta — assumimos sucesso se não houver throw
            setIsSuccess(true)
        } catch (error) {
            console.error('[Squad Ocyá] Erro ao enviar pedido:', error)
            alert('Ocorreu um erro ao enviar o pedido. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 'restrictions':
                return <RestrictionsStep selectedRestriction={selectedRestriction} onSelect={setSelectedRestriction} />
            case 'persons':
                return <PersonsStep persons={persons} onPersonsChange={setPersons} />
            case 'meals':
                return <MealsStep mealsPerWeek={mealsPerWeek} onMealsChange={setMealsPerWeek} />
            case 'config':
                return (
                    <ConfigStep
                        persons={persons}
                        mealsPerWeek={mealsPerWeek}
                        frequency={frequency}
                        onPersonsChange={setPersons}
                        onMealsChange={setMealsPerWeek}
                        onFrequencyChange={setFrequency}
                        calculatedPrice={calculatePrice()}
                    />
                )
            case 'frequency':
                return <FrequencyStep frequency={frequency} onFrequencyChange={setFrequency} />
            case 'quantity':
                return (
                     <QuantityStep
                        plan={plan}
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                    />
                )
            case 'purchase-type':
                return <PurchaseTypeStep purchaseType={purchaseType} onTypeChange={setPurchaseType} />
            case 'ecommerce':
                return (
                    <EcommerceStep
                        cart={cart}
                        cartTotal={cartTotal}
                        cartItemsCount={cartItemsCount}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                    />
                )
            case 'delivery-preference':
                return (
                    <DeliveryPreferenceStep
                        deliveryDay={deliveryDay}
                        deliveryShift={deliveryShift}
                        onDayChange={setDeliveryDay}
                        onShiftChange={setDeliveryShift}
                    />
                )
            case 'delivery-date':
                return (
                    <DeliveryDateStep
                        deliveryDate={deliveryDate}
                        deliveryShift={deliveryShift}
                        onDateChange={setDeliveryDate}
                        onShiftChange={setDeliveryShift}
                    />
                )
            case 'customer-data':
                return (
                    <CustomerDataStep
                        customerData={customerData}
                        onCustomerDataChange={setCustomerData}
                    />
                )
            case 'summary':
                return (
                    <SummaryStep
                        plan={plan}
                        persons={persons}
                        mealsPerWeek={mealsPerWeek}
                        frequency={frequency}
                        quantity={quantity}
                        restriction={selectedRestriction}
                        cart={cart}
                        cartTotal={cartTotal}
                        calculatedPrice={calculatePrice()}
                        customerData={customerData}
                        purchaseType={purchaseType}
                        deliveryDay={deliveryDay}
                        deliveryShift={deliveryShift}
                        deliveryDate={deliveryDate}
                        cartItemsCount={cartItemsCount}
                    />
                )
            default:
                return null
        }
    }

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto py-12 px-4 text-center">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h1 className="text-3xl font-bold text-azul mb-4">Pedido Recebido!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Sua seleção do mar foi recebida com sucesso pela equipe do Ocyá.
                </p>
                <div className="bg-blue-50 text-blue-800 p-6 rounded-xl text-sm max-w-md mx-auto mb-8">
                    Nossa equipe vai ativar a sua assinatura diretamente na plataforma de assinatura. Entraremos em contato caso haja alguma dúvida.
                </div>
                <Button asChild className="bg-azul text-white">
                    <Link href="/">Voltar para o início</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-24 md:pb-0">
            {/* Header - Compacto no mobile */}
            <div className="mb-4 md:mb-8">
                <Link href="/#planos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-azul mb-2 md:mb-4 text-sm">
                    <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden md:inline">Voltar aos planos</span>
                    <span className="md:hidden">Voltar</span>
                </Link>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-1">
                        {/* Mobile: inline badge + title */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {isSubscription ? (
                                <Badge className="bg-azul text-white text-xs">Assinatura</Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs">À La Carte</Badge>
                            )}
                            <h1 className="text-xl md:text-3xl font-display text-azul">{plan.name}</h1>
                        </div>
                        {/* Description: hidden on mobile, shown on desktop */}
                        <p className="text-muted-foreground text-sm mt-1 hidden md:block">{plan.description}</p>
                    </div>
                </div>
            </div>

            {/* Progress - Compacto no mobile */}
            <div className="mb-4 md:mb-8">
                <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2">
                    {steps.map((step, idx) => (
                        <div key={step} className="flex items-center flex-shrink-0">
                            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-colors ${idx <= currentStepIndex ? 'bg-azul text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {idx < currentStepIndex ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : idx + 1}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`w-6 md:w-12 h-0.5 md:h-1 mx-0.5 md:mx-1 transition-colors ${idx < currentStepIndex ? 'bg-azul' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction * -50, scale: 0.98 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.25
                    }}
                >
                    <Card className="mb-4 md:mb-8">
                        <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
                            {renderStepContent()}
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between">
                <Button variant="outline" onClick={goBack} disabled={isFirstStep || isSubmitting} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Button>

                {isLastStep ? (
                    <Button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        className="bg-azul hover:bg-azul-claro gap-2"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                        ) : (
                            <>{isSubscription ? 'Finalizar Assinatura' : 'Finalizar Pedido'} <ArrowRight className="w-4 h-4" /></>
                        )}
                    </Button>
                ) : (
                    <Button onClick={goNext} className="bg-azul hover:bg-azul-claro gap-2">
                        Próximo
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Mobile Sticky Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 flex items-center justify-between gap-3 md:hidden z-50">
                <Button
                    variant="outline"
                    onClick={goBack}
                    disabled={isFirstStep || isSubmitting}
                    size="sm"
                    className="flex-shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>

                <div className="flex-1 text-center">
                   
                </div>

                {isLastStep ? (
                    <Button
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                        size="sm"
                        className="bg-azul hover:bg-azul-claro flex-shrink-0"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSubscription ? 'Assinar' : 'Finalizar')}
                    </Button>
                ) : (
                    <Button
                        onClick={goNext}
                        size="sm"
                        className="bg-azul hover:bg-azul-claro flex-shrink-0"
                    >
                        Próximo
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                )}
            </div>
        </div>
    )
}

// ================== STEP COMPONENTS ==================

function RestrictionsStep({ selectedRestriction, onSelect }: { selectedRestriction: string | null; onSelect: (id: string | null) => void }) {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-1">Restrições Alimentares</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-6">Exclua até 1 item do kit (opcional)</p>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
                {restrictions.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(selectedRestriction === item.id ? null : item.id)}
                        className={`p-2 md:p-4 rounded-lg border-2 transition-all ${selectedRestriction === item.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-azul/50'}`}
                    >
                        <span className="text-xl md:text-3xl block">{item.emoji}</span>
                        <span className={`text-xs md:text-sm font-medium ${selectedRestriction === item.id ? 'text-red-600 line-through' : ''}`}>{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function PersonsStep({ persons, onPersonsChange }: { persons: number; onPersonsChange: (n: number) => void }) {
    return (
        <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-3">Quantas pessoas?</h2>
            <div className="flex items-center justify-center gap-4 md:gap-6">
                <Button variant="outline" size="icon" onClick={() => onPersonsChange(Math.max(1, persons - 1))} disabled={persons <= 1}>
                    <Minus className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-azul" />
                    <span className="text-4xl md:text-5xl font-bold text-azul">{persons}</span>
                    <span className="text-sm text-muted-foreground">{persons === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => onPersonsChange(Math.min(6, persons + 1))} disabled={persons >= 6}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

function MealsStep({ mealsPerWeek, onMealsChange }: { mealsPerWeek: number; onMealsChange: (n: number) => void }) {
    return (
        <div className="text-center">
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-3">Refeições por semana</h2>
            <div className="flex items-center justify-center gap-4 md:gap-6">
                <Button variant="outline" size="icon" onClick={() => onMealsChange(Math.max(1, mealsPerWeek - 1))} disabled={mealsPerWeek <= 1}>
                    <Minus className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <Package className="w-6 h-6 md:w-8 md:h-8 text-azul" />
                    <span className="text-4xl md:text-5xl font-bold text-azul">{mealsPerWeek}</span>
                    <span className="text-sm text-muted-foreground">ref/sem</span>
                </div>
                <Button variant="outline" size="icon" onClick={() => onMealsChange(Math.min(7, mealsPerWeek + 1))} disabled={mealsPerWeek >= 7}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

function ConfigStep({ persons, mealsPerWeek, frequency, onPersonsChange, onMealsChange, onFrequencyChange, calculatedPrice }: {
    persons: number; mealsPerWeek: number; frequency: string
    onPersonsChange: (n: number) => void; onMealsChange: (n: number) => void; onFrequencyChange: (f: string) => void
    calculatedPrice: number
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-azul mb-2">Configure seu Peixe Essencial</h2>
                <p className="text-muted-foreground mb-4">Personalize quantidade de pessoas, refeições por semana e frequência de entrega.</p>
            </div>

            {/* Pessoas */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-azul" />
                    <span className="font-medium">Pessoas</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => onPersonsChange(Math.max(1, persons - 1))} disabled={persons <= 1}><Minus className="w-3 h-3" /></Button>
                    <span className="w-8 text-center font-bold">{persons}</span>
                    <Button variant="outline" size="sm" onClick={() => onPersonsChange(Math.min(6, persons + 1))} disabled={persons >= 6}><Plus className="w-3 h-3" /></Button>
                </div>
            </div>

            {/* Refeições */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-azul" />
                    <span className="font-medium">Refeições / semana</span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => onMealsChange(Math.max(1, mealsPerWeek - 1))} disabled={mealsPerWeek <= 1}><Minus className="w-3 h-3" /></Button>
                    <span className="w-8 text-center font-bold">{mealsPerWeek}</span>
                    <Button variant="outline" size="sm" onClick={() => onMealsChange(Math.min(7, mealsPerWeek + 1))} disabled={mealsPerWeek >= 7}><Plus className="w-3 h-3" /></Button>
                </div>
            </div>

            {/* Frequência */}
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-azul" />
                    <span className="font-medium">Frequência de entrega</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {frequencies.map((f) => (
                        <button key={f.id} onClick={() => onFrequencyChange(f.id)} className={`p-3 rounded-lg border-2 transition-all text-center ${frequency === f.id ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                            <span className="font-medium block">{f.name}</span>
                            <span className="text-xs text-muted-foreground">{f.description}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preço estimado */}
            <div className="p-4 bg-areia/30 rounded-lg">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Valor estimado</span>
                    <span className="text-2xl font-bold text-azul">R$ {calculatedPrice.toFixed(2).replace('.', ',')}/mês</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">💡 A cobrança é sempre mensal, no mesmo dia todo mês.</p>
            </div>
        </div>
    )
}

function FrequencyStep({ frequency, onFrequencyChange }: { frequency: string; onFrequencyChange: (f: string) => void }) {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-2">Frequência de entrega</h2>
            <p className="text-xs text-muted-foreground mb-3 bg-areia/30 p-2 rounded-lg">
                💡 Cobrança mensal. A frequência define quantas entregas/mês.
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {frequencies.map((f) => (
                    <button key={f.id} onClick={() => onFrequencyChange(f.id)} className={`p-3 md:p-6 rounded-lg border-2 transition-all text-center ${frequency === f.id ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                        <Calendar className={`w-5 h-5 md:w-8 md:h-8 mx-auto mb-1 md:mb-2 ${frequency === f.id ? 'text-azul' : 'text-gray-400'}`} />
                        <span className="font-semibold block text-sm md:text-lg">{f.name}</span>
                        <span className="text-xs text-muted-foreground hidden md:block">{f.description}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

function QuantityStep({ plan, quantity, onQuantityChange }: { plan: Plan; quantity: number; onQuantityChange: (n: number) => void; }) {
    const formatQty = (qty: number, unit: string) => {
        if (unit === 'un') return `${qty} ${qty === 1 ? 'unidade' : 'unidades'}`
        if (unit === 'g' && qty >= 1000) return `${(qty / 1000).toFixed(1).replace('.0', '')}kg`
        return `${qty}${unit}`
    }

    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-1">Seu pedido</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">{plan.name}</p>

            {/* Quantity selector - compact mobile */}
            <div className="flex items-center justify-between p-3 md:p-4 bg-azul/5 rounded-xl mb-4">
                <span className="text-sm font-medium text-azul">Quantidade de kits</span>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                        <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-2xl font-bold text-azul w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => onQuantityChange(Math.min(10, quantity + 1))} disabled={quantity >= 10}>
                        <Plus className="w-3 h-3" />
                    </Button>
                </div>
            </div>

            {/* Kit composition - dynamic quantities */}
            {plan.kitItems && plan.kitItems.length > 0 && (
                <div className="rounded-xl border border-gray-200 overflow-hidden mb-4">
                    <div className="bg-gray-50 px-3 py-2 flex items-center gap-2 border-b">
                        <Package className="w-4 h-4 text-azul" />
                        <span className="text-sm font-semibold text-azul">
                            O que vem {quantity > 1 ? `nos ${quantity} kits` : 'no kit'}
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {plan.kitItems.map((item, idx) => {
                            const totalQty = item.qty * quantity
                            return (
                                <div key={idx} className="flex items-center justify-between px-3 py-2.5">
                                    <span className="text-sm text-foreground">{item.name}</span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                                        {quantity > 1 && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatQty(item.qty, item.unit)}
                                            </span>
                                        )}
                                        <Badge variant="secondary" className="bg-azul/10 text-azul text-xs font-semibold px-2">
                                            {formatQty(totalQty, item.unit)}
                                        </Badge>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Price summary */}
            
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground justify-center">
                <Truck className="w-3 h-3" />
                <span>Entrega em até 48h · Somente Rio de Janeiro</span>
            </div>
        </div>
    )
}

function PurchaseTypeStep({ purchaseType, onTypeChange }: { purchaseType: 'alacarte' | 'assinatura'; onTypeChange: (t: 'alacarte' | 'assinatura') => void }) {
    return (
        <div>
            <h2 className="text-xl font-semibold text-azul mb-2">Como você prefere comprar?</h2>
            <p className="text-muted-foreground mb-6">Escolha entre compra única ou receba regularmente com uma assinatura.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => onTypeChange('alacarte')} className={`p-6 rounded-lg border-2 transition-all text-left ${purchaseType === 'alacarte' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                    <ShoppingCart className={`w-8 h-8 mb-3 ${purchaseType === 'alacarte' ? 'text-azul' : 'text-gray-400'}`} />
                    <span className="font-semibold block text-lg">À La Carte</span>
                    <span className="text-sm text-muted-foreground">Compra única, sem compromisso</span>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Truck className="w-3 h-3" /> Entrega em 48h</p>
                </button>
                <button onClick={() => onTypeChange('assinatura')} className={`p-6 rounded-lg border-2 transition-all text-left ${purchaseType === 'assinatura' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                    <Calendar className={`w-8 h-8 mb-3 ${purchaseType === 'assinatura' ? 'text-azul' : 'text-gray-400'}`} />
                    <span className="font-semibold block text-lg">Assinatura</span>
                    <span className="text-sm text-muted-foreground">Receba regularmente</span>
                    <p className="text-xs text-green-600 mt-2">✨ Cancele quando quiser</p>
                </button>
            </div>
        </div>
    )
}

function EcommerceStep({ cart, cartTotal, cartItemsCount, onAddToCart, onRemoveFromCart }: {
    cart: Record<string, number>; cartTotal: number; cartItemsCount: number
    onAddToCart: (id: string) => void; onRemoveFromCart: (id: string) => void
}) {
    const categories = [
        { id: 'peixes', name: '🐟 Peixes', emoji: '🐟' },
        { id: 'frutos-do-mar', name: '🦐 Frutos do Mar', emoji: '🦐' },
        { id: 'conservas', name: '🥫 Conservas', emoji: '🥫' },
        { id: 'prontos', name: '🍽️ Prontos', emoji: '🍽️' },
    ] as const

    return (
        <div>
            <h2 className="text-xl font-semibold text-azul mb-2">Monte seu kit</h2>
            <p className="text-muted-foreground mb-6">Escolha os produtos que deseja incluir no seu kit.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products */}
                <div className="lg:col-span-2 space-y-6">
                    {categories.map((cat) => {
                        const categoryProducts = getProductsByCategory(cat.id)
                        return (
                            <div key={cat.id}>
                                <h3 className="font-semibold text-lg mb-3">{cat.name}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {categoryProducts.map((product) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-xs text-muted-foreground">{product.unit}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {cart[product.id] ? (
                                                    <>
                                                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onRemoveFromCart(product.id)}>
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-6 text-center font-medium">{cart[product.id]}</span>
                                                        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => onAddToCart(product.id)}>
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => onAddToCart(product.id)}>Adicionar</Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Cart */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-areia/30 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Seu carrinho</h3>
                        {cartItemsCount === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum item adicionado</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(cart).map(([productId, qty]) => {
                                    const product = products.find(p => p.id === productId)
                                    if (!product) return null
                                    return (
                                        <div key={productId} className="flex justify-between text-sm">
                                            <span>{qty}× {product.name}</span>
                                        </div>
                                    )
                                })}
                                <Separator className="my-2" />
                                <div className="flex justify-between font-semibold">
                                    <span>Total de Itens</span>
                                    <span className="text-azul">{cartItemsCount}</span>
                                </div>
                            </div>
                        )}
                        {cartItemsCount >= 6 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                 <p className="text-xs text-amber-700 bg-amber-100 p-2 rounded-md text-center">Você atingiu o limite de 6 itens para a sua caixa.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function DeliveryPreferenceStep({ deliveryDay, deliveryShift, onDayChange, onShiftChange }: {
    deliveryDay: 'quarta' | 'quinta'; deliveryShift: 'manhã' | 'tarde'
    onDayChange: (d: 'quarta' | 'quinta') => void; onShiftChange: (s: 'manhã' | 'tarde') => void
}) {
    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-1">Preferência de entrega</h2>
            <p className="text-xs md:text-sm text-muted-foreground mb-4">Escolha o dia e turno de entrega preferidos.</p>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-azul mb-2 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> Dia da semana
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        {(['quarta', 'quinta'] as const).map((day) => (
                            <button key={day} onClick={() => onDayChange(day)} className={`p-4 rounded-lg border-2 transition-all text-center ${deliveryDay === day ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                                <span className="font-semibold block capitalize">{day}-feira</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-azul mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Turno
                    </label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button onClick={() => onShiftChange('manhã')} className={`p-4 rounded-lg border-2 transition-all text-center ${deliveryShift === 'manhã' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                            <Sun className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                            <span className="font-semibold block">Manhã</span>
                            <span className="text-xs text-muted-foreground">8h - 12h</span>
                        </button>
                        <button onClick={() => onShiftChange('tarde')} className={`p-4 rounded-lg border-2 transition-all text-center ${deliveryShift === 'tarde' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                            <Moon className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
                            <span className="font-semibold block">Tarde</span>
                            <span className="text-xs text-muted-foreground">16h - 20h</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DeliveryDateStep({ deliveryDate, deliveryShift, onDateChange, onShiftChange }: {
    deliveryDate: Date | null; deliveryShift: 'manhã' | 'tarde'
    onDateChange: (d: Date) => void; onShiftChange: (s: 'manhã' | 'tarde') => void
}) {
    // Generate 14 available dates (48h+, weekdays only)
    const availableDates = useMemo(() => {
        const dates: Date[] = []
        const now = new Date()
        const min = new Date(now)
        min.setDate(min.getDate() + 2)
        min.setHours(0, 0, 0, 0)
        const current = new Date(min)
        while (dates.length < 14) {
            const dow = current.getDay()
            if (dow >= 1 && dow <= 5) dates.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }
        return dates
    }, [])

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

    const isSelected = (date: Date) =>
        deliveryDate && date.toDateString() === deliveryDate.toDateString()

    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-1">Entrega</h2>
            <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                <Truck className="w-3 h-3" /> A partir de 48h · Dias úteis · Somente RJ
            </p>

            {/* Horizontal swipeable date strip */}
            <label className="text-xs font-medium text-azul mb-2 block">Escolha a data</label>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                {availableDates.map((date) => {
                    const selected = isSelected(date)
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateChange(date)}
                            className={`
                                flex-shrink-0 snap-start flex flex-col items-center justify-center
                                w-16 h-[72px] rounded-xl border-2 transition-all
                                ${selected
                                    ? 'border-azul bg-azul text-white shadow-md scale-105'
                                    : 'border-gray-200 hover:border-azul/50 bg-white'
                                }
                            `}
                        >
                            <span className={`text-[10px] font-medium ${selected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                {dayNames[date.getDay()]}
                            </span>
                            <span className={`text-xl font-bold leading-tight ${selected ? 'text-white' : 'text-foreground'}`}>
                                {date.getDate()}
                            </span>
                            <span className={`text-[10px] ${selected ? 'text-white/80' : 'text-muted-foreground'}`}>
                                {monthNames[date.getMonth()]}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Turno */}
            <label className="text-xs font-medium text-azul mt-4 mb-2 block">Turno de entrega</label>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={() => onShiftChange('manhã')} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all ${deliveryShift === 'manhã' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                    <Sun className="w-4 h-4 text-amber-500" />
                    <div className="text-left">
                        <span className="font-semibold text-sm block">Manhã</span>
                        <span className="text-[10px] text-muted-foreground">8h-12h</span>
                    </div>
                </button>
                <button onClick={() => onShiftChange('tarde')} className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all ${deliveryShift === 'tarde' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <div className="text-left">
                        <span className="font-semibold text-sm block">Tarde</span>
                        <span className="text-[10px] text-muted-foreground">16h-20h</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

function CepStep({ initialCep, onCepValid }: { initialCep: string, onCepValid: (cep: string, city: string, state: string) => void }) {
    const [cep, setCep] = useState(initialCep)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isOutOfRegion, setIsOutOfRegion] = useState(false)
    const [success, setSuccess] = useState(false)

    const formatCep = (value: string) => {
        const numbers = value.replace(/\D/g, '')
        if (numbers.length <= 5) return numbers
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCep(e.target.value)
        setCep(formatted)
        if (error) setError(null)
        if (isOutOfRegion) setIsOutOfRegion(false)
    }

    const isCepInDeliveryArea = (cepNumbers: string) => {
        const cepInt = parseInt(cepNumbers, 10);
        const ranges = [
            [20021030, 20241900], [22010010, 22010999], [22020000, 22070999],
            [22080000, 22210029], [22210030, 22211199], [22211200, 22221069],
            [22221070, 22241059], [22241060, 22241900], [22250000, 22260159],
            [22260160, 22271080], [22290177, 22291220], [22410000, 22430020],
            [22430030, 22450210], [22450221, 22451999], [22452000, 22460999],
            [22461000, 22470180], [22470181, 22480999], [22610000, 22610999],
            [22611030, 22785219], [22785220, 22795901]
        ];

        return ranges.some(([start, end]) => cepInt >= start && cepInt <= end);
    }

    const validateCep = async () => {
        const cleanCep = cep.replace(/\D/g, '')
        if (cleanCep.length !== 8) {
            setError('Por favor, informe um CEP válido.')
            return
        }

        if (!isCepInDeliveryArea(cleanCep)) {
            setIsOutOfRegion(true)
            return
        }

        setLoading(true)
        setError(null)
        setIsOutOfRegion(false)

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
            const data = await response.json()

            if (data.erro) {
                setError('CEP não encontrado.')
            } else {
                if (data.uf !== 'RJ') {
                    setIsOutOfRegion(true)
                } else {
                    setSuccess(true)
                    // Tempo para o usuário ver o feedback de sucesso
                    setTimeout(() => {
                        onCepValid(formatCep(cleanCep), data.localidade, data.uf)
                    }, 1000)
                }
            }
        } catch {
            setError('Erro ao validar o CEP. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-sm mx-auto pt-2 pb-4"
        >
            <h2 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Entregamos no seu endereço?</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                As entregas dos nossos peixes e frutos do mar frescos atendem apenas a <span className="font-semibold text-slate-700">região da cidade do Rio de Janeiro</span>.
            </p>

            <div className="space-y-4 px-1">
                <div className="relative group">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${(error || isOutOfRegion) ? 'from-red-400 to-red-500' : success ? 'from-emerald-400 to-emerald-500' : 'from-blue-200 to-azul'} opacity-0 group-focus-within:opacity-20 blur transition-opacity duration-500 -z-10`}></div>
                    <div className="relative">
                        <input
                            type="text"
                            value={cep}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === 'Enter' && cep.replace(/\D/g, '').length === 8 && validateCep()}
                            disabled={loading || success}
                            className={`w-full pl-5 pr-12 py-3.5 text-center text-lg font-bold rounded-xl focus:ring-0 outline-none transition-all duration-300 shadow-sm ${success ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-800 placeholder:text-emerald-300' :
                                (error || isOutOfRegion) ? 'border-2 border-red-400 bg-red-50 text-red-600 placeholder:text-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' :
                                    'border-2 border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:border-azul hover:border-slate-300 focus:ring-4 focus:ring-blue-50'
                                }`}
                            placeholder="00000-000"
                            maxLength={9}
                        />

                        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {success ? (
                                    <motion.div key="success" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: "spring" }}>
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
                                    </motion.div>
                                ) : (error || isOutOfRegion) ? (
                                    <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <AlertCircle className="w-6 h-6 text-red-500" strokeWidth={2.5} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Search className={`w-5 h-5 transition-colors ${cep.length > 0 ? 'text-azul' : 'text-slate-300'}`} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="sync">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="bg-red-50 rounded-xl p-3 border border-red-100 mt-2"
                        >
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </motion.div>
                    )}
                    {isOutOfRegion && (
                        <motion.div
                            key="out-of-region"
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="bg-red-50 rounded-xl p-4 border border-red-100 mt-2 space-y-3"
                        >
                            <p className="text-sm text-red-700 font-medium">Não entregamos Assinatura e À la Carte na sua região, pois são itens frescos.</p>
                            <p className="text-sm text-slate-700">Mas não fique triste! O <strong>Além da Mesa</strong> entrega para todo o Brasil. Lá você encontra nossos molhos, conservas e muito mais.</p>
                            <Button asChild className="w-full bg-azul hover:bg-azul-claro shadow-blue-500/20 text-white font-medium" variant="default" size="sm">
                                <Link href="/alem-da-mesa">Conhecer o Além da Mesa</Link>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    className={`w-full h-[50px] text-base font-bold rounded-xl text-white transition-all duration-500 shadow-md hover:shadow-lg relative overflow-hidden ${success
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-azul hover:bg-azul-claro shadow-blue-500/20 hover:-translate-y-0.5'
                        }`}
                    onClick={validateCep}
                    disabled={loading || success || isOutOfRegion || cep.replace(/\D/g, '').length !== 8}
                >
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div key="loading" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex items-center gap-2 justify-center absolute inset-0">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Verificando...</span>
                            </motion.div>
                        ) : success ? (
                            <motion.div key="success" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="flex items-center gap-2 justify-center absolute inset-0">
                                <span>Perfeito! Vamos lá</span>
                                <ArrowRight className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.span key="idle" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="absolute inset-0 flex items-center justify-center">
                                Certo, conferir CEP
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>

                <div className="pt-2">
                    <a
                        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-[13px] font-medium text-slate-400 hover:text-azul transition-colors hover:underline underline-offset-4"
                    >
                        Não sei meu CEP
                    </a>
                </div>
            </div>
        </motion.div>
    )
}

type CustomerDataType = { name: string; email: string; phone: string; cep: string; city: string; state: string }

function CustomerDataStep({ customerData, onCustomerDataChange }: {
    customerData: CustomerDataType
    onCustomerDataChange: (data: CustomerDataType) => void
}) {
    const [errors, setErrors] = useState<Partial<Record<keyof CustomerDataType, string>>>({})

    const updateField = (field: keyof CustomerDataType, value: string) => {
        onCustomerDataChange({ ...customerData, [field]: value })
        // Clear error when typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    // Format phone as user types
    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '')
        if (numbers.length <= 2) return numbers
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhone(e.target.value)
        updateField('phone', formatted)
    }

    const inputClass = (field: keyof CustomerDataType) =>
        `w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none transition-colors ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`

    return (
        <div>
            <h2 className="text-lg md:text-xl font-semibold text-azul mb-3">Seus dados</h2>
            <div className="space-y-3">
                {/* Nome */}
                <div>
                    <input
                        type="text"
                        value={customerData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={inputClass('name')}
                        placeholder="Nome completo *"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                {/* Email e WhatsApp lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <input
                            type="email"
                            value={customerData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className={inputClass('email')}
                            placeholder="Email *"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="tel"
                            value={customerData.phone}
                            onChange={handlePhoneChange}
                            className={inputClass('phone')}
                            placeholder="WhatsApp *"
                            maxLength={15}
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                </div>

                {/* CEP */}
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={customerData.cep}
                            onChange={(e) => updateField('cep', e.target.value)}
                            className={inputClass('cep')}
                            placeholder="CEP *"
                        />
                         {errors.cep && <p className="text-xs text-red-500 mt-1">{errors.cep}</p>}
                    </div>
                    {customerData.city && (
                        <span className="text-xs text-green-600 font-medium">✓ {customerData.city}/{customerData.state}</span>
                    )}
                </div>
            </div>
        </div>
    )
}


function SummaryStep({ plan, persons, mealsPerWeek, frequency, quantity, restriction, cart, cartTotal, calculatedPrice, customerData, purchaseType, deliveryDay, deliveryShift, deliveryDate, cartItemsCount }: {
    plan: Plan; persons: number; mealsPerWeek: number; frequency: string; quantity: number
    restriction: string | null; cart: Record<string, number>; cartTotal: number; calculatedPrice: number
    customerData: CustomerDataType; purchaseType: 'alacarte' | 'assinatura'
    deliveryDay: 'quarta' | 'quinta'; deliveryShift: 'manhã' | 'tarde'; deliveryDate: Date | null; cartItemsCount: number
}) {
    const selectedFrequency = frequencies.find((f) => f.id === frequency)
    const selectedRestriction = restrictions.find((r) => r.id === restriction)
    const isSubscription = plan.type === 'assinatura' || ((plan.flowType === 'D' || plan.flowType === 'E') && purchaseType === 'assinatura')
    const hasCart = Object.keys(cart).length > 0
    const [copied, setCopied] = useState(false)

    // Plan type label
    const planTypeLabel = plan.flowType === 'C' ? 'Monte o Seu' : isSubscription ? 'Assinatura' : 'À La Carte'

    // Generate pre-configured link
    const generateLink = () => {
        const params = new URLSearchParams()
        if (persons !== 2) params.set('persons', String(persons))
        if (restriction) params.set('restriction', restriction)
        if (frequency !== 'quinzenal') params.set('frequency', frequency)
        if (quantity !== 1) params.set('quantity', String(quantity))
        if (deliveryDay !== 'quarta') params.set('day', deliveryDay)
        if (deliveryShift !== 'manhã') params.set('shift', deliveryShift)
        if (purchaseType !== 'alacarte') params.set('type', purchaseType)
        const qs = params.toString()
        return `${window.location.origin}/planos/${plan.slug}${qs ? '?' + qs : ''}`
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(generateLink())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch { /* ignore */ }
    }

    const formatDeliveryDate = (date: Date) => {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}`
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg md:text-xl font-semibold text-azul">Resumo do pedido</h2>
                <Badge className={isSubscription ? 'bg-azul text-white' : 'bg-areia text-azul'}>{planTypeLabel}</Badge>
            </div>

            <div className="space-y-2 text-sm">
                {/* Dados do cliente */}
                <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-1">
                        <span className="text-muted-foreground truncate">{customerData.name || '—'}</span>
                        <span className="text-muted-foreground truncate text-right">{customerData.phone || '—'}</span>
                        <span className="text-muted-foreground truncate col-span-2">{customerData.email || '—'}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 border-b border-t mt-2">
                    <span className="font-semibold">Total de Itens</span>
                    <div className="text-right">
                        <span className="text-xl font-bold text-azul">
                            {isSubscription && plan.flowType !== 'C' ? '1 Kit' : cartItemsCount > 0 ? `${cartItemsCount} Itens` : 'Nenhum item'}
                        </span>
                    </div>
                </div>

                {hasCart && (
                    <div className="py-3 border-b">
                        <span className="text-muted-foreground block mb-2 font-medium">Itens Selecionados</span>
                        <div className="space-y-1 text-sm bg-areia/20 p-3 rounded-lg">
                            {Object.entries(cart).map(([productId, qty]) => {
                                const product = products.find(p => p.id === productId)
                                if (!product) return null
                                return (
                                    <div key={productId} className="flex justify-between items-center">
                                        <span className="truncate flex-1">{product.name}</span>
                                        <span className="font-medium text-azul whitespace-nowrap ml-4">{qty}x</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Plano */}
                <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Plano</span>
                    <span className="font-medium">{plan.name}</span>
                </div>

                {(plan.flowType === 'A' || plan.flowType === 'B') && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Pessoas</span>
                        <span className="font-medium">{persons}</span>
                    </div>
                )}

                {plan.flowType === 'B' && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Refeições/sem</span>
                        <span className="font-medium">{mealsPerWeek}</span>
                    </div>
                )}

                {(plan.flowType === 'D' || plan.flowType === 'E') && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Quantidade</span>
                        <span className="font-medium">{quantity} kit{quantity !== 1 && 's'}</span>
                    </div>
                )}

                {/* Kit composition for D/E flows */}
                {(plan.flowType === 'D' || plan.flowType === 'E') && plan.kitItems && plan.kitItems.length > 0 && (
                    <div className="py-2 border-b">
                        <span className="text-muted-foreground text-xs block mb-1.5">
                            Composição {quantity > 1 ? `(${quantity} kits)` : 'do kit'}
                        </span>
                        <div className="space-y-1">
                            {plan.kitItems.map((item, idx) => {
                                const totalQty = item.qty * quantity
                                const formatted = item.unit === 'un'
                                    ? `${totalQty}×`
                                    : item.unit === 'g' && totalQty >= 1000
                                        ? `${(totalQty / 1000).toFixed(1).replace('.0', '')}kg`
                                        : `${totalQty}${item.unit}`
                                return (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span className="text-foreground">{item.name}</span>
                                        <span className="font-medium text-azul">{formatted}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Delivery info */}
                {isSubscription && (
                    <>
                        {selectedFrequency && (
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Frequência</span>
                                <span className="font-medium">{selectedFrequency.name} ({selectedFrequency.description})</span>
                            </div>
                        )}
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Dia de entrega</span>
                            <span className="font-medium capitalize">{deliveryDay}-feira • {deliveryShift}</span>
                        </div>
                    </>
                )}

                {!isSubscription && deliveryDate && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Entrega</span>
                        <span className="font-medium">{formatDeliveryDate(deliveryDate)} • {deliveryShift}</span>
                    </div>
                )}

                {selectedRestriction && (
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Restrição</span>
                        <span className="font-medium text-red-600">{selectedRestriction.emoji} Sem {selectedRestriction.name}</span>
                    </div>
                )}

                {/* Personalizar button for D/E flows */}
                {(plan.flowType === 'D' || plan.flowType === 'E') && (
                    <div className="pt-3 border-t">
                        <Button variant="outline" asChild className="w-full border-azul text-azul hover:bg-azul/5">
                            <Link href="/planos/monte-o-seu-alacarte">
                                Personalizar meu kit →
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Copy pre-configured link */}
                <div className="pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={copyLink} className="w-full text-muted-foreground hover:text-azul">
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? 'Link copiado!' : 'Copiar link do pedido'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
