import { AnimatedLoginForm } from "@/components/animated-login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-mono bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            CyberX Arena
          </h1>
          <p className="text-gray-300">Hệ thống quản lý quán net</p>
        </div>
        <AnimatedLoginForm />
      </div>
    </div>
  )
}
