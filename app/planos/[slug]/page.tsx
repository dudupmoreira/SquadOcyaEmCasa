import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPlanBySlug, allPlans } from '@/lib/plans'
import { PlanConfigurator } from '@/components/features/PlanConfigurator'

interface PlanPageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    return allPlans.map((plan) => ({
        slug: plan.slug,
    }))
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
    const { slug } = await params
    const plan = getPlanBySlug(slug)

    if (!plan) {
        return { title: 'Plano não encontrado' }
    }

    return {
        title: plan.name,
        description: plan.description,
        openGraph: {
            title: `${plan.name} | Ocyá em Casa`,
            description: plan.description,
        },
    }
}

export default async function PlanPage({ params }: PlanPageProps) {
    const { slug } = await params
    const plan = getPlanBySlug(slug)

    if (!plan) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-offwhite py-8 md:py-16">
            <div className="container mx-auto px-4">
                <PlanConfigurator plan={plan} />
            </div>
        </div>
    )
}
