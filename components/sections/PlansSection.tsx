'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Settings2, Users, Sparkles, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanCardSkeleton } from '@/components/ui/skeleton'
import { subscriptionPlans, alaCartePlans, type Plan } from '@/lib/plans'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function PlansSection() {
    return (
        <section id="planos" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block text-azul font-medium text-sm uppercase tracking-wider mb-4">
                        Planos
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display text-azul mb-4">
                        Receba o Ocyá em Casa
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Escolha entre assinatura recorrente ou compra única. Todos os planos com a mesma qualidade e cuidado.
                    </p>
                </motion.div>

                {/* Assinatura Section - Container unificado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 rounded-3xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-azul p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-display text-white tracking-[0.3em] mb-2">
                            ASSINATURA
                        </h3>
                        <div className="w-12 h-0.5 bg-white/40 mb-3" />
                        <p className="text-white/80 text-sm md:text-base max-w-xl">
                            Defina seu pacote, tamanho e frequência de entrega. A cobrança é mensal e você pode cancelar a qualquer momento.
                        </p>
                    </div>

                    {/* Cards - Carrossel horizontal no mobile, grid no desktop */}
                    <div className="bg-azul/5 p-4 md:p-8">
                        {/* Mobile: Carrossel horizontal */}
                        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                            <div className="flex gap-4" style={{ width: 'max-content' }}>
                                {subscriptionPlans.map((plan) => (
                                    <div key={plan.id} className="w-[280px] flex-shrink-0 snap-center">
                                        <PlanCard plan={plan} compact />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mobile: Indicador de swipe */}
                        <div className="flex justify-center items-center gap-1.5 mt-3 md:hidden text-azul/70 text-xs font-medium">
                            <span>👆 Deslize</span>
                            <ChevronRight className="w-4 h-4 animate-bounce" />
                        </div>

                        {/* Desktop: Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {subscriptionPlans.map((plan) => (
                                <motion.div key={plan.id} variants={itemVariants}>
                                    <PlanCard plan={plan} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* À La Carte Section - Container unificado */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-areia p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-display text-azul tracking-[0.3em] mb-2">
                            À LA CARTE
                        </h3>
                        <div className="w-12 h-0.5 bg-azul/40 mb-3" />
                        <p className="text-azul/80 text-sm md:text-base max-w-xl">
                            Escolha seus peixes e frutos do mar no seu tempo, sem assinatura. Entrega em 48h.
                        </p>
                    </div>

                    {/* Cards - Carrossel horizontal no mobile, grid no desktop */}
                    <div className="bg-areia/30 p-4 md:p-8">
                        {/* Mobile: Carrossel horizontal */}
                        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
                            <div className="flex gap-4" style={{ width: 'max-content' }}>
                                {alaCartePlans.map((plan) => (
                                    <div key={plan.id} className="w-[280px] flex-shrink-0 snap-center">
                                        <PlanCard plan={plan} compact />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mobile: Indicador de swipe */}
                        <div className="flex justify-center items-center gap-1.5 mt-3 md:hidden text-azul/70 text-xs font-medium">
                            <span>👆 Deslize</span>
                            <ChevronRight className="w-4 h-4 animate-bounce" />
                        </div>

                        {/* Desktop: Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {alaCartePlans.map((plan) => (
                                <motion.div key={plan.id} variants={itemVariants}>
                                    <PlanCard plan={plan} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

function PlanCard({ plan, compact = false }: { plan: Plan; compact?: boolean }) {
    const isSubscription = plan.type === 'assinatura'
    const actionLabel = isSubscription ? 'Assinar' : 'Comprar'
    const isMonteOSeu = plan.flowType === 'C'

    // Versão compacta para carrossel mobile
    if (compact) {
        return (
            <Card className="h-full flex flex-col bg-white border-0 shadow-md overflow-hidden py-0">
                {/* Image menor */}
                <div className="aspect-[16/9] relative">
                    <Image
                        src={plan.image}
                        alt={plan.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-3 flex-grow flex flex-col">
                    <h3 className="text-lg font-display text-azul mb-1">{plan.name}</h3>

                    {/* Preço inline */}
                    <div className="flex items-baseline gap-1 mb-2">
                        {plan.price ? (
                            <>
                                <span className="text-lg font-bold text-azul">{plan.priceLabel}</span>
                                {isSubscription && <span className="text-xs text-muted-foreground">/mês</span>}
                            </>
                        ) : (
                            <span className="text-sm font-medium text-azul">Desde R$ 89</span>
                        )}
                    </div>

                    {/* Recomendação curta */}
                    <p className="text-xs text-muted-foreground mb-1">{plan.recommendation}</p>
                    {isSubscription && (
                        <p className="text-xs text-azul/70 mb-3">2 entregas por mês</p>
                    )}

                    {/* Botões */}
                    <div className="mt-auto">
                        {isMonteOSeu ? (
                            <Button asChild size="sm" className="w-full bg-azul hover:bg-azul-claro active:scale-95 transition-transform">
                                <Link href={`/planos/${plan.slug}`}>
                                    <Settings2 className="mr-1 w-3 h-3" />
                                    Montar meu kit
                                </Link>
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button asChild size="sm" className="flex-1 bg-azul hover:bg-azul-claro active:scale-95 transition-transform">
                                    <Link href={`/planos/${plan.slug}`}>
                                        {actionLabel}
                                    </Link>
                                </Button>
                                <Button variant="outline" size="sm" asChild className="flex-1 border-azul text-azul hover:bg-azul/5 active:scale-95 transition-transform">
                                    <Link href={`/planos/${plan.slug}?customize=true`}>
                                        Personalizar
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        )
    }

    // Versão completa (desktop)
    return (
        <Card className="h-full flex flex-col bg-white border-0 shadow-md hover:shadow-xl transition-all overflow-hidden py-0 pb-6">
            {/* Image */}
            <div className="aspect-[4/3] relative">
                <Image
                    src={plan.image}
                    alt={plan.name}
                    fill
                    className="object-cover"
                />
            </div>

            <CardHeader className="pb-2 pt-4">
                <CardTitle className="text-xl font-display text-azul">
                    {plan.name}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                </p>

                {/* Recomendação destacada */}
                <div className="p-3 bg-areia/30 rounded-lg border border-areia">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-azul" />
                        <span className="text-xs font-medium text-azul">Recomendação da casa</span>
                    </div>
                    <p className="text-sm font-semibold text-azul">
                        {plan.recommendation}
                    </p>
                    {isSubscription && (
                        <p className="text-xs text-azul/70 mt-0.5">2 entregas por mês</p>
                    )}
                    {plan.price && (
                        <p className="text-lg font-bold text-azul mt-1">
                            {plan.priceLabel}
                            {isSubscription && <span className="text-xs font-normal text-muted-foreground">/mês</span>}
                        </p>
                    )}
                    {!plan.price && (
                        <p className="text-sm text-muted-foreground mt-1">Preço conforme seleção</p>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-4 border-t">
                {isMonteOSeu ? (
                    /* Monte o Seu: Botão único */
                    <Button asChild className="w-full bg-azul hover:bg-azul-claro">
                        <Link href={`/planos/${plan.slug}`}>
                            <Settings2 className="mr-2 w-4 h-4" />
                            Montar meu kit
                        </Link>
                    </Button>
                ) : (
                    /* Outros planos: Botões lado a lado */
                    <>
                        <div className="flex gap-3 w-full">
                            <div className="flex-1 flex flex-col items-center gap-1">
                                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Opção rápida para 2 pessoas
                                </p>
                                <Button asChild className="w-full bg-azul hover:bg-azul-claro">
                                    <Link href={`/planos/${plan.slug}`}>
                                        {actionLabel} agora
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-1">
                                <p className="text-xs text-center text-muted-foreground">
                                    Personalize seu pedido
                                </p>
                                <Button variant="outline" asChild className="w-full border-azul text-azul hover:bg-azul/5 group">
                                    <Link href={`/planos/${plan.slug}?customize=true`}>
                                        <Settings2 className="mr-1 w-4 h-4 group-hover:rotate-90 transition-transform" />
                                        Personalizar
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </CardFooter>
        </Card>
    )
}
