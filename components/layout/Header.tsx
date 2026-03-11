'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { navigation, contacts } from '@/lib/constants'
import { useCart } from '@/stores/cart'

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const totalItems = useCart((state) => state.totalItems())
    const openCart = useCart((state) => state.openCart)

    const handleNavClick = (href: string, type: string) => {
        if (type === 'anchor') {
            const element = document.querySelector(href)
            element?.scrollIntoView({ behavior: 'smooth' })
            setIsOpen(false)
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/images/logo-ocya.png"
                            alt="Ocyá em Casa"
                            width={140}
                            height={50}
                            className="h-10 md:h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navigation.header.map((item) => (
                            <NavLink key={item.label} item={item} onClick={handleNavClick} />
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center gap-4">
                        <a
                            href={contacts.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-foreground hover:text-azul transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>{contacts.phone}</span>
                        </a>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-azul text-white text-xs rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </div>

                    {/* Mobile Menu */}
                    <div className="flex lg:hidden items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                            onClick={openCart}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-azul text-white text-xs rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] bg-white p-0 flex flex-col">
                                {/* Header do Menu */}
                                <div className="p-6 border-b">
                                    <Image
                                        src="/images/logo-ocya.png"
                                        alt="Ocyá em Casa"
                                        width={100}
                                        height={36}
                                        className="h-8 w-auto"
                                    />
                                </div>

                                {/* Navegação */}
                                <nav className="flex-1 p-6">
                                    <div className="space-y-1">
                                        {navigation.header.map((item) => (
                                            <MobileNavLink
                                                key={item.label}
                                                item={item}
                                                onClick={() => {
                                                    handleNavClick(item.href, item.type)
                                                    setIsOpen(false)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </nav>

                                {/* Footer do Menu */}
                                <div className="p-6 border-t bg-gray-50 space-y-4">
                                    {/* WhatsApp CTA */}
                                    <a
                                        href={contacts.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                    >
                                        <MessageCircle className="w-5 h-5" />
                                        <div>
                                            <span className="text-sm font-medium block">Fale Conosco</span>
                                            <span className="text-xs opacity-75">{contacts.phone}</span>
                                        </div>
                                    </a>

                                    {/* CTA Principal */}
                                    <Button asChild className="w-full bg-azul hover:bg-azul-claro">
                                        <Link href="/#planos" onClick={() => setIsOpen(false)}>
                                            Ver Planos
                                        </Link>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}

interface NavItem {
    label: string
    href: string
    type: string
}

function NavLink({ item, onClick }: { item: NavItem; onClick: (href: string, type: string) => void }) {
    if (item.type === 'external') {
        return (
            <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold uppercase tracking-wide text-foreground hover:text-azul transition-colors"
            >
                {item.label}
            </a>
        )
    }

    if (item.type === 'anchor') {
        return (
            <button
                onClick={() => onClick(item.href, item.type)}
                className="text-xs font-semibold uppercase tracking-wide text-foreground hover:text-azul transition-colors"
            >
                {item.label}
            </button>
        )
    }

    return (
        <Link
            href={item.href}
            className="text-xs font-semibold uppercase tracking-wide text-foreground hover:text-azul transition-colors"
        >
            {item.label}
        </Link>
    )
}

function MobileNavLink({ item, onClick }: { item: NavItem; onClick: () => void }) {
    const baseClass = "block text-base font-medium text-foreground hover:text-azul hover:bg-azul/5 transition-all py-3 px-3 rounded-lg -mx-3"

    if (item.type === 'external') {
        return (
            <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={baseClass}
                onClick={onClick}
            >
                {item.label}
            </a>
        )
    }

    if (item.type === 'anchor') {
        return (
            <button onClick={onClick} className={`${baseClass} text-left w-full`}>
                {item.label}
            </button>
        )
    }

    return (
        <Link href={item.href} className={baseClass} onClick={onClick}>
            {item.label}
        </Link>
    )
}
