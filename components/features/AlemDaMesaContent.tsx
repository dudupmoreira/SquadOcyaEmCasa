'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Minus, Plus, Truck, CalendarDays, Sun, Moon, X, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { merchandiseProducts, getMerchandiseByCategory, type MerchandiseProduct } from '@/lib/plans'

const categories = [
    { id: 'vestuario', name: 'Vestuário', emoji: '👕' },
    { id: 'acessorios', name: 'Acessórios', emoji: '🎒' },
    { id: 'cozinha', name: 'Cozinha', emoji: '🍳' },
    { id: 'conservas-avulsas', name: 'Conservas', emoji: '🥫' },
] as const

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

export function AlemDaMesaContent() {
    const [cart, setCart] = useState<Record<string, number>>({})
    const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]['id'] | 'all'>('all')
    const [showDelivery, setShowDelivery] = useState(false)
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null)
    const [deliveryShift, setDeliveryShift] = useState<'manhã' | 'tarde'>('manhã')
    const [customerData, setCustomerData] = useState({ name: '', email: '', phone: '', cep: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    // Available delivery dates (48h+, weekdays only)
    const availableDates = useMemo(() => {
        const dates: Date[] = []
        const now = new Date()
        const minDate = new Date(now)
        minDate.setDate(minDate.getDate() + 2)
        const current = new Date(minDate)
        while (dates.length < 14) {
            const dow = current.getDay()
            if (dow >= 1 && dow <= 5) dates.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }
        return dates
    }, [])

    const formatDate = (date: Date) => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`
    }

    const addToCart = (productId: string) => {
        setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
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
        const product = merchandiseProducts.find(p => p.id === productId)
        return total + (product?.price || 0) * qty
    }, 0)

    const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0)

    const filteredProducts = selectedCategory === 'all'
        ? merchandiseProducts
        : getMerchandiseByCategory(selectedCategory)

    const handleSubmitOrder = async () => {
        if (!customerData.name || !customerData.phone || !customerData.email || !deliveryDate) {
            alert('Preencha seus dados e escolha a data de entrega.')
            return
        }
        
        if (!process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL) {
            alert('URL do Google Script não configurada!')
            return
        }

        setIsSubmitting(true)

        try {
            let summaryText = `Pedido Além da Mesa\n`
            summaryText += `Entrega: ${formatDate(deliveryDate)}, turno da ${deliveryShift}\n\n`
            summaryText += `Itens adicionados:\n`
            
            Object.entries(cart).forEach(([id, qty]) => {
                const p = merchandiseProducts.find(p => p.id === id)
                if (p) summaryText += `- ${qty}x ${p.name}\n`
            })

            const payload = {
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone,
                cep: customerData.cep,
                purchaseType: 'Além da Mesa',
                summary: summaryText,
                total: cartTotal.toFixed(2).replace('.', ',')
            }

            await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            setIsSuccess(true)
        } catch (error) {
            console.error('Erro ao enviar pedido:', error)
            alert('Ocorreu um erro ao enviar o pedido. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-offwhite py-16 px-4 flex items-center justify-center">
                <div className="max-w-xl mx-auto text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-10 h-10" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-azul mb-4">Pedido Recebido!</h1>
                    <p className="text-lg text-muted-foreground mb-8">
                        Seu pedido Além da Mesa foi recebido com sucesso pela equipe do Ocyá.
                    </p>
                    <div className="bg-blue-50 text-blue-800 p-6 rounded-xl text-sm max-w-md mx-auto mb-8">
                        Nossa equipe vai entrar em contato para confirmar os detalhes do envio e pagamento, se necessário.
                    </div>
                    <Button asChild className="bg-azul text-white">
                        <Link href="/">Voltar para o início</Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-offwhite py-8 md:py-16">
            <div className="container mx-auto px-4">
                {/* Hero Section */}
                <div className="mb-8 md:mb-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-azul mb-6 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-azul text-white rounded-2xl p-6 md:p-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-display mb-2">Além da Mesa</h1>
                                <p className="text-white/80 text-sm md:text-base max-w-xl">
                                    Produtos exclusivos para levar a experiência Ocyá para onde você for
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Mobile: Categorias horizontais - Sticky */}
                <div className="lg:hidden sticky top-16 z-30 bg-offwhite py-3 -mx-4 px-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-azul text-white shadow-md'
                                : 'bg-white border border-gray-200 hover:border-azul hover:text-azul'
                                }`}
                        >
                            Todos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedCategory === cat.id
                                    ? 'bg-azul text-white shadow-md'
                                    : 'bg-white border border-gray-200 hover:border-azul hover:text-azul'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Desktop Sidebar - Categories + Cart */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">
                        {/* Categories */}
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">Categorias</h3>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${selectedCategory === 'all'
                                            ? 'bg-azul text-white shadow-md'
                                            : 'hover:bg-azul/5 text-foreground'
                                            }`}
                                    >
                                        <span>Todos</span>
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${selectedCategory === cat.id
                                                ? 'bg-azul text-white shadow-md'
                                                : 'hover:bg-azul/5 text-foreground'
                                                }`}
                                        >
                                            <span>{cat.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cart */}
                        <Card className="sticky top-24">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Carrinho
                                    {cartItemsCount > 0 && (
                                        <Badge className="bg-azul text-white">{cartItemsCount}</Badge>
                                    )}
                                </h3>

                                {cartItemsCount === 0 ? (
                                    <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(cart).map(([productId, qty]) => {
                                            const product = merchandiseProducts.find(p => p.id === productId)
                                            if (!product) return null
                                            return (
                                                <div key={productId} className="flex items-center justify-between text-sm">
                                                    <div className="flex-1">
                                                        <p className="font-medium">{product.name}</p>
                                          <p className="text-muted-foreground">
                                             {qty}
                                          </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => removeFromCart(productId)}>
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-4 text-center">{qty}</span>
                                                        <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => addToCart(productId)}>
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <Separator />

                                          <div className="flex justify-between font-semibold">
                                              <span>Total de Itens</span>
                                              <span className="text-azul">{cartItemsCount}</span>
                                          </div>

                                        <Button className="w-full bg-azul hover:bg-azul-claro" onClick={() => setShowDelivery(true)}>
                                            Finalizar compra
                                        </Button>

                                        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                                            <Truck className="w-3 h-3" /> Entrega em até 5 dias úteis
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={selectedCategory}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6"
                        >
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    quantity={cart[product.id] || 0}
                                    onAdd={() => addToCart(product.id)}
                                    onRemove={() => removeFromCart(product.id)}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Cross-sell Section */}
                <div className="mt-12 md:mt-16 border-t pt-8 md:pt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-xl md:text-2xl font-display text-azul mb-2">
                            Combine com seus frutos do mar
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            Complete sua experiência Ocyá com nossos planos de assinatura
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <Link href="/planos/selecao-do-mar" className="group">
                            <Card className="border-0 shadow-sm hover:shadow-lg transition-all p-6 text-center group-hover:border-azul">
                                <span className="text-3xl mb-3 block">🦐</span>
                                <h3 className="font-semibold text-azul mb-1">Seleção do Mar</h3>
                                <p className="text-xs text-muted-foreground mb-3">Kit premium com variedade</p>
                                <span className="text-sm text-azul font-medium group-hover:underline">Ver plano →</span>
                            </Card>
                        </Link>
                        <Link href="/planos/peixe-essencial" className="group">
                            <Card className="border-0 shadow-sm hover:shadow-lg transition-all p-6 text-center group-hover:border-azul">
                                <span className="text-3xl mb-3 block">🐟</span>
                                <h3 className="font-semibold text-azul mb-1">Peixe Essencial</h3>
                                <p className="text-xs text-muted-foreground mb-3">Praticidade no dia a dia</p>
                                <span className="text-sm text-azul font-medium group-hover:underline">Ver plano →</span>
                            </Card>
                        </Link>
                        <Link href="/planos/monte-o-seu-assinatura" className="group">
                            <Card className="border-0 shadow-sm hover:shadow-lg transition-all p-6 text-center group-hover:border-azul">
                                <span className="text-3xl mb-3 block">✨</span>
                                <h3 className="font-semibold text-azul mb-1">Monte o Seu</h3>
                                <p className="text-xs text-muted-foreground mb-3">Personalize seu kit</p>
                                <span className="text-sm text-azul font-medium group-hover:underline">Ver plano →</span>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Delivery checkout modal */}
                {showDelivery && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md bg-white">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-azul">Selecionar entrega</h3>
                                    <button onClick={() => setShowDelivery(false)} className="p-1 hover:bg-gray-100 rounded">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                                    <Truck className="w-3 h-3" /> Todo o Brasil · A partir de 48h
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-azul mb-2 block">Seus Dados</label>
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                placeholder="Nome Completo *" 
                                                value={customerData.name}
                                                onChange={e => setCustomerData({...customerData, name: e.target.value})}
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none"
                                            />
                                            <input 
                                                type="email" 
                                                placeholder="E-mail *" 
                                                value={customerData.email}
                                                onChange={e => setCustomerData({...customerData, email: e.target.value})}
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none"
                                            />
                                            <input 
                                                type="tel" 
                                                placeholder="Telefone/WhatsApp *" 
                                                value={customerData.phone}
                                                onChange={e => setCustomerData({...customerData, phone: e.target.value})}
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none"
                                            />
                                            <input 
                                                type="text" 
                                                placeholder="CEP" 
                                                value={customerData.cep}
                                                onChange={e => setCustomerData({...customerData, cep: e.target.value})}
                                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-azul focus:border-azul outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-azul mb-2 flex items-center gap-2">
                                            <CalendarDays className="w-4 h-4" /> Data
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                                            {availableDates.map((date) => (
                                                <button
                                                    key={date.toISOString()}
                                                    onClick={() => setDeliveryDate(date)}
                                                    className={`p-2 rounded-lg border-2 transition-all text-center text-sm ${deliveryDate && date.toDateString() === deliveryDate.toDateString()
                                                        ? 'border-azul bg-azul/5 font-semibold'
                                                        : 'border-gray-200 hover:border-azul/50'
                                                        }`}
                                                >
                                                    {formatDate(date)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-azul mb-2 flex items-center gap-2">
                                            <Truck className="w-4 h-4" /> Turno
                                        </label>
                                        <div className="grid grid-cols-2 gap-3 mt-2">
                                            <button onClick={() => setDeliveryShift('manhã')} className={`p-3 rounded-lg border-2 transition-all text-center ${deliveryShift === 'manhã' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                                                <Sun className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                                                <span className="font-semibold block text-sm">Manhã</span>
                                                <span className="text-xs text-muted-foreground">8h-12h</span>
                                            </button>
                                            <button onClick={() => setDeliveryShift('tarde')} className={`p-3 rounded-lg border-2 transition-all text-center ${deliveryShift === 'tarde' ? 'border-azul bg-azul/5' : 'border-gray-200 hover:border-azul/50'}`}>
                                                <Moon className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                                                <span className="font-semibold block text-sm">Tarde</span>
                                                <span className="text-xs text-muted-foreground">16h-20h</span>
                                            </button>
                                        </div>
                                    </div>

                                    <Separator />
                                      <div className="flex justify-between font-semibold">
                                          <span>Total de Itens</span>
                                          <span className="text-azul">{cartItemsCount}</span>
                                      </div>

                                    <Button 
                                        onClick={handleSubmitOrder}
                                        disabled={!deliveryDate || !customerData.name || !customerData.phone || !customerData.email || isSubmitting} 
                                        className="w-full bg-azul hover:bg-azul-claro" 
                                        title={!deliveryDate ? 'Selecione uma data' : ''}
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        {isSubmitting ? 'Enviando...' : 'Confirmar pedido'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Mobile: Mini-carrinho flutuante */}
                {cartItemsCount > 0 && (
                    <div className="fixed bottom-4 left-4 right-20 lg:hidden z-40">
                        <div className="bg-azul text-white rounded-xl shadow-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 rounded-full p-2">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm opacity-80">{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}</span>
                                      <p className="font-bold">{cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'}</p>
                                </div>
                            </div>
                            <Button size="sm" className="bg-white text-azul hover:bg-white/90" onClick={() => setShowDelivery(true)}>
                                Finalizar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function ProductCard({ product, quantity, onAdd, onRemove }: {
    product: MerchandiseProduct
    quantity: number
    onAdd: () => void
    onRemove: () => void
}) {
    const categoryLabel = {
        'vestuario': 'Vestuário',
        'acessorios': 'Acessórios',
        'cozinha': 'Cozinha',
        'conservas-avulsas': 'Conservas'
    }[product.category] || product.category

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Card className="h-full flex flex-col overflow-hidden group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 py-0">
                {/* Image Area */}
                <div className="aspect-[4/3] md:aspect-[4/3] bg-azul/5 flex items-center justify-center relative overflow-hidden">
                    {/* Category badge */}
                    <Badge variant="secondary" className="absolute top-2 left-2 md:top-3 md:left-3 text-[10px] md:text-xs bg-white/90 text-azul">
                        {categoryLabel}
                    </Badge>

                    {/* Placeholder icon */}
                    <div className="text-center text-azul/30 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-4xl md:text-6xl">
                            {product.category === 'vestuario' && '👕'}
                            {product.category === 'acessorios' && '🎒'}
                            {product.category === 'cozinha' && '🍳'}
                            {product.category === 'conservas-avulsas' && '🥫'}
                        </span>
                    </div>

                    {/* Quick add overlay on hover - desktop only */}
                    {quantity === 0 && (
                        <div className="absolute inset-0 bg-azul/0 group-hover:bg-azul/10 transition-colors duration-300 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); onAdd(); }}
                                className="bg-azul hover:bg-azul-claro shadow-lg"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Adicionar
                            </Button>
                        </div>
                    )}
                </div>

                <CardContent className="flex-1 flex flex-col pt-3 md:pt-4 px-3 md:px-4 pb-3 md:pb-4">
                    {/* Product name */}
                    <h3 className="font-semibold text-foreground text-sm md:text-base mb-1 line-clamp-2 group-hover:text-azul transition-colors">
                        {product.name}
                    </h3>

                    {/* Description - desktop only */}
                    <p className="text-xs md:text-sm text-muted-foreground flex-1 mb-3 line-clamp-2 hidden md:block">
                        {product.description}
                    </p>

                    {/* Price and actions */}
                    <div className="mt-auto">
                        {/* Price */}
                         
 
                         {/* Actions */}
                        {quantity > 0 ? (
                            <div className="flex items-center justify-between bg-azul/5 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={onRemove}>
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="w-6 text-center font-bold text-azul">{quantity}</span>
                                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full" onClick={onAdd}>
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
<span className="font-bold text-azul text-sm">
                                     {quantity} {quantity === 1 ? 'item' : 'itens'}
                                 </span>
                            </div>
                        ) : (
                            <Button
                                onClick={onAdd}
                                size="sm"
                                className="w-full bg-azul hover:bg-azul-claro text-xs md:text-sm h-9 md:h-10 md:hidden"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                Adicionar
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
