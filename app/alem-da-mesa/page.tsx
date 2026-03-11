import { Metadata } from 'next'
import { AlemDaMesaContent } from '@/components/features/AlemDaMesaContent'

export const metadata: Metadata = {
    title: 'Além da Mesa | Ocyá em Casa',
    description: 'Produtos exclusivos Ocyá. Vestuário, acessórios, utensílios de cozinha e conservas artesanais.',
    openGraph: {
        title: 'Além da Mesa | Ocyá em Casa',
        description: 'Produtos exclusivos Ocyá. Vestuário, acessórios, utensílios de cozinha e conservas artesanais.',
    },
}

export default function AlemDaMesaPage() {
    return <AlemDaMesaContent />
}
