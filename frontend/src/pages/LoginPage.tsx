import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, Mail, Lock, Users, GraduationCap, ClipboardList, ArrowLeft, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useRole, type Role } from '@/contexts/RoleContext'

const validRoles: Role[] = ['Admin', 'Curriculum Committee', 'Department Chair', 'Registrar']

const roleOptions = [
  { value: 'Admin', title: 'SYSTEM ADMIN', description: 'Full architectural oversight & IAM control', icon: ShieldAlert },
  { value: 'Curriculum Committee', title: 'CURRICULUM COMMITTEE', description: 'Manage proposals & prerequisite chains', icon: GraduationCap },
  { value: 'Department Chair', title: 'DEPARTMENT CHAIR', description: 'Faculty allocation & workload monitoring', icon: Users },
  { value: 'Registrar', title: 'REGISTRAR', description: 'Section capacity & academic records', icon: ClipboardList },
] as const

function normalizeRole(role?: string): Role {
  return validRoles.includes(role as Role) ? (role as Role) : 'Admin'
}

export function LoginPage() {
  const [isEntering, setIsEntering] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role>('Admin')
  const navigate = useNavigate()
  const { login, signUp } = useAuth()
  const { setRole } = useRole()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEntering(true)

    try {
      const result = authMode === 'signup'
        ? await signUp(email, password, selectedRole, fullName)
        : await login(email, password)

      if (!result.success) {
        toast.error(result.error || 'Unable to enter the system')
        return
      }

      if (authMode === 'signup' && 'requiresConfirmation' in result && result.requiresConfirmation) {
        toast.success('Account created. Check your email to confirm it, then sign in.')
        return
      }

      setRole(normalizeRole(result.user.role))
      navigate('/dashboard')
    } catch (error) {
      toast.error('Unable to enter the system')
    } finally {
      setIsEntering(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#081a66] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,35,120,0.65),_transparent_38%),linear-gradient(180deg,_#06143f_0%,_#081a66_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px] opacity-20" />

      <div className="relative flex min-h-screen items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-[340px] rounded-[2rem] bg-[#0f2147] px-8 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-[#ffd233] text-[#0a192f] shadow-[0_12px_30px_rgba(255,210,51,0.22)]">
              <KeyRound className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-black italic tracking-[-0.04em] text-white">
              {authMode === 'signup' ? 'SIGN UP' : 'LOGIN'}
            </h2>
            <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-white/35">
              {authMode === 'signup' ? 'Create your administrative account' : 'Please sign in to continue'}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#ffd233]" htmlFor="fullName">
                  Full Name
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Maria Santos"
                    required
                    className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#ffd233]/40 focus:bg-white/10"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#ffd233]" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@university.edu"
                  required
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#ffd233]/40 focus:bg-white/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#ffd233]" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 pl-11 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#ffd233]/40 focus:bg-white/10"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.28em] text-[#ffd233]">
                  Assigned Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value as Role)}
                  className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#ffd233]/40 focus:bg-white/10"
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value} className="bg-[#11234F] text-white">
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isEntering}
            className="mt-6 h-12 w-full rounded-2xl bg-[#ffd233] text-xs font-black uppercase tracking-[0.28em] text-[#0a192f] shadow-[0_14px_34px_rgba(255,210,51,0.22)] transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isEntering ? 'LOADING...' : authMode === 'signup' ? 'SIGN UP' : 'SIGN IN'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-[0.6rem] font-bold uppercase tracking-[0.3em] text-white/25">
              OR
            </div>
          </div>

          <div className="space-y-3 text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
              className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-white/70 transition-colors hover:text-[#ffd233]"
            >
              {authMode === 'signup' ? 'Already have an account? Sign in' : 'Create new account'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-[0.58rem] font-black uppercase tracking-[0.35em] text-white/20 transition-colors hover:text-white/50"
            >
              Back to welcome
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="sr-only"
          >
            <ArrowLeft />
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage