'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-md bg-gray-200',
                className
            )}
        />
    )
}

// Skeleton para PlanCard
export function PlanCardSkeleton({ compact = false }: { compact?: boolean }) {
    if (compact) {
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="aspect-[16/9] rounded-none" />
                <div className="p-3 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-8 w-full mt-2" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="aspect-[4/3] rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}

// Skeleton para Step do Configurador
export function StepSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4 justify-center py-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </div>
    )
}

// Skeleton para Header da Página
export function HeaderSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-3 w-32" />
        </div>
    )
}
