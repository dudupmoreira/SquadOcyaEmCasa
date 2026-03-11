'use client'

import { motion } from 'framer-motion'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
    {
        question: 'Como funciona a assinatura?',
        answer: 'Você escolhe o plano que mais combina com você e recebe entregas quinzenais ou mensais, de acordo com sua preferência. Cancele a qualquer momento, sem multas.',
    },
    {
        question: 'Quais são as áreas de entrega?',
        answer: 'Atualmente entregamos na Zona Sul do Rio de Janeiro, Barra da Tijuca e Recreio. As entregas acontecem às quartas ou quintas-feiras, nos horários de 8h-12h ou 16h-20h.',
    },
    {
        question: 'Posso personalizar meu kit?',
        answer: 'Sim! No plano "Monte o Seu" você escolhe exatamente os itens que deseja. Nos outros planos, você pode indicar restrições alimentares para excluir itens específicos.',
    },
    {
        question: 'Como são embalados os produtos?',
        answer: 'Todos os produtos são embalados a vácuo e enviados com gelo seco em caixas térmicas, garantindo frescor e qualidade até a sua porta.',
    },
    {
        question: 'Qual a diferença entre Assinatura e À La Carte?',
        answer: 'Na assinatura você recebe entregas recorrentes (quinzenais ou mensais) com renovação automática. No À La Carte você faz uma compra única, sem compromisso de recorrência.',
    },
    {
        question: 'Como cancelar minha assinatura?',
        answer: 'Você pode cancelar a qualquer momento pela sua área de cliente ou entrando em contato conosco via WhatsApp. Se cancelar antes da data de cobrança, vale no mesmo mês.',
    },
]

export function FAQSection() {
    return (
        <section id="faq" className="py-16 md:py-24 bg-offwhite">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block text-azul font-medium text-sm uppercase tracking-wider mb-4">
                        Dúvidas
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display text-azul mb-4">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Tire suas dúvidas sobre o Ocyá em Casa.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="bg-white mb-2 rounded-lg px-4">
                                <AccordionTrigger className="text-left text-azul hover:no-underline py-4">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}
