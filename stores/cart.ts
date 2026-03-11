import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image?: string
    type: 'plan' | 'product'
    config?: {
        persons?: number
        mealsPerWeek?: number
        frequency?: 'mensal' | 'quinzenal' | 'semanal'
        restrictions?: string[]
    }
}

interface CartState {
    items: CartItem[]
    isOpen: boolean

    // Actions
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void

    // Computed
    totalItems: () => number
    totalPrice: () => number
}

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (item) => set((state) => {
                const existingItem = state.items.find(i => i.id === item.id)
                if (existingItem) {
                    return {
                        items: state.items.map(i =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    }
                }
                return { items: [...state.items, item] }
            }),

            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id),
            })),

            updateQuantity: (id, quantity) => set((state) => ({
                items: quantity <= 0
                    ? state.items.filter(item => item.id !== id)
                    : state.items.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    ),
            })),

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        }),
        {
            name: 'ocya-cart',
        }
    )
)
