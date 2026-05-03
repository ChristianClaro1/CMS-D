import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@heroui/react'
import toast from 'react-hot-toast'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const messages = ['Sign in to IAESystem', 'Welcome Back!']
  const [display, setDisplay] = useState('')
  const [msgIndex, setMsgIndex] = useState(0)

  React.useEffect(() => {
    let mounted = true
    let char = 0
    let typingInterval: number | undefined
    const type = () => {
      typingInterval = window.setInterval(() => {
        if (!mounted) return
        const msg = messages[msgIndex]
        char += 1
        setDisplay(msg.slice(0, char))
        if (char >= msg.length) {
          window.clearInterval(typingInterval)
          setTimeout(() => {
            // start deleting
            let del = msg.length
            const delInterval = window.setInterval(() => {
              if (!mounted) return
              del -= 1
              setDisplay(msg.slice(0, del))
              if (del <= 0) {
                window.clearInterval(delInterval)
                setMsgIndex((i) => (i + 1) % messages.length)
              }
            }, 40)
          }, 900)
        }
      }, 80)
    }
    type()
    return () => {
      mounted = false
      if (typingInterval) window.clearInterval(typingInterval)
    }
  }, [msgIndex])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        toast.success('Login successful!')
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="hidden md:flex flex-col justify-center pl-12">
          <div className="highlight-card float-anim max-w-md">
            <div className="text-4xl font-extrabold italic text-[#0f2147]">IAESystem</div>
            <p className="mt-3 text-sm text-[#0f2147] max-w-sm">Course Management — Academic programs, enrollment, and faculty management in one place.</p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-extrabold text-[#0f2147]"><span className="typewriter">{display}</span><span className="typewriter-caret" aria-hidden /></h2>
              <p className="mt-2 text-sm text-gray-500">Enter your credentials to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="text-xs font-semibold text-[#0f2147] uppercase">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-semibold text-[#0f2147] uppercase">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#0f2147] text-yellow-400 font-semibold hover:brightness-95"
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Demo: admin@university.edu / password</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
