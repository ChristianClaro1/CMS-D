import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export function Landing() {
  const [isEntering, setIsEntering] = useState(false)
  const [email, setEmail] = useState('maria.santos@university.edu')
  const [password, setPassword] = useState('password123')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEntering(true)

    try {
      const result = await login(email, password)
      if (!result.success) {
        toast.error(result.error || 'Unable to enter the system')
        return
      }

      navigate('/user-roles')
    } catch (error) {
      toast.error('Unable to enter the system')
    } finally {
      setIsEntering(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#081a66] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,209,51,0.14),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(180deg,_#081a66_0%,_#07124b_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] opacity-10" />
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-[#ffd233]/12 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-white/8 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/8 shadow-[0_30px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:grid-cols-[1.15fr_0.95fr]">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,_rgba(8,26,102,0.92)_0%,_rgba(7,18,75,0.98)_100%)] p-10 lg:flex">
            <div className="absolute -left-20 top-8 h-56 w-56 rounded-full bg-[#ffd233]/18 blur-3xl" />
            <div className="absolute -bottom-16 right-4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-white/45">Welcome to the</p>
              <h1 className="max-w-md text-[clamp(2.8rem,5vw,5rem)] font-black italic leading-[0.92] tracking-[-0.03em] text-[#ffd233] drop-shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
                Course Management System
              </h1>
              <p className="max-w-lg text-base leading-7 text-white/65">
                A centralized administrative portal for curriculum oversight and institutional operations.
              </p>
            </div>

            <div className="relative space-y-4 text-sm text-white/55">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#ffd233]">Role-based</div>
                  <div className="mt-2 text-white/80">Secure access for curriculum and admin workflows.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#ffd233]">Connected</div>
                  <div className="mt-2 text-white/80">Built to work with the deployed backend API.</div>
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-center bg-[#f7f9ff] px-6 py-10 sm:px-10 lg:px-12">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 rounded-[1.75rem] border border-[#dce6f4] bg-white p-8 shadow-[0_18px_50px_rgba(8,26,102,0.12)]">
              <div className="space-y-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f2147]/45 lg:hidden">Course Management System</p>
                <h2 className="text-3xl font-black italic tracking-tight text-[#0f2147]">Sign in</h2>
                <p className="text-sm leading-6 text-slate-500">
                  Use your CMS credentials to access the system.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-600" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe4f2] bg-[#f8fbff] px-4 py-3 text-sm text-[#0f2147] outline-none transition focus:border-[#0f2147] focus:bg-white"
                    placeholder="you@university.edu"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-slate-600" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-[#dbe4f2] bg-[#f8fbff] px-4 py-3 text-sm text-[#0f2147] outline-none transition focus:border-[#0f2147] focus:bg-white"
                    placeholder="Your password"
                    required
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e8eef8] bg-[#f7f9ff] px-4 py-3 text-sm text-slate-600">
                Demo login: <span className="font-semibold text-[#0f2147]">maria.santos@university.edu</span> / <span className="font-semibold text-[#0f2147]">password123</span>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-2xl bg-[#0f2147] px-8 text-sm font-extrabold tracking-[0.2em] text-[#ffd233] shadow-[0_18px_50px_rgba(15,33,71,0.24)] transition-transform duration-200 hover:scale-[1.02] sm:h-14 sm:text-base"
                isLoading={isEntering}
              >
                ENTER SYSTEM
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Landing