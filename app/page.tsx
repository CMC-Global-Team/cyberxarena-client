import { AnimatedLoginForm } from "@/components/animated-login-form"
import { CyberXTitle, FloatingSubtitle } from "@/components/animations/text-animations"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <CyberXTitle />
        <div className="text-center mb-8">
          <FloatingSubtitle 
            text="Hệ thống quản lý quán net" 
            className="text-muted-foreground text-lg"
          />
        </div>
        <AnimatedLoginForm />
      </div>
    </div>
  )
}
