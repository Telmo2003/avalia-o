'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { authService } from '@/lib/supabase'

interface AuthProps {
  onAuthSuccess: () => void
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Estados para login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  
  // Estados para registro
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerNome, setRegisterNome] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      await authService.signIn(loginEmail, loginPassword)
      setSuccess('Login realizado com sucesso!')
      onAuthSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    if (registerPassword !== confirmPassword) {
      setError('As senhas não coincidem')
      setIsLoading(false)
      return
    }
    
    if (registerPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setIsLoading(false)
      return
    }
    
    try {
      await authService.signUp(registerEmail, registerPassword, registerNome)
      setSuccess('Conta criada com sucesso! Verifique seu email para confirmar.')
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4\">
      <div className=\"w-full max-w-md\">
        <div className=\"text-center mb-8\">
          <h1 className=\"text-3xl font-bold text-gray-900 mb-2\">
            Sistema Fitness Pro
          </h1>\n          <p className=\"text-gray-600\">
            Acesso para Treinadores
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className=\"text-center\">Autenticação</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className=\"mb-4 border-red-200 bg-red-50\">
                <AlertCircle className=\"h-4 w-4 text-red-600\" />
                <AlertDescription className=\"text-red-800\">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className=\"mb-4 border-green-200 bg-green-50\">
                <AlertCircle className=\"h-4 w-4 text-green-600\" />
                <AlertDescription className=\"text-green-800\">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue=\"login\" className=\"space-y-4\">
              <TabsList className=\"grid w-full grid-cols-2\">
                <TabsTrigger value=\"login\" className=\"flex items-center gap-2\">
                  <LogIn className=\"w-4 h-4\" />
                  Login
                </TabsTrigger>
                <TabsTrigger value=\"register\" className=\"flex items-center gap-2\">
                  <UserPlus className=\"w-4 h-4\" />
                  Registrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value=\"login\">
                <form onSubmit={handleLogin} className=\"space-y-4\">
                  <div>
                    <Label htmlFor=\"login-email\">Email</Label>
                    <Input
                      id=\"login-email\"
                      type=\"email\"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder=\"seu@email.com\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"login-password\">Senha</Label>
                    <Input
                      id=\"login-password\"
                      type=\"password\"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder=\"Sua senha\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type=\"submit\" 
                    className=\"w-full\" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value=\"register\">
                <form onSubmit={handleRegister} className=\"space-y-4\">
                  <div>
                    <Label htmlFor=\"register-nome\">Nome Completo</Label>
                    <Input
                      id=\"register-nome\"
                      type=\"text\"
                      value={registerNome}
                      onChange={(e) => setRegisterNome(e.target.value)}
                      placeholder=\"Seu nome completo\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"register-email\">Email</Label>
                    <Input
                      id=\"register-email\"
                      type=\"email\"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder=\"seu@email.com\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"register-password\">Senha</Label>
                    <Input
                      id=\"register-password\"
                      type=\"password\"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder=\"Mínimo 6 caracteres\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"confirm-password\">Confirmar Senha</Label>
                    <Input
                      id=\"confirm-password\"
                      type=\"password\"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=\"Confirme sua senha\"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button 
                    type=\"submit\" 
                    className=\"w-full\" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className=\"mt-6 text-center text-sm text-gray-600\">
          <p>Conta Admin padrão:</p>
          <p className=\"font-mono bg-gray-100 p-2 rounded mt-2\">
            admin@fitness.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}