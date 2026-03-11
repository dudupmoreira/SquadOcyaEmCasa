'use client'

import { PlanCardSkeleton } from '@/components/ui/skeleton'

// Skeleton loading para a seção de planos
export function PlansSectionSkeleton() {
    return (
        <section id="planos" className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                {/* Header Skeleton */}
                <div className="text-center mb-16 space-y-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                    <div className="h-10 w-72 bg-gray-200 rounded animate-pulse mx-auto" />
                    <div className="h-4 w-96 bg-gray-200 rounded animate-pulse mx-auto max-w-full" />
                </div>

                {/* Assinatura Skeleton */}
                <div className="mb-16 rounded-3xl overflow-hidden">
                    <div className="bg-azul/20 p-6 md:p-8 animate-pulse">
                        <div className="h-6 w-40 bg-white/30 rounded mb-2" />
                        <div className="w-12 h-0.5 bg-white/20 mb-3" />
                        <div className="h-4 w-64 bg-white/20 rounded" />
                    </div>
                    <div className="bg-azul/5 p-4 md:p-8">
                        {/* Mobile */}
                        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
                            <div className="flex gap-4" style={{ width: 'max-content' }}>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-[280px] flex-shrink-0">
                                        <PlanCardSkeleton compact />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Desktop */}
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <PlanCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* À La Carte Skeleton */}
                <div className="rounded-3xl overflow-hidden">
                    <div className="bg-areia/50 p-6 md:p-8 animate-pulse">
                        <div className="h-6 w-32 bg-azul/20 rounded mb-2" />
                        <div className="w-12 h-0.5 bg-azul/20 mb-3" />
                        <div className="h-4 w-56 bg-azul/10 rounded" />
                    </div>
                    <div className="bg-areia/30 p-4 md:p-8">
                        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <PlanCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
