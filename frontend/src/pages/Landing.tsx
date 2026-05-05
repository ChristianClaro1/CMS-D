import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export function Landing() {
  const [isEntering, setIsEntering] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleEnter = async () => {
    setIsEntering(true)

    try {
      const result = await login('demo@university.edu', 'password')
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
        <div className="w-full max-w-5xl text-center">
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
            <p className="text-2xl font-light tracking-tight sm:text-4xl lg:text-5xl">Welcome to the</p>
            <h1 className="block w-full -translate-x-[150px] text-center whitespace-nowrap text-[clamp(1.8rem,5.2vw,4.35rem)] font-black italic tracking-[-0.02em] text-[#ffd233] drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] leading-none">
              COURSE MANAGEMENT SYSTEM
            </h1>

            <p className="mx-auto max-w-xl text-sm leading-6 text-white/55 sm:text-base lg:text-lg">
              A centralized administrative portal for curriculum oversight and institutional operations.
            </p>

            <div className="pt-2 sm:pt-4">
              <Button
                className="h-12 rounded-2xl bg-[#ffd233] px-8 text-sm font-extrabold tracking-[0.2em] text-[#081a66] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:scale-[1.03] sm:h-14 sm:px-10 sm:text-base"
                onPress={handleEnter}
                isLoading={isEntering}
              >
                ENTER SYSTEM
              </Button>
            </div>
          </div>

          <div className="mt-12 text-[0.65rem] font-bold tracking-[0.45em] text-white/30 sm:mt-16">
            COURSE MANAGEMENT SYSTEM
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing