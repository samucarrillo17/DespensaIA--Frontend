import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear cuenta | Despensa IA",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#f6fffc] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm />
      </div>
    </div>
  )
}
