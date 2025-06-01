'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

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
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create account</CardTitle>
        <CardDescription className="text-center">
          Join Vault to start buying and selling collectibles
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleInputChange('username')}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange('password')}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
            
            {formData.password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
                        getPasswordStrengthColor(passwordStrength.score)
                      )}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">
                    {getPasswordStrengthText(passwordStrength.score)}
                  </span>
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((item, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
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
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-xs text-red-600">Passwords do not match</p>
            )}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Passwords match
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="terms" className="text-sm leading-5">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
