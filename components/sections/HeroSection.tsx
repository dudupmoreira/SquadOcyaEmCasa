'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
    {
        id: 1,
        subtitle: 'Ocyá em Casa',
        title: 'O mar na sua',
        titleHighlight: 'rotina',
        description: 'Uma assinatura mensal com entrega a cada quinze dias que leva até a sua casa uma curadoria de produtos do mar selecionados por nós, com opções pensadas para diferentes momentos da sua rotina.',
        cta: 'Faça parte e receba o Ocyá em Casa',
        ctaHref: '#planos',
        image: '/images/food/pratos-3.webp',
        bgColor: 'bg-azul',
    },
    {
        id: 2,
        subtitle: 'O Restaurante',
        title: 'Para nós, o mar é a mãe da',
        titleHighlight: 'vida',
        description: 'Aquela que nos protege, que nos dá força e nos alimenta. Ingredientes frescos, maturação artesanal e pesca de baixa escala servindo o melhor do mar.',
        cta: 'Reserve sua mesa',
        ctaHref: 'https://ocya.com.br/reservar',
        ctaExternal: true,
        image: '/images/food/pratos-2.webp',
        bgColor: 'bg-azul',
    },
    {
        id: 3,
        subtitle: 'Mar Ensina',
        title: 'Aprenda a arte da',
        titleHighlight: 'maturação',
        description: 'Conheça a técnica de maturação que permite conservar peixes por semanas com segurança, sem congelar. Curso online com o Chef Gerônimo Athuel, referência na gastronomia do mar no Brasil.',
        cta: 'Conheça o curso',
        ctaHref: 'https://marensina.com.br/curso-maturacao-peixes/inscricoes-abertas-ads-v1',
        ctaExternal: true,
        image: '/images/food/clubeocya07.jpg',
        bgColor: 'bg-areia',
        darkText: true,
    },
]

export function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, [])

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }, [])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
        setIsAutoPlaying(false)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    useEffect(() => {
        if (!isAutoPlaying) return
        const interval = setInterval(nextSlide, 6000)
        return () => clearInterval(interval)
    }, [isAutoPlaying, nextSlide])

    const slide = slides[currentSlide]

    const handleCtaClick = () => {
        if (slide.ctaExternal) {
            window.open(slide.ctaHref, '_blank')
        } else {
            document.querySelector(slide.ctaHref)?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const textColor = slide.darkText ? 'text-azul' : 'text-white'
    const subtitleColor = slide.darkText ? 'text-azul/70' : 'text-areia'
    const highlightColor = slide.darkText ? 'text-azul' : 'text-areia'
    const descColor = slide.darkText ? 'text-azul/80' : 'text-white/90'

    return (
        <section className={`relative overflow-hidden ${slide.bgColor}`}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`${slide.bgColor}`}
                >
                    <div className="container mx-auto px-4">
                        <div className="min-h-[60vh] md:min-h-[80vh] flex items-center py-12 md:py-24">
                            {/* Layout padrão: texto à esquerda, imagem à direita */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="max-w-xl"
                                >
                                    <span className={`inline-block font-medium text-sm uppercase tracking-wider mb-4 ${subtitleColor}`}>
                                        {slide.subtitle}
                                    </span>
                                    <h1 className={`text-3xl md:text-4xl lg:text-5xl font-display leading-tight mb-6 ${textColor}`}>
                                        {slide.title}{' '}
                                        <span className={highlightColor}>{slide.titleHighlight}</span>
                                    </h1>
                                    <p className={`text-lg leading-relaxed mb-8 ${descColor}`}>
                                        {slide.description}
                                    </p>
                                    <Button
                                        size="lg"
                                        className={slide.darkText
                                            ? "bg-azul text-white hover:bg-azul/90 font-semibold px-8"
                                            : "bg-areia text-azul hover:bg-areia/90 font-semibold px-8"
                                        }
                                        onClick={handleCtaClick}
                                    >
                                        {slide.cta}
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="relative hidden lg:block"
                                >
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src={slide.image}
                                            alt={slide.subtitle}
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
                onClick={() => { prevSlide(); setIsAutoPlaying(false) }}
                className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all group ${slide.darkText
                    ? 'bg-azul/10 hover:bg-azul/20'
                    : 'bg-white/10 hover:bg-white/20'
                    }`}
                aria-label="Slide anterior"
            >
                <ChevronLeft className={`w-6 h-6 group-hover:scale-110 transition-transform ${slide.darkText ? 'text-azul' : 'text-white'}`} />
            </button>
            <button
                onClick={() => { nextSlide(); setIsAutoPlaying(false) }}
                className={`absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center transition-all group ${slide.darkText
                    ? 'bg-azul/10 hover:bg-azul/20'
                    : 'bg-white/10 hover:bg-white/20'
                    }`}
                aria-label="Próximo slide"
            >
                <ChevronRight className={`w-6 h-6 group-hover:scale-110 transition-transform ${slide.darkText ? 'text-azul' : 'text-white'}`} />
            </button>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                {slides.map((s, index) => (
                    <button
                        key={s.id}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? slide.darkText
                                ? 'bg-azul w-8'
                                : 'bg-areia w-8'
                            : slide.darkText
                                ? 'bg-azul/30 w-2 hover:bg-azul/50'
                                : 'bg-white/30 w-2 hover:bg-white/50'
                            }`}
                        aria-label={`Ir para slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 z-20 ${slide.darkText ? 'bg-azul/10' : 'bg-white/10'}`}>
                <motion.div
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: isAutoPlaying ? '100%' : '0%' }}
                    transition={{ duration: isAutoPlaying ? 6 : 0, ease: 'linear' }}
                    className={slide.darkText ? 'h-full bg-azul' : 'h-full bg-areia'}
                />
            </div>
        </section>
    )
}
