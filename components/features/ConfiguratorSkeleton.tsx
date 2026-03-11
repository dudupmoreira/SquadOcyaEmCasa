'use client'

import { Skeleton, StepSkeleton, HeaderSkeleton } from '@/components/ui/skeleton'

// Skeleton loading para o configurador de planos
export function ConfiguratorSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-3xl">
            {/* Header Skeleton */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>

                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                            <Skeleton className="w-6 h-6 rounded-full" />
                            {i < 5 && <Skeleton className="w-8 h-0.5" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Skeleton */}
            <StepSkeleton />

            {/* Desktop Navigation Skeleton */}
            <div className="hidden md:flex items-center justify-between mt-6">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-28" />
            </div>

            {/* Mobile Sticky Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex items-center justify-between gap-3 md:hidden">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-20" />
            </div>
        </div>
    )
}
