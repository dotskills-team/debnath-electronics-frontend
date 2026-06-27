/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { loginUser } from '@/utils/loginUser'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import logo from "../../../public/assets/debnath-electronics-logo.jpeg"

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginPageProps {
  onSwitchToSignup?: () => void
  onSwitchToForgot?: () => void
}

export default function LoginForm({ onSwitchToForgot }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useUser()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    const res = await loginUser(data)

    if (res.success) {
      login(res.user.user)
      if (res.user.user.role === 'SUPER_ADMIN') {
        router.push('/staff/dashboard/superadmin')
      } else if (
        res.user.user.role === 'CUSTOMER' ||
        res.user.user.role === 'GENERALSTAFF'
      ) {
        router.push('/staff/dashboard')
      } else if (
        res.user.user.role === 'MANAGER' ||
        res.user.user.role === 'MODERATOR' ||
        res.user.user.role === 'ADMIN' ||
        res.user.user.role === 'TELLICELSS'
      ) {
        router.push('/staff/dashboard')
      } else {
        router.push('/')
      }
      toast.success('Login successful!')
      setIsLoading(false)
    } else {
      toast.error(res.message || 'Login failed!')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f20] flex">

      {/* ── Left panel — brand / decorative ── */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col items-center justify-center overflow-hidden bg-[#0f1415]">

        {/* Geometric accent lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner accents */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#c9a84c]/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#c9a84c]/30" />

          {/* Diagonal gradient stripe */}
          <div
            className="absolute -top-20 -right-20 w-125 h-125 rounded-full opacity-[0.04]"
            style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-100 h-100 rounded-full opacity-[0.06]"
            style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }}
          />

          {/* Thin horizontal rule */}
          <div className="absolute top-1/2 left-12 right-12 h-px bg-linear-to-r from-transparent via-[#c9a84c]/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-16 text-center max-w-lg">
        

          <Image
            src={logo}
            alt="Debnath Electronics"
            height={80}
            width={200}
            className="object-contain brightness-110"
          />

          <div>
            <h1 className="text-4xl font-light text-white leading-tight tracking-wide">
              Your Electronics,{' '}
              <span className="text-[#c9a84c] font-semibold">Our Expertise</span>
            </h1>
            <p className="mt-4 text-[#8a9090] text-sm leading-relaxed">
              Access your account to track orders, manage warranties, and explore
              exclusive member offers across our full range of products.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 w-full">
            {[
              { label: 'Order Tracking', desc: 'Real-time delivery updates' },
              { label: 'Warranty Management', desc: 'Digital records, always ready' },
              { label: 'Member Pricing', desc: 'Exclusive deals for registered users' },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-[#1a2020]/60 border border-[#2d3a3a] rounded-lg px-4 py-3 text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-[#8a9090] text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Image src={logo} alt="Debnath Electronics" height={50} width={140} className="object-contain" />
        </div>

        <div className="w-full max-w-100">

          {/* Heading */}
          <div className="mb-8">
            <p className="text-[#c9a84c] text-[10px] font-semibold tracking-[0.3em] uppercase mb-3">
              Account Access
            </p>
            <h2 className="text-2xl font-semibold text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-[#8a9090]">
              Sign in to your Debnath Electronics account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-semibold tracking-[0.2em] text-[#c9a84c] uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register('email')}
                className={`
                  w-full h-11 px-4 rounded-md text-sm text-white placeholder:text-[#4a5560]
                  bg-[#141a1b] border transition-all outline-none
                  focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30
                  ${errors.email ? 'border-red-500/60' : 'border-[#2d3a3a] hover:border-[#3d4f51]'}
                `}
              />
              {errors.email && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-semibold tracking-[0.2em] text-[#c9a84c] uppercase"
                >
                  Password
                </label>
                {/* <button
                  type="button"
                  onClick={() => onSwitchToForgot?.()}
                  className="text-[11px] text-[#8a9090] hover:text-[#c9a84c] transition-colors"
                >
                  Forgot password?
                </button> */}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className={`
                    w-full h-11 px-4 pr-11 rounded-md text-sm text-white placeholder:text-[#4a5560]
                    bg-[#141a1b] border transition-all outline-none
                    focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/30
                    ${errors.password ? 'border-red-500/60' : 'border-[#2d3a3a] hover:border-[#3d4f51]'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a5560] hover:text-[#c9a84c] transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye className="h-4 w-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                relative w-full h-11 mt-2 rounded-md overflow-hidden
                bg-[#c9a84c] hover:bg-[#d4b86a] active:bg-[#b8973e]
                text-white hover:cursor-pointer text-sm font-bold tracking-[0.15em] uppercase
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2
                group
              "
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f1415] border-t-transparent" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>         

         
        </div>

        {/* Footer note */}
        <p className="mt-12 text-[11px] text-[#4a5560] text-center max-w-xs">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="text-[#8a9090] hover:text-[#c9a84c] transition-colors">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#8a9090] hover:text-[#c9a84c] transition-colors">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}