import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Student {
  id: string
  created_at: string
  updated_at: string
  trainer_id: string
  
  // Dados Pessoais
  nome_completo: string
  idade: number
  sexo: 'masculino' | 'feminino'
  data_inicio: string
  contato: string
  historico_saude: string
  nivel_treino: 'iniciante' | 'intermediario' | 'avancado'
  tempo_cardio: number
  
  // Antropometria
  peso: number
  altura: number
  body_fat: number
  
  // Perímetros
  perimetros: {
    peito: number
    cintura: number
    quadril: number
    bracoDireito: number
    bracoEsquerdo: number
    coxaDireita: number
    coxaEsquerda: number
    panturrilhaDireita: number
    panturrilhaEsquerda: number
    ombros: number
    pescoco: number
  }
  
  // Estilo de vida
  horas_sono: number
  nivel_stress: number
  atividade_diaria: 'sedentario' | 'ativo' | 'muito_ativo'
  alimentacao_atual: string
  suplementacao: string
  
  // Objetivos
  objetivo_principal: 'ganhar_massa' | 'perder_gordura' | 'recomposicao' | 'manutencao'
  objetivos_secundarios: string
  prazos: string
  
  // Força
  forca: {
    supino: number
    agachamento: number
    levantamentoTerra: number
    remada: number
    abdominais: number
  }
  
  // Plano de treino
  plano_treino: any
  
  // Plano nutricional
  plano_nutricao: any
  
  // Notas
  notas: string
}

export interface Trainer {
  id: string
  created_at: string
  updated_at: string
  email: string
  nome: string
  role: 'trainer' | 'supervisor' | 'admin'
  ativo: boolean
}

// Funções para gerenciar alunos
export const studentService = {
  // Criar novo aluno
  async create(studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([studentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Buscar alunos por nome e idade
  async search(nome?: string, idade?: number, trainerId?: string) {
    let query = supabase
      .from('students')
      .select('*')
    
    if (trainerId) {
      query = query.eq('trainer_id', trainerId)
    }
    
    if (nome) {
      query = query.ilike('nome_completo', `%${nome}%`)
    }
    
    if (idade) {
      query = query.eq('idade', idade)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  
  // Buscar aluno por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // Atualizar aluno
  async update(id: string, updates: Partial<Student>) {
    const { data, error } = await supabase
      .from('students')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Deletar aluno
  async delete(id: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },
  
  // Listar todos os alunos de um treinador
  async getByTrainer(trainerId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Funções para gerenciar treinadores
export const trainerService = {
  // Criar perfil de treinador após registro
  async createProfile(userId: string, email: string, nome: string) {
    const { data, error } = await supabase
      .from('trainers')
      .insert([{
        id: userId,
        email,
        nome,
        role: 'trainer',
        ativo: true
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Buscar treinador por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },
  
  // Listar todos os treinadores (apenas admin/supervisor)
  async getAll() {
    const { data, error } = await supabase
      .from('trainers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },
  
  // Atualizar role do treinador
  async updateRole(id: string, role: 'trainer' | 'supervisor') {
    const { data, error } = await supabase
      .from('trainers')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
  
  // Ativar/desativar treinador
  async toggleActive(id: string, ativo: boolean) {
    const { data, error } = await supabase
      .from('trainers')
      .update({ ativo, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Funções de autenticação
export const authService = {
  // Login
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },
  
  // Registro
  async signUp(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome
        }
      }
    })
    
    if (error) throw error
    
    // Criar perfil de treinador
    if (data.user) {
      await trainerService.createProfile(data.user.id, email, nome)
    }
    
    return data
  },
  
  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },
  
  // Obter usuário atual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },
  
  // Obter sessão atual
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }
}