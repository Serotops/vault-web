'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface RegisterFormProps {
  className?: string
  redirectTo?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
}

export function RegisterForm({ className, redirectTo = '/' }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError('') // Clear error when user starts typing
  }

  const validateForm = (): string | null => {
    if (!formData.email || !formData.username || !formData.firstName || 
        !formData.lastName || !formData.password || !formData.confirmPassword) {
      return 'All fields are required'
    }

    if (formData.username.length < 3) {
      return 'Username must be at least 3 characters long'
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }

    if (!agreedToTerms) {
      return 'You must agree to the Terms of Service and Privacy Policy'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (!password) return { score: 0, feedback: [] }
    
    let score = 0
    const feedback: string[] = []
    
    if (password.length >= 8) score++
    else feedback.push('At least 8 characters')
    
    if (/[a-z]/.test(password)) score++
    else feedback.push('One lowercase letter')
    
    if (/[A-Z]/.test(password)) score++
    else feedback.push('One uppercase letter')
    
    if (/\d/.test(password)) score++
    else feedback.push('One number')
    
    if (/[^a-zA-Z\d]/.test(password)) score++
    else feedback.push('One special character')
    
    return { score, feedback }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }    setIsLoading(true)
    setError('')

    try {
      await register({
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        acceptTerms: agreedToTerms
      })
      router.push(redirectTo)
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500'
    if (score < 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Weak'
    if (score < 4) return 'Medium'
    return 'Strong'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4">
          <div className="text-sm text-red-700 font-medium">
            ❌ {error}
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-slate-700 font-medium mb-2 block">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-slate-700 font-medium mb-2 block">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <Label htmlFor="username" className="text-slate-700 font-medium mb-2 block">
            Username
          </Label>
          <Input
            id="username"
            placeholder="Choose a unique username"
            value={formData.username}
            onChange={handleInputChange('username')}
            required
            disabled={isLoading}
            className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-slate-700 font-medium mb-2 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleInputChange('email')}
            required
            disabled={isLoading}
            className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-slate-700 font-medium mb-2 block">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-4 hover:bg-transparent text-slate-500 hover:text-slate-700"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  {getPasswordStrengthText(passwordStrength.score)}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <ul className="text-xs text-slate-600 space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword" className="text-slate-700 font-medium mb-2 block">
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
              disabled={isLoading}
              className="h-12 rounded-xl border-slate-200 bg-white/50 backdrop-blur-sm focus:border-blue-500 focus:ring-blue-500/20 transition-all pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-4 hover:bg-transparent text-slate-500 hover:text-slate-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className="mt-2">
              {formData.password !== formData.confirmPassword ? (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Passwords do not match
                </p>
              ) : (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            disabled={isLoading}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed text-slate-600">
            I agree to the{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
              Privacy Policy
            </a>
          </Label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="space-y-4">
        <Button 
          type="submit" 
          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading || !agreedToTerms}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating Account...' : 'Create Your Vault Account'}
        </Button>
      </div>
    </form>
  );
}
