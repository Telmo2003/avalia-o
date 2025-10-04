'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, User, Calendar, Shield, ShieldCheck, UserX, UserCheck } from 'lucide-react'
import { Student, Trainer, studentService, trainerService } from '@/lib/supabase'

interface StudentSearchProps {
  currentUser: any
  currentTrainer: Trainer
}

export default function StudentSearch({ currentUser, currentTrainer }: StudentSearchProps) {
  const [searchNome, setSearchNome] = useState('')
  const [searchIdade, setSearchIdade] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      // Carregar alunos do treinador atual (ou todos se for admin/supervisor)
      const studentsData = await studentService.search(
        undefined, 
        undefined, 
        currentTrainer.role === 'trainer' ? currentUser.id : undefined
      )
      setStudents(studentsData || [])

      // Carregar treinadores se for admin ou supervisor
      if (currentTrainer.role === 'admin' || currentTrainer.role === 'supervisor') {
        const trainersData = await trainerService.getAll()
        setTrainers(trainersData || [])
      }
    } catch (err: any) {
      setError('Erro ao carregar dados: ' + err.message)
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const nome = searchNome.trim() || undefined
      const idade = searchIdade ? parseInt(searchIdade) : undefined
      const trainerId = currentTrainer.role === 'trainer' ? currentUser.id : undefined
      
      const results = await studentService.search(nome, idade, trainerId)
      setStudents(results || [])
      
      if (results?.length === 0) {
        setError('Nenhum aluno encontrado com os critérios informados')
      }
    } catch (err: any) {
      setError('Erro na busca: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateTrainerRole = async (trainerId: string, newRole: 'trainer' | 'supervisor') => {
    try {
      await trainerService.updateRole(trainerId, newRole)
      setSuccess(`Role atualizada com sucesso!`)
      loadInitialData() // Recarregar dados
    } catch (err: any) {
      setError('Erro ao atualizar role: ' + err.message)
    }
  }

  const handleToggleTrainerActive = async (trainerId: string, ativo: boolean) => {
    try {
      await trainerService.toggleActive(trainerId, ativo)
      setSuccess(`Treinador ${ativo ? 'ativado' : 'desativado'} com sucesso!`)
      loadInitialData() // Recarregar dados
    } catch (err: any) {
      setError('Erro ao alterar status: ' + err.message)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className=\"bg-red-500 text-white\"><Shield className=\"w-3 h-3 mr-1\" />Admin</Badge>
      case 'supervisor':
        return <Badge className=\"bg-orange-500 text-white\"><ShieldCheck className=\"w-3 h-3 mr-1\" />Supervisor</Badge>
      default:
        return <Badge variant=\"outline\"><User className=\"w-3 h-3 mr-1\" />Treinador</Badge>
    }
  }

  return (
    <div className=\"space-y-6\">
      {error && (
        <Alert className=\"border-red-200 bg-red-50\">
          <AlertDescription className=\"text-red-800\">{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className=\"border-green-200 bg-green-50\">
          <AlertDescription className=\"text-green-800\">{success}</AlertDescription>
        </Alert>
      )}

      {/* Busca de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle className=\"flex items-center gap-2\">
            <Search className=\"w-5 h-5\" />
            Buscar Alunos
          </CardTitle>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            <div>
              <Label htmlFor=\"search-nome\">Nome</Label>
              <Input
                id=\"search-nome\"
                value={searchNome}
                onChange={(e) => setSearchNome(e.target.value)}
                placeholder=\"Digite o nome do aluno\"
              />
            </div>
            <div>
              <Label htmlFor=\"search-idade\">Idade</Label>
              <Input
                id=\"search-idade\"
                type=\"number\"
                value={searchIdade}
                onChange={(e) => setSearchIdade(e.target.value)}
                placeholder=\"Digite a idade\"
              />
            </div>
            <div className=\"flex items-end\">
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className=\"w-full\"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Alunos Encontrados ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className=\"text-center py-8 text-gray-500\">
              <User className=\"w-12 h-12 mx-auto mb-4 opacity-50\" />
              <p>Nenhum aluno encontrado</p>
            </div>
          ) : (
            <div className=\"space-y-4\">
              {students.map((student) => (
                <div key={student.id} className=\"p-4 border rounded-lg hover:bg-gray-50\">
                  <div className=\"grid grid-cols-1 md:grid-cols-4 gap-4\">
                    <div>
                      <h3 className=\"font-semibold text-lg\">{student.nome_completo}</h3>
                      <p className=\"text-gray-600\">{student.idade} anos • {student.sexo}</p>
                    </div>
                    <div>
                      <p className=\"text-sm text-gray-600\">Contato</p>
                      <p className=\"font-medium\">{student.contato}</p>
                    </div>
                    <div>
                      <p className=\"text-sm text-gray-600\">Nível</p>
                      <Badge variant=\"outline\">{student.nivel_treino}</Badge>
                    </div>
                    <div>
                      <p className=\"text-sm text-gray-600\">Início</p>
                      <p className=\"font-medium flex items-center gap-1\">
                        <Calendar className=\"w-4 h-4\" />
                        {formatDate(student.data_inicio)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Dados antropométricos */}
                  {student.peso && student.altura && (
                    <div className=\"mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm\">
                      <div>
                        <span className=\"text-gray-600\">Peso:</span> {student.peso} kg\n                      </div>\n                      <div>\n                        <span className=\"text-gray-600\">Altura:</span> {student.altura} cm\n                      </div>\n                      <div>\n                        <span className=\"text-gray-600\">IMC:</span> {((student.peso / ((student.altura/100) ** 2))).toFixed(1)}\n                      </div>\n                      <div>\n                        <span className=\"text-gray-600\">Objetivo:</span> {student.objetivo_principal}\n                      </div>\n                    </div>\n                  )}\n                </div>\n              ))}\n            </div>\n          )}\n        </CardContent>\n      </Card>\n\n      {/* Gerenciamento de Treinadores (apenas Admin e Supervisor) */}\n      {(currentTrainer.role === 'admin' || currentTrainer.role === 'supervisor') && (\n        <Card>\n          <CardHeader>\n            <CardTitle className=\"flex items-center gap-2\">\n              <Shield className=\"w-5 h-5\" />\n              Gerenciar Treinadores\n            </CardTitle>\n          </CardHeader>\n          <CardContent>\n            {trainers.length === 0 ? (\n              <div className=\"text-center py-8 text-gray-500\">\n                <User className=\"w-12 h-12 mx-auto mb-4 opacity-50\" />\n                <p>Nenhum treinador encontrado</p>\n              </div>\n            ) : (\n              <div className=\"space-y-4\">\n                {trainers.map((trainer) => (\n                  <div key={trainer.id} className=\"p-4 border rounded-lg\">\n                    <div className=\"flex justify-between items-start\">\n                      <div className=\"flex-1\">\n                        <div className=\"flex items-center gap-3 mb-2\">\n                          <h3 className=\"font-semibold text-lg\">{trainer.nome}</h3>\n                          {getRoleBadge(trainer.role)}\n                          <Badge \n                            className={trainer.ativo ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}\n                          >\n                            {trainer.ativo ? 'Ativo' : 'Inativo'}\n                          </Badge>\n                        </div>\n                        <p className=\"text-gray-600\">{trainer.email}</p>\n                        <p className=\"text-sm text-gray-500\">\n                          Criado em: {formatDate(trainer.created_at)}\n                        </p>\n                      </div>\n                      \n                      {/* Ações apenas para Admin */}\n                      {currentTrainer.role === 'admin' && trainer.id !== currentUser.id && (\n                        <div className=\"flex gap-2\">\n                          {trainer.role !== 'admin' && (\n                            <>\n                              <Select\n                                value={trainer.role}\n                                onValueChange={(value: 'trainer' | 'supervisor') => \n                                  handleUpdateTrainerRole(trainer.id, value)\n                                }\n                              >\n                                <SelectTrigger className=\"w-32\">\n                                  <SelectValue />\n                                </SelectTrigger>\n                                <SelectContent>\n                                  <SelectItem value=\"trainer\">Treinador</SelectItem>\n                                  <SelectItem value=\"supervisor\">Supervisor</SelectItem>\n                                </SelectContent>\n                              </Select>\n                              \n                              <Button\n                                variant={trainer.ativo ? \"destructive\" : \"default\"}\n                                size=\"sm\"\n                                onClick={() => handleToggleTrainerActive(trainer.id, !trainer.ativo)}\n                              >\n                                {trainer.ativo ? (\n                                  <><UserX className=\"w-4 h-4 mr-1\" />Desativar</>\n                                ) : (\n                                  <><UserCheck className=\"w-4 h-4 mr-1\" />Ativar</>\n                                )}\n                              </Button>\n                            </>\n                          )}\n                        </div>\n                      )}\n                      \n                      {/* Ações para Supervisor (apenas ativar/desativar treinadores) */}\n                      {currentTrainer.role === 'supervisor' && trainer.role === 'trainer' && (\n                        <Button\n                          variant={trainer.ativo ? \"destructive\" : \"default\"}\n                          size=\"sm\"\n                          onClick={() => handleToggleTrainerActive(trainer.id, !trainer.ativo)}\n                        >\n                          {trainer.ativo ? (\n                            <><UserX className=\"w-4 h-4 mr-1\" />Desativar</>\n                          ) : (\n                            <><UserCheck className=\"w-4 h-4 mr-1\" />Ativar</>\n                          )}\n                        </Button>\n                      )}\n                    </div>\n                  </div>\n                ))}\n              </div>\n            )}\n          </CardContent>\n        </Card>\n      )}\n    </div>\n  )\n}