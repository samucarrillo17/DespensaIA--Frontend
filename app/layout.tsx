import { Geist_Mono, DM_Sans, Young_Serif } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toast"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const youngSerif = Young_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-young-serif",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        dmSans.variable,
        youngSerif.variable,
        fontMono.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
