'use client'

import { motion } from 'framer-motion'
import { Clock, Fish, Anchor, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const benefits = [
    {
        icon: Clock,
        title: 'Praticidade',
        description: 'Alimentos pré-cozidos, temperados e entregues na sua casa. Para você só finalizar e comer em qualquer momento do seu dia.',
    },
    {
        icon: Fish,
        title: 'Nutrição e sabor',
        description: 'Proteínas mais leves, nutritivas e saborosas para o seu dia a dia, e principais fontes de ômega-3. Produtos artesanais e 100% orgânicos, livres de conservantes.',
    },
    {
        icon: Anchor,
        title: 'Pesca responsável',
        description: 'Utilizamos peixes e frutos do mar provenientes da pesca artesanal e de baixa escala. Direto do mar pra sua rotina, sem intervenção industrial.',
    },
    {
        icon: Gift,
        title: 'Benefícios exclusivos no ecossistema do Grupo Ocyá',
        description: 'Quem assina o Ocyá em Casa tem acesso a uma série de benefícios exclusivos como brindes, descontos e muito mais.',
    },
]

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
}

export function BenefitsSection() {
    return (
        <section id="beneficios" className="py-16 md:py-24 bg-offwhite">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="inline-block text-azul font-medium text-sm uppercase tracking-wider mb-4">
                        Benefícios
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display text-azul mb-4">
                        Por que assinar?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Descubra as vantagens de ter o mar na sua mesa com regularidade.
                    </p>
                </motion.div>

                {/* Content Grid: Cards + Video */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Benefits Cards - 2 columns on left */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {benefits.map((benefit) => (
                            <motion.div key={benefit.title} variants={itemVariants}>
                                <Card className="h-full bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-full bg-areia flex items-center justify-center mb-4">
                                            <benefit.icon className="w-6 h-6 text-azul" />
                                        </div>
                                        <CardTitle className="text-lg font-semibold text-azul">
                                            {benefit.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {benefit.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* YouTube Shorts Video - Right side */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-1 flex items-center justify-center"
                    >
                        <div className="w-full max-w-[280px] lg:max-w-none">
                            {/* YouTube Shorts Container - 9:16 aspect ratio */}
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-azul" style={{ aspectRatio: '9/16' }}>
                                <iframe
                                    src="https://www.youtube.com/embed/Bxlavq6tT50?loop=1&playlist=Bxlavq6tT50"
                                    title="Conheça o Clube Ocyá"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
