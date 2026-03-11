import type { Metadata } from "next"
import { Kumbh_Sans } from "next/font/google"
import "./globals.css"
import { Header, Footer, WhatsAppButton } from "@/components/layout"
import { Toaster } from "sonner"

const kumbhSans = Kumbh_Sans({
  variable: "--font-kumbh",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Ocyá em Casa | Frutos do Mar em Casa",
    template: "%s | Ocyá em Casa",
  },
  description: "Receba frutos do mar frescos e preparados em casa. Assinatura de pescados do Grupo Ocyá. O mar que nos alimenta.",
  keywords: ["frutos do mar", "pescados frescos", "assinatura de peixes", "delivery de peixes", "Rio de Janeiro"],
  authors: [{ name: "Grupo Ocyá" }],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Ocyá em Casa | Frutos do Mar em Casa",
    description: "Receba frutos do mar frescos e preparados em casa. Assinatura de pescados do Grupo Ocyá.",
    url: "https://ocyaemcasa.com.br",
    siteName: "Ocyá em Casa",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${kumbhSans.variable} font-sans antialiased`}>
        <Header />
        <main className="min-h-screen pt-16 md:pt-20">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
