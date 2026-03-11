import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MessageCircle } from 'lucide-react'
import { contacts, siteConfig, navigation } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-azul text-white">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Logo e Tagline */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/images/logo-ocya-270-80-branco.png"
                                alt="Ocyá em Casa"
                                width={140}
                                height={42}
                                className="h-10 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="mt-4 text-sm text-white/70 leading-relaxed">
                            {siteConfig.tagline}
                        </p>
                    </div>

                    {/* Navegação */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Navegação</h4>
                        <nav className="flex flex-col gap-2">
                            {navigation.header.slice(0, 4).map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Atendimento */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Atendimento</h4>
                        <div className="flex flex-col gap-3">
                            <a
                                href={contacts.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>WhatsApp</span>
                            </a>
                            <a
                                href={contacts.phoneLink}
                                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                <span>{contacts.phone}</span>
                            </a>
                            <a
                                href={`mailto:${contacts.email} `}
                                className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                <span>{contacts.email}</span>
                            </a>
                        </div>
                    </div>

                    {/* Áreas de Entrega */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Áreas de Entrega</h4>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Rio de Janeiro: Zona Sul, Barra da Tijuca e Recreio
                        </p>
                        <p className="text-sm text-white/50 mt-2">
                            Quartas e Quintas
                            <br />
                            8h-12h ou 16h-20h
                        </p>
                    </div>
                </div>

                <Separator className="my-8 bg-white/20" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-white/50">
                        © {currentYear} Ocyá em Casa. Todos os direitos reservados.
                    </p>
                    <p className="text-sm text-white/50">
                        CNPJ: 41.801.248/0001-39
                    </p>
                </div>
            </div>
        </footer>
    )
}
