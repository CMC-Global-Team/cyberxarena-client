import { AnimatedLoginForm } from "@/components/animated-login-form"
import { SimpleTitle } from "@/components/simple-title"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <SimpleTitle />
        <p className="text-muted-foreground text-center mb-8 text-lg">
          Hệ thống quản lý quán net
        </p>
        <AnimatedLoginForm />
      </div>
    </div>
  )
}
