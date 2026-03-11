'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { contacts } from '@/lib/constants'

export function CommunitySection() {
    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-areia rounded-2xl p-8 md:p-12 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-azul/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-azul" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-display text-azul mb-4">
                        Faça parte da nossa comunidade
                    </h2>

                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        Entre para o nosso grupo no WhatsApp e fique por dentro das novidades,
                        receitas exclusivas e dicas de preparo. Válido para clientes e não-clientes!
                    </p>

                    <Button
                        size="lg"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        asChild
                    >
                        <a href={contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                            Entrar na comunidade
                        </a>
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
