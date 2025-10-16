import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-mono">CyberX Arena</h1>
          <p className="text-muted-foreground">Hệ thống quản lý quán net</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
