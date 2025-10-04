'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calculator, User, Activity, Target, Utensils, Calendar, TrendingUp, FileText, Dumbbell, Plus, Minus, Download } from 'lucide-react'

interface PersonalData {
  nomeCompleto: string
  idade: number
  sexo: 'masculino' | 'feminino' | ''
  dataInicio: string
  contato: string
  historicoSaude: string
  nivelTreino: 'iniciante' | 'intermediario' | 'avancado' | ''
  tempoCardio: number
}

interface Anthropometry {
  peso: number
  altura: number
  bodyFat: number
}

interface Perimeters {
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

interface Lifestyle {
  horasSono: number
  nivelStress: number
  atividadeDiaria: 'sedentario' | 'ativo' | 'muito_ativo' | ''
  alimentacaoAtual: string
  suplementacao: string
}

interface Goals {
  objetivoPrincipal: 'ganhar_massa' | 'perder_gordura' | 'recomposicao' | 'manutencao' | ''
  objetivosSecundarios: string
  prazos: string
}

interface Strength {
  supino: number
  agachamento: number
  levantamentoTerra: number
  remada: number
  abdominais: number
}

interface Exercise {
  nome: string
  series: number
  repeticoes: string
  descanso: string
  observacoes: string
}

interface TrainingDay {
  nome: string
  grupoMuscular: string[]
  exercicios: Exercise[]
}

interface TrainingPlan {
  frequenciaSemanal: number
  quantidadeTreinos: number
  divisao: string
  tempoSessao: number
  exerciciosPrioritarios: string
  observacoesTecnicas: string
  diasTreino: TrainingDay[]
}

interface Meal {
  nome: string
  calorias: number
  proteinas: number
  carboidratos: number
  gorduras: number
}

interface NutritionPlan {
  numeroRefeicoes: number
  refeicoes: Meal[]
}

// Base de exercícios predefinidos por grupo muscular
const exerciseDatabase = {
  peito: [
    'Supino reto com barra',
    'Supino inclinado com halteres',
    'Supino declinado',
    'Crucifixo com halteres',
    'Flexão de braço',
    'Supino com halteres',
    'Crossover no cabo',
    'Mergulho no paralelo'
  ],
  costas: [
    'Puxada frontal',
    'Remada curvada',
    'Remada unilateral',
    'Levantamento terra',
    'Puxada alta',
    'Remada baixa',
    'Pull-over',
    'Barra fixa'
  ],
  biceps: [
    'Rosca direta com barra',
    'Rosca alternada com halteres',
    'Rosca martelo',
    'Rosca concentrada',
    'Rosca no cabo',
    'Rosca 21',
    'Rosca scott',
    'Rosca inversa'
  ],
  triceps: [
    'Tríceps testa',
    'Tríceps francês',
    'Mergulho entre bancos',
    'Tríceps pulley',
    'Tríceps coice',
    'Supino fechado',
    'Tríceps overhead',
    'Extensão unilateral'
  ],
  ombros: [
    'Desenvolvimento com barra',
    'Desenvolvimento com halteres',
    'Elevação lateral',
    'Elevação frontal',
    'Elevação posterior',
    'Remada alta',
    'Arnold press',
    'Desenvolvimento militar'
  ],
  pernas: [
    'Agachamento livre',
    'Leg press',
    'Extensão de pernas',
    'Flexão de pernas',
    'Stiff',
    'Afundo',
    'Agachamento búlgaro',
    'Cadeira adutora'
  ],
  panturrilha: [
    'Panturrilha em pé',
    'Panturrilha sentado',
    'Panturrilha no leg press',
    'Panturrilha unilateral'
  ],
  abdomen: [
    'Abdominal supra',
    'Abdominal infra',
    'Prancha',
    'Abdominal oblíquo',
    'Elevação de pernas',
    'Russian twist',
    'Mountain climber',
    'Bicicleta'
  ]
}

export default function FitnessAssessment() {
  const [currentTab, setCurrentTab] = useState('personal')
  const [personalData, setPersonalData] = useState<PersonalData>({
    nomeCompleto: '',
    idade: 0,
    sexo: '',
    dataInicio: new Date().toISOString().split('T')[0],
    contato: '',
    historicoSaude: '',
    nivelTreino: '',
    tempoCardio: 0
  })
  
  const [anthropometry, setAnthropometry] = useState<Anthropometry>({
    peso: 0,
    altura: 0,
    bodyFat: 0
  })
  
  const [perimeters, setPerimeters] = useState<Perimeters>({
    peito: 0,
    cintura: 0,
    quadril: 0,
    bracoDireito: 0,
    bracoEsquerdo: 0,
    coxaDireita: 0,
    coxaEsquerda: 0,
    panturrilhaDireita: 0,
    panturrilhaEsquerda: 0,
    ombros: 0,
    pescoco: 0
  })
  
  const [lifestyle, setLifestyle] = useState<Lifestyle>({
    horasSono: 0,
    nivelStress: 5,
    atividadeDiaria: '',
    alimentacaoAtual: '',
    suplementacao: ''
  })
  
  const [goals, setGoals] = useState<Goals>({
    objetivoPrincipal: '',
    objetivosSecundarios: '',
    prazos: ''
  })
  
  const [strength, setStrength] = useState<Strength>({
    supino: 0,
    agachamento: 0,
    levantamentoTerra: 0,
    remada: 0,
    abdominais: 0
  })
  
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan>({
    frequenciaSemanal: 0,
    quantidadeTreinos: 0,
    divisao: '',
    tempoSessao: 0,
    exerciciosPrioritarios: '',
    observacoesTecnicas: '',
    diasTreino: []
  })

  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan>({
    numeroRefeicoes: 5,
    refeicoes: []
  })
  
  const [notes, setNotes] = useState('')

  // Cálculo automático do nível de stress baseado no sono
  useEffect(() => {
    if (lifestyle.horasSono > 0) {
      let stressLevel = 5 // padrão
      if (lifestyle.horasSono >= 7 && lifestyle.horasSono <= 10) {
        stressLevel = 2 // muito baixo stress
      } else if (lifestyle.horasSono >= 5 && lifestyle.horasSono < 7) {
        stressLevel = 7 // alto stress
      } else if (lifestyle.horasSono >= 11 && lifestyle.horasSono <= 12) {
        stressLevel = 4 // stress moderado
      } else if (lifestyle.horasSono > 12) {
        stressLevel = 8 // muito alto stress
      } else if (lifestyle.horasSono < 5) {
        stressLevel = 10 // stress extremo
      }
      
      setLifestyle(prev => ({ ...prev, nivelStress: stressLevel }))
    }
  }, [lifestyle.horasSono])

  // Cálculo de calorias queimadas no cardio
  const calculateCardioCalories = () => {
    if (personalData.tempoCardio && anthropometry.peso && personalData.idade && personalData.sexo) {
      // Fórmula baseada em MET (Metabolic Equivalent of Task)
      // Cardio moderado = 6 METs
      const met = 6
      const peso = anthropometry.peso
      const tempo = personalData.tempoCardio / 60 // converter para horas
      
      // Ajuste por sexo e idade
      let fatorAjuste = 1
      if (personalData.sexo === 'feminino') {
        fatorAjuste = 0.9
      }
      if (personalData.idade > 40) {
        fatorAjuste *= 0.95
      }
      
      const calorias = met * peso * tempo * fatorAjuste
      return Math.round(calorias)
    }
    return 0
  }

  // Análise da qualidade do sono
  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 10) {
      return { quality: 'Muito Bom', color: 'bg-green-500', description: 'Ideal para recuperação' }
    } else if (hours >= 5 && hours < 7) {
      return { quality: 'Mau', color: 'bg-red-500', description: 'Insuficiente para recuperação' }
    } else if (hours >= 11 && hours <= 12) {
      return { quality: 'Mais ou Menos', color: 'bg-yellow-500', description: 'Pode indicar overtraining' }
    } else if (hours > 12) {
      return { quality: 'Demasiado', color: 'bg-red-600', description: 'Excessivo, pode indicar problemas' }
    } else if (hours < 5) {
      return { quality: 'Péssimo', color: 'bg-red-800', description: 'Crítico para saúde' }
    }
    return { quality: 'Não avaliado', color: 'bg-gray-400', description: '' }
  }

  // Cálculos automáticos melhorados
  const calculateIMC = () => {
    if (anthropometry.peso && anthropometry.altura) {
      const alturaM = anthropometry.altura / 100
      return (anthropometry.peso / (alturaM * alturaM)).toFixed(1)
    }
    return '0'
  }

  const calculateTMB = () => {
    if (anthropometry.peso && anthropometry.altura && personalData.idade && personalData.sexo) {
      // Fórmula de Mifflin-St Jeor
      let tmb = 0
      if (personalData.sexo === 'masculino') {
        tmb = (10 * anthropometry.peso) + (6.25 * anthropometry.altura) - (5 * personalData.idade) + 5
      } else {
        tmb = (10 * anthropometry.peso) + (6.25 * anthropometry.altura) - (5 * personalData.idade) - 161
      }
      return Math.round(tmb)
    }
    return 0
  }

  const calculateTDEE = () => {
    const tmb = calculateTMB()
    if (tmb && lifestyle.atividadeDiaria) {
      const multipliers = {
        'sedentario': 1.2,
        'ativo': 1.55,
        'muito_ativo': 1.725
      }
      return Math.round(tmb * multipliers[lifestyle.atividadeDiaria])
    }
    return 0
  }

  const calculateBodyFat = () => {
    if (anthropometry.peso && anthropometry.altura && personalData.idade && personalData.sexo) {
      const imc = parseFloat(calculateIMC())
      const sexMultiplier = personalData.sexo === 'masculino' ? 1 : 0
      const bodyFat = (1.20 * imc) + (0.23 * personalData.idade) - (10.8 * sexMultiplier) - 5.4
      return Math.max(3, Math.min(50, bodyFat)).toFixed(1)
    }
    return '0'
  }

  const calculateLeanMass = () => {
    const bf = parseFloat(calculateBodyFat())
    if (anthropometry.peso && bf) {
      return (anthropometry.peso * (1 - bf / 100)).toFixed(1)
    }
    return '0'
  }

  const calculateFatMass = () => {
    const bf = parseFloat(calculateBodyFat())
    if (anthropometry.peso && bf) {
      return (anthropometry.peso * (bf / 100)).toFixed(1)
    }
    return '0'
  }

  const calculateNutritionGoals = () => {
    const tdee = calculateTDEE()
    if (!tdee || !goals.objetivoPrincipal) return null

    let calorieAdjustment = 0
    let proteinMultiplier = 2.2
    let fatPercentage = 0.25
    
    switch (goals.objetivoPrincipal) {
      case 'perder_gordura':
        calorieAdjustment = -500
        proteinMultiplier = 2.5
        fatPercentage = 0.3
        break
      case 'ganhar_massa':
        calorieAdjustment = 300
        proteinMultiplier = 2.0
        fatPercentage = 0.25
        break
      case 'recomposicao':
        calorieAdjustment = 0
        proteinMultiplier = 2.4
        fatPercentage = 0.25
        break
      case 'manutencao':
        calorieAdjustment = 0
        proteinMultiplier = 2.0
        fatPercentage = 0.25
        break
    }

    const targetCalories = tdee + calorieAdjustment
    const protein = Math.round(anthropometry.peso * proteinMultiplier)
    const fat = Math.round((targetCalories * fatPercentage) / 9)
    const carbs = Math.round((targetCalories - (protein * 4) - (fat * 9)) / 4)

    return {
      calories: targetCalories,
      protein,
      carbs,
      fat
    }
  }

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { category: 'Abaixo do peso', color: 'bg-blue-500' }
    if (imc < 25) return { category: 'Peso normal', color: 'bg-green-500' }
    if (imc < 30) return { category: 'Sobrepeso', color: 'bg-yellow-500' }
    return { category: 'Obesidade', color: 'bg-red-500' }
  }

  const getBodyFatCategory = (bf: number, sex: string) => {
    if (sex === 'masculino') {
      if (bf < 6) return { category: 'Essencial', color: 'bg-blue-500' }
      if (bf < 14) return { category: 'Atlético', color: 'bg-green-500' }
      if (bf < 18) return { category: 'Fitness', color: 'bg-green-400' }
      if (bf < 25) return { category: 'Aceitável', color: 'bg-yellow-500' }
      return { category: 'Obesidade', color: 'bg-red-500' }
    } else {
      if (bf < 14) return { category: 'Essencial', color: 'bg-blue-500' }
      if (bf < 21) return { category: 'Atlético', color: 'bg-green-500' }
      if (bf < 25) return { category: 'Fitness', color: 'bg-green-400' }
      if (bf < 32) return { category: 'Aceitável', color: 'bg-yellow-500' }
      return { category: 'Obesidade', color: 'bg-red-500' }
    }
  }

  // Funções para gerenciar plano de treino
  const addTrainingDay = () => {
    const newDay: TrainingDay = {
      nome: `Treino ${trainingPlan.diasTreino.length + 1}`,
      grupoMuscular: [],
      exercicios: []
    }
    setTrainingPlan(prev => ({
      ...prev,
      diasTreino: [...prev.diasTreino, newDay]
    }))
  }

  const updateTrainingDay = (index: number, day: TrainingDay) => {
    setTrainingPlan(prev => ({
      ...prev,
      diasTreino: prev.diasTreino.map((d, i) => i === index ? day : d)
    }))
  }

  const removeTrainingDay = (index: number) => {
    setTrainingPlan(prev => ({
      ...prev,
      diasTreino: prev.diasTreino.filter((_, i) => i !== index)
    }))
  }

  const addExercise = (dayIndex: number) => {
    const newExercise: Exercise = {
      nome: '',
      series: 3,
      repeticoes: '8-12',
      descanso: '60s',
      observacoes: ''
    }
    
    const updatedDay = {
      ...trainingPlan.diasTreino[dayIndex],
      exercicios: [...trainingPlan.diasTreino[dayIndex].exercicios, newExercise]
    }
    updateTrainingDay(dayIndex, updatedDay)
  }

  const updateExercise = (dayIndex: number, exerciseIndex: number, exercise: Exercise) => {
    const updatedDay = {
      ...trainingPlan.diasTreino[dayIndex],
      exercicios: trainingPlan.diasTreino[dayIndex].exercicios.map((e, i) => i === exerciseIndex ? exercise : e)
    }
    updateTrainingDay(dayIndex, updatedDay)
  }

  const removeExercise = (dayIndex: number, exerciseIndex: number) => {
    const updatedDay = {
      ...trainingPlan.diasTreino[dayIndex],
      exercicios: trainingPlan.diasTreino[dayIndex].exercicios.filter((_, i) => i !== exerciseIndex)
    }
    updateTrainingDay(dayIndex, updatedDay)
  }

  // Funções para gerenciar plano nutricional
  const addMeal = () => {
    const nutrition = calculateNutritionGoals()
    if (!nutrition) return

    const caloriasPorRefeicao = Math.round(nutrition.calories / nutritionPlan.numeroRefeicoes)
    const proteinasPorRefeicao = Math.round(nutrition.protein / nutritionPlan.numeroRefeicoes)
    const carbsPorRefeicao = Math.round(nutrition.carbs / nutritionPlan.numeroRefeicoes)
    const gordurasPorRefeicao = Math.round(nutrition.fat / nutritionPlan.numeroRefeicoes)

    const newMeal: Meal = {
      nome: `Refeição ${nutritionPlan.refeicoes.length + 1}`,
      calorias: caloriasPorRefeicao,
      proteinas: proteinasPorRefeicao,
      carboidratos: carbsPorRefeicao,
      gorduras: gordurasPorRefeicao
    }

    setNutritionPlan(prev => ({
      ...prev,
      refeicoes: [...prev.refeicoes, newMeal]
    }))
  }

  const updateMeal = (index: number, meal: Meal) => {
    setNutritionPlan(prev => ({
      ...prev,
      refeicoes: prev.refeicoes.map((m, i) => i === index ? meal : m)
    }))
  }

  const removeMeal = (index: number) => {
    setNutritionPlan(prev => ({
      ...prev,
      refeicoes: prev.refeicoes.filter((_, i) => i !== index)
    }))
  }

  const getTotalMealCalories = () => {
    return nutritionPlan.refeicoes.reduce((total, meal) => total + meal.calorias, 0)
  }

  const getTotalMealMacros = () => {
    return nutritionPlan.refeicoes.reduce((totals, meal) => ({
      proteinas: totals.proteinas + meal.proteinas,
      carboidratos: totals.carboidratos + meal.carboidratos,
      gorduras: totals.gorduras + meal.gorduras
    }), { proteinas: 0, carboidratos: 0, gorduras: 0 })
  }

  // Função para exportar dados
  const exportToPDF = () => {
    window.print()
  }

  const exportToText = () => {
    const report = generateReport()
    const textContent = `
RELATÓRIO DE AVALIAÇÃO FITNESS
==============================

DADOS PESSOAIS:
Nome: ${personalData.nomeCompleto}
Idade: ${personalData.idade} anos
Sexo: ${personalData.sexo}
Nível de treino: ${personalData.nivelTreino}

ANTROPOMETRIA:
Peso: ${anthropometry.peso} kg
Altura: ${anthropometry.altura} cm
IMC: ${calculateIMC()} (${report.imcCategory.category})
Body Fat: ${calculateBodyFat()}% (${report.bfCategory.category})
Massa Magra: ${calculateLeanMass()} kg
Massa Gorda: ${calculateFatMass()} kg

METABOLISMO:
TMB: ${calculateTMB()} kcal
TDEE: ${calculateTDEE()} kcal

SONO E STRESS:
Horas de sono: ${lifestyle.horasSono}h (${getSleepQuality(lifestyle.horasSono).quality})
Nível de stress: ${lifestyle.nivelStress}/10

${report.nutrition ? `
NUTRIÇÃO:
Calorias alvo: ${report.nutrition.calories} kcal
Proteínas: ${report.nutrition.protein}g
Carboidratos: ${report.nutrition.carbs}g
Gorduras: ${report.nutrition.fat}g
` : ''}

PLANO DE TREINO:
Frequência: ${trainingPlan.frequenciaSemanal} dias/semana
Quantidade de treinos: ${trainingPlan.quantidadeTreinos}
${trainingPlan.diasTreino.map(day => `
${day.nome}:
Grupos musculares: ${day.grupoMuscular.join(', ')}
Exercícios: ${day.exercicios.map(ex => `${ex.nome} - ${ex.series}x${ex.repeticoes}`).join(', ')}
`).join('')}

Data do relatório: ${new Date().toLocaleDateString('pt-BR')}
    `

    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-fitness-${personalData.nomeCompleto.replace(/\s+/g, '-').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReport = () => {
    const imc = parseFloat(calculateIMC())
    const tmb = calculateTMB()
    const tdee = calculateTDEE()
    const bodyFat = parseFloat(calculateBodyFat())
    const leanMass = parseFloat(calculateLeanMass())
    const fatMass = parseFloat(calculateFatMass())
    const nutrition = calculateNutritionGoals()
    const imcCategory = getIMCCategory(imc)
    const bfCategory = getBodyFatCategory(bodyFat, personalData.sexo)
    const sleepQuality = getSleepQuality(lifestyle.horasSono)

    return {
      imc,
      tmb,
      tdee,
      bodyFat,
      leanMass,
      fatMass,
      nutrition,
      imcCategory,
      bfCategory,
      sleepQuality
    }
  }

  const report = generateReport()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Avaliação Fitness Completo
          </h1>
          <p className="text-gray-600">
            Avaliação completa com planos de treino personalizados e nutrição automatizada
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 gap-1">
            <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Pessoais</span>
            </TabsTrigger>
            <TabsTrigger value="anthropometry" className="flex items-center gap-1 text-xs">
              <Calculator className="w-3 h-3" />
              <span className="hidden sm:inline">Antropometria</span>
            </TabsTrigger>
            <TabsTrigger value="perimeters" className="flex items-center gap-1 text-xs">
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Perímetros</span>
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span className="hidden sm:inline">Estilo</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-1 text-xs">
              <Target className="w-3 h-3" />
              <span className="hidden sm:inline">Objetivos</span>
            </TabsTrigger>
            <TabsTrigger value="strength" className="flex items-center gap-1 text-xs">
              <Activity className="w-3 h-3" />
              <span className="hidden sm:inline">Força</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-1 text-xs">
              <Dumbbell className="w-3 h-3" />
              <span className="hidden sm:inline">Treino</span>
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="flex items-center gap-1 text-xs">
              <Utensils className="w-3 h-3" />
              <span className="hidden sm:inline">Alimentação</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-1 text-xs">
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Relatório</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  📍 Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      value={personalData.nomeCompleto}
                      onChange={(e) => setPersonalData({...personalData, nomeCompleto: e.target.value})}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      value={personalData.idade || ''}
                      onChange={(e) => setPersonalData({...personalData, idade: parseInt(e.target.value) || 0})}
                      placeholder="Anos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={personalData.sexo} onValueChange={(value: 'masculino' | 'feminino') => setPersonalData({...personalData, sexo: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataInicio">Data de início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={personalData.dataInicio}
                      onChange={(e) => setPersonalData({...personalData, dataInicio: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input
                      id="contato"
                      value={personalData.contato}
                      onChange={(e) => setPersonalData({...personalData, contato: e.target.value})}
                      placeholder="Telefone ou email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nivelTreino">Nível atual de treino</Label>
                    <Select value={personalData.nivelTreino} onValueChange={(value: 'iniciante' | 'intermediario' | 'avancado') => setPersonalData({...personalData, nivelTreino: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediario">Intermediário</SelectItem>
                        <SelectItem value="avancado">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tempoCardio">Tempo de Cardio (minutos)</Label>
                    <Input
                      id="tempoCardio"
                      type="number"
                      value={personalData.tempoCardio || ''}
                      onChange={(e) => setPersonalData({...personalData, tempoCardio: parseInt(e.target.value) || 0})}
                      placeholder="Ex: 30"
                    />
                    {personalData.tempoCardio > 0 && calculateCardioCalories() > 0 && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                        <strong>Calorias queimadas:</strong> {calculateCardioCalories()} kcal
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="historico">Histórico de saúde</Label>
                  <Textarea
                    id="historico"
                    value={personalData.historicoSaude}
                    onChange={(e) => setPersonalData({...personalData, historicoSaude: e.target.value})}
                    placeholder="Lesões, patologias, medicação, limitações..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anthropometry">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  📊 Antropometria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="peso">Peso atual (kg)</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      value={anthropometry.peso || ''}
                      onChange={(e) => setAnthropometry({...anthropometry, peso: parseFloat(e.target.value) || 0})}
                      placeholder="Ex: 70.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="altura">Altura (cm)</Label>
                    <Input
                      id="altura"
                      type="number"
                      value={anthropometry.altura || ''}
                      onChange={(e) => setAnthropometry({...anthropometry, altura: parseInt(e.target.value) || 0})}
                      placeholder="Ex: 175"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bodyFat">Body Fat (%) - Opcional</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      value={anthropometry.bodyFat || ''}
                      onChange={(e) => setAnthropometry({...anthropometry, bodyFat: parseFloat(e.target.value) || 0})}
                      placeholder="Ex: 15.5"
                    />
                  </div>
                </div>
                
                {anthropometry.peso && anthropometry.altura && personalData.idade && personalData.sexo && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Cálculos Automáticos:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg text-blue-600">{calculateIMC()}</div>
                        <div className="text-gray-600">IMC</div>
                        <Badge className={`${report.imcCategory.color} text-white text-xs mt-1`}>
                          {report.imcCategory.category}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-green-600">{calculateBodyFat()}%</div>
                        <div className="text-gray-600">Body Fat</div>
                        <Badge className={`${report.bfCategory.color} text-white text-xs mt-1`}>
                          {report.bfCategory.category}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-purple-600">{calculateLeanMass()} kg</div>
                        <div className="text-gray-600">Massa Magra</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-orange-600">{calculateFatMass()} kg</div>
                        <div className="text-gray-600">Massa Gorda</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg text-red-600">{calculateTMB()} kcal</div>
                        <div className="text-gray-600">TMB</div>
                      </div>
                    </div>
                    
                    {lifestyle.atividadeDiaria && (
                      <div className="mt-4 text-center">
                        <div className="font-bold text-xl text-indigo-600">{calculateTDEE()} kcal</div>
                        <div className="text-gray-600">TDEE (Gasto Total Diário)</div>
                        <div className="text-xs text-gray-500 mt-1">
                          TMB × {lifestyle.atividadeDiaria === 'sedentario' ? '1.2' : lifestyle.atividadeDiaria === 'ativo' ? '1.55' : '1.725'} ({lifestyle.atividadeDiaria})
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="perimeters">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  📏 Perímetros Corporais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="peito">Peito (cm)</Label>
                    <Input
                      id="peito"
                      type="number"
                      step="0.1"
                      value={perimeters.peito || ''}
                      onChange={(e) => setPerimeters({...perimeters, peito: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cintura">Cintura (cm)</Label>
                    <Input
                      id="cintura"
                      type="number"
                      step="0.1"
                      value={perimeters.cintura || ''}
                      onChange={(e) => setPerimeters({...perimeters, cintura: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quadril">Quadril (cm)</Label>
                    <Input
                      id="quadril"
                      type="number"
                      step="0.1"
                      value={perimeters.quadril || ''}
                      onChange={(e) => setPerimeters({...perimeters, quadril: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pescoco">Pescoço (cm)</Label>
                    <Input
                      id="pescoco"
                      type="number"
                      step="0.1"
                      value={perimeters.pescoco || ''}
                      onChange={(e) => setPerimeters({...perimeters, pescoco: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bracoDireito">Braço Direito (cm)</Label>
                    <Input
                      id="bracoDireito"
                      type="number"
                      step="0.1"
                      value={perimeters.bracoDireito || ''}
                      onChange={(e) => setPerimeters({...perimeters, bracoDireito: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bracoEsquerdo">Braço Esquerdo (cm)</Label>
                    <Input
                      id="bracoEsquerdo"
                      type="number"
                      step="0.1"
                      value={perimeters.bracoEsquerdo || ''}
                      onChange={(e) => setPerimeters({...perimeters, bracoEsquerdo: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coxaDireita">Coxa Direita (cm)</Label>
                    <Input
                      id="coxaDireita"
                      type="number"
                      step="0.1"
                      value={perimeters.coxaDireita || ''}
                      onChange={(e) => setPerimeters({...perimeters, coxaDireita: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="coxaEsquerda">Coxa Esquerda (cm)</Label>
                    <Input
                      id="coxaEsquerda"
                      type="number"
                      step="0.1"
                      value={perimeters.coxaEsquerda || ''}
                      onChange={(e) => setPerimeters({...perimeters, coxaEsquerda: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panturrilhaDireita">Panturrilha Direita (cm)</Label>
                    <Input
                      id="panturrilhaDireita"
                      type="number"
                      step="0.1"
                      value={perimeters.panturrilhaDireita || ''}
                      onChange={(e) => setPerimeters({...perimeters, panturrilhaDireita: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="panturrilhaEsquerda">Panturrilha Esquerda (cm)</Label>
                    <Input
                      id="panturrilhaEsquerda"
                      type="number"
                      step="0.1"
                      value={perimeters.panturrilhaEsquerda || ''}
                      onChange={(e) => setPerimeters({...perimeters, panturrilhaEsquerda: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ombros">Ombros (cm)</Label>
                    <Input
                      id="ombros"
                      type="number"
                      step="0.1"
                      value={perimeters.ombros || ''}
                      onChange={(e) => setPerimeters({...perimeters, ombros: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  🧠 Estilo de Vida e Hábitos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sono">Horas de sono (média)</Label>
                    <Input
                      id="sono"
                      type="number"
                      step="0.5"
                      value={lifestyle.horasSono || ''}
                      onChange={(e) => setLifestyle({...lifestyle, horasSono: parseFloat(e.target.value) || 0})}
                      placeholder="Ex: 7.5"
                    />
                    {lifestyle.horasSono > 0 && (
                      <div className="mt-2">
                        <Badge className={`${report.sleepQuality.color} text-white text-xs`}>
                          {report.sleepQuality.quality}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">{report.sleepQuality.description}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="stress">Nível de stress (automático)</Label>
                    <Input
                      id="stress"
                      type="number"
                      min="1"
                      max="10"
                      value={lifestyle.nivelStress || ''}
                      readOnly
                      className="bg-gray-100"
                    />
                    <div className="text-xs text-gray-500 mt-1">Calculado automaticamente baseado no sono</div>
                  </div>
                  <div>
                    <Label htmlFor="atividade">Atividade diária fora do treino</Label>
                    <Select value={lifestyle.atividadeDiaria} onValueChange={(value: 'sedentario' | 'ativo' | 'muito_ativo') => setLifestyle({...lifestyle, atividadeDiaria: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário (×1.2)</SelectItem>
                        <SelectItem value="ativo">Ativo (×1.55)</SelectItem>
                        <SelectItem value="muito_ativo">Muito Ativo (×1.725)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="alimentacao">Alimentação atual</Label>
                  <Textarea
                    id="alimentacao"
                    value={lifestyle.alimentacaoAtual}
                    onChange={(e) => setLifestyle({...lifestyle, alimentacaoAtual: e.target.value})}
                    placeholder="Breve descrição dos hábitos alimentares atuais..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="suplementacao">Suplementação atual</Label>
                  <Textarea
                    id="suplementacao"
                    value={lifestyle.suplementacao}
                    onChange={(e) => setLifestyle({...lifestyle, suplementacao: e.target.value})}
                    placeholder="Suplementos utilizados atualmente..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  🎯 Objetivos do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="objetivoPrincipal">Objetivo principal</Label>
                  <Select value={goals.objetivoPrincipal} onValueChange={(value: 'ganhar_massa' | 'perder_gordura' | 'recomposicao' | 'manutencao') => setGoals({...goals, objetivoPrincipal: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o objetivo principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ganhar_massa">Ganhar massa muscular</SelectItem>
                      <SelectItem value="perder_gordura">Perder gordura</SelectItem>
                      <SelectItem value="recomposicao">Recomposição corporal</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="objetivosSecundarios">Objetivos secundários</Label>
                  <Textarea
                    id="objetivosSecundarios"
                    value={goals.objetivosSecundarios}
                    onChange={(e) => setGoals({...goals, objetivosSecundarios: e.target.value})}
                    placeholder="Ex: melhorar postura, aumentar força, resistência, estética..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="prazos">Prazos/metas</Label>
                  <Textarea
                    id="prazos"
                    value={goals.prazos}
                    onChange={(e) => setGoals({...goals, prazos: e.target.value})}
                    placeholder="Metas de curto, médio e longo prazo..."
                    rows={3}
                  />
                </div>

                {goals.objetivoPrincipal && calculateTDEE() > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">🍽️ Nutrição Planeada (Automática):</h3>
                    {report.nutrition && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="font-bold text-lg text-blue-600">{report.nutrition.calories} kcal</div>
                          <div className="text-gray-600">Calorias Alvo</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {goals.objetivoPrincipal === 'perder_gordura' && 'TDEE -500 kcal'}
                            {goals.objetivoPrincipal === 'ganhar_massa' && 'TDEE +300 kcal'}
                            {goals.objetivoPrincipal === 'recomposicao' && 'TDEE (manutenção)'}
                            {goals.objetivoPrincipal === 'manutencao' && 'TDEE (manutenção)'}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-red-600">{report.nutrition.protein}g</div>
                          <div className="text-gray-600">Proteínas</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(report.nutrition.protein / anthropometry.peso).toFixed(1)}g/kg
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-yellow-600">{report.nutrition.carbs}g</div>
                          <div className="text-gray-600">Carboidratos</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((report.nutrition.carbs * 4 / report.nutrition.calories) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-green-600">{report.nutrition.fat}g</div>
                          <div className="text-gray-600">Gorduras</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((report.nutrition.fat * 9 / report.nutrition.calories) * 100)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="strength">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  🏋️‍♂️ Avaliação de Força Inicial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="supino">Supino plano (1RM estimado) - kg</Label>
                    <Input
                      id="supino"
                      type="number"
                      step="0.5"
                      value={strength.supino || ''}
                      onChange={(e) => setStrength({...strength, supino: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="agachamento">Agachamento livre (1RM estimado) - kg</Label>
                    <Input
                      id="agachamento"
                      type="number"
                      step="0.5"
                      value={strength.agachamento || ''}
                      onChange={(e) => setStrength({...strength, agachamento: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="levantamentoTerra">Levantamento terra (1RM estimado) - kg</Label>
                    <Input
                      id="levantamentoTerra"
                      type="number"
                      step="0.5"
                      value={strength.levantamentoTerra || ''}
                      onChange={(e) => setStrength({...strength, levantamentoTerra: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="remada">Remada / Puxada - kg</Label>
                    <Input
                      id="remada"
                      type="number"
                      step="0.5"
                      value={strength.remada || ''}
                      onChange={(e) => setStrength({...strength, remada: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="abdominais">Abdominais (reps em 1 min)</Label>
                    <Input
                      id="abdominais"
                      type="number"
                      value={strength.abdominais || ''}
                      onChange={(e) => setStrength({...strength, abdominais: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {anthropometry.peso > 0 && (strength.supino > 0 || strength.agachamento > 0 || strength.levantamentoTerra > 0) && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-3">Força Relativa (kg levantado / peso corporal):</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                      {strength.supino > 0 && (
                        <div>
                          <div className="font-bold text-lg text-blue-600">{(strength.supino / anthropometry.peso).toFixed(2)}x</div>
                          <div className="text-gray-600">Supino</div>
                        </div>
                      )}
                      {strength.agachamento > 0 && (
                        <div>
                          <div className="font-bold text-lg text-green-600">{(strength.agachamento / anthropometry.peso).toFixed(2)}x</div>
                          <div className="text-gray-600">Agachamento</div>
                        </div>
                      )}
                      {strength.levantamentoTerra > 0 && (
                        <div>
                          <div className="font-bold text-lg text-purple-600">{(strength.levantamentoTerra / anthropometry.peso).toFixed(2)}x</div>
                          <div className="text-gray-600">Terra</div>
                        </div>
                      )}
                      {strength.remada > 0 && (
                        <div>
                          <div className="font-bold text-lg text-orange-600">{(strength.remada / anthropometry.peso).toFixed(2)}x</div>
                          <div className="text-gray-600">Remada</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    🏋️‍♂️ Plano de Treino Completo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="frequencia">Frequência semanal (dias)</Label>
                      <Select value={trainingPlan.frequenciaSemanal.toString()} onValueChange={(value) => setTrainingPlan({...trainingPlan, frequenciaSemanal: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0,1,2,3,4,5,6,7].map(day => (
                            <SelectItem key={day} value={day.toString()}>{day} dias</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantidadeTreinos">Quantidade de Treinos</Label>
                      <Select value={trainingPlan.quantidadeTreinos.toString()} onValueChange={(value) => setTrainingPlan({...trainingPlan, quantidadeTreinos: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 15}, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>{i} treinos</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="divisao">Divisão</Label>
                      <Select value={trainingPlan.divisao} onValueChange={(value) => setTrainingPlan({...trainingPlan, divisao: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_body">Full Body</SelectItem>
                          <SelectItem value="upper_lower">Upper/Lower</SelectItem>
                          <SelectItem value="push_pull_legs">Push/Pull/Legs</SelectItem>
                          <SelectItem value="abc">ABC (Peito-Costas-Pernas)</SelectItem>
                          <SelectItem value="abcd">ABCD</SelectItem>
                          <SelectItem value="abcde">ABCDE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tempoSessao">Tempo por sessão (min)</Label>
                      <Input
                        id="tempoSessao"
                        type="number"
                        value={trainingPlan.tempoSessao || ''}
                        onChange={(e) => setTrainingPlan({...trainingPlan, tempoSessao: parseInt(e.target.value) || 0})}
                        placeholder="Ex: 60"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Dias de Treino</h3>
                    <Button onClick={addTrainingDay} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Adicionar Dia
                    </Button>
                  </div>

                  {trainingPlan.diasTreino.map((day, dayIndex) => (
                    <Card key={dayIndex} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Input
                            value={day.nome}
                            onChange={(e) => updateTrainingDay(dayIndex, {...day, nome: e.target.value})}
                            className="font-semibold text-lg border-none p-0 h-auto"
                            placeholder="Nome do treino"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTrainingDay(dayIndex)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.keys(exerciseDatabase).map(grupo => (
                            <Badge
                              key={grupo}
                              variant={day.grupoMuscular.includes(grupo) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => {
                                const newGrupos = day.grupoMuscular.includes(grupo)
                                  ? day.grupoMuscular.filter(g => g !== grupo)
                                  : [...day.grupoMuscular, grupo]
                                updateTrainingDay(dayIndex, {...day, grupoMuscular: newGrupos})
                              }}
                            >
                              {grupo}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {day.exercicios.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 bg-gray-50 rounded-lg">
                              <div className="md:col-span-2">
                                <Label className="text-xs">Exercício</Label>
                                <Select
                                  value={exercise.nome}
                                  onValueChange={(value) => updateExercise(dayIndex, exerciseIndex, {...exercise, nome: value})}
                                >
                                  <SelectTrigger className="h-8">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {day.grupoMuscular.map(grupo => (
                                      <div key={grupo}>
                                        <div className="font-semibold text-xs text-gray-500 px-2 py-1 uppercase">
                                          {grupo}
                                        </div>
                                        {exerciseDatabase[grupo as keyof typeof exerciseDatabase].map(ex => (
                                          <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                                        ))}
                                      </div>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-xs">Séries</Label>
                                <Input
                                  type="number"
                                  value={exercise.series}
                                  onChange={(e) => updateExercise(dayIndex, exerciseIndex, {...exercise, series: parseInt(e.target.value) || 3})}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Repetições</Label>
                                <Input
                                  value={exercise.repeticoes}
                                  onChange={(e) => updateExercise(dayIndex, exerciseIndex, {...exercise, repeticoes: e.target.value})}
                                  placeholder="8-12"
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Descanso</Label>
                                <Input
                                  value={exercise.descanso}
                                  onChange={(e) => updateExercise(dayIndex, exerciseIndex, {...exercise, descanso: e.target.value})}
                                  placeholder="60s"
                                  className="h-8"
                                />
                              </div>
                              <div className="flex items-end">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeExercise(dayIndex, exerciseIndex)}
                                  className="h-8"
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => addExercise(dayIndex)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Exercício
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="exerciciosPrioritarios">Exercícios prioritários</Label>
                      <Textarea
                        id="exerciciosPrioritarios"
                        value={trainingPlan.exerciciosPrioritarios}
                        onChange={(e) => setTrainingPlan({...trainingPlan, exerciciosPrioritarios: e.target.value})}
                        placeholder="Exercícios que devem ter prioridade no treino..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="observacoesTecnicas">Observações técnicas</Label>
                      <Textarea
                        id="observacoesTecnicas"
                        value={trainingPlan.observacoesTecnicas}
                        onChange={(e) => setTrainingPlan({...trainingPlan, observacoesTecnicas: e.target.value})}
                        placeholder="Correções posturais, limitações, adaptações necessárias..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    🍽️ Plano Alimentar Personalizado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.nutrition ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="font-bold text-xl text-green-600">{report.nutrition.calories} kcal</div>
                          <div className="text-gray-600 text-sm">Meta Diária</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg text-red-600">{report.nutrition.protein}g</div>
                          <div className="text-gray-600 text-sm">Proteínas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg text-yellow-600">{report.nutrition.carbs}g</div>
                          <div className="text-gray-600 text-sm">Carboidratos</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-lg text-blue-600">{report.nutrition.fat}g</div>
                          <div className="text-gray-600 text-sm">Gorduras</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <Label htmlFor="numeroRefeicoes">Número de refeições por dia</Label>
                          <Select 
                            value={nutritionPlan.numeroRefeicoes.toString()} 
                            onValueChange={(value) => setNutritionPlan({...nutritionPlan, numeroRefeicoes: parseInt(value)})}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[3,4,5,6,7,8].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num} refeições</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={addMeal} className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Refeição
                        </Button>
                      </div>

                      {nutritionPlan.refeicoes.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Resumo das Refeições:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                            <div>
                              <div className="font-bold text-lg">{getTotalMealCalories()} kcal</div>
                              <div className="text-gray-600">Total Planejado</div>
                              <div className={`text-xs ${getTotalMealCalories() > report.nutrition.calories ? 'text-red-500' : 'text-green-500'}`}>
                                {getTotalMealCalories() > report.nutrition.calories ? '+' : ''}{getTotalMealCalories() - report.nutrition.calories} kcal da meta
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{getTotalMealMacros().proteinas}g</div>
                              <div className="text-gray-600">Proteínas</div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{getTotalMealMacros().carboidratos}g</div>
                              <div className="text-gray-600">Carboidratos</div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{getTotalMealMacros().gorduras}g</div>
                              <div className="text-gray-600">Gorduras</div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {nutritionPlan.refeicoes.map((meal, index) => (
                          <Card key={index} className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-center">
                                <Input
                                  value={meal.nome}
                                  onChange={(e) => updateMeal(index, {...meal, nome: e.target.value})}
                                  className="font-semibold border-none p-0 h-auto"
                                  placeholder="Nome da refeição"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeMeal(index)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <Label className="text-xs">Calorias</Label>
                                  <Input
                                    type="number"
                                    value={meal.calorias}
                                    onChange={(e) => updateMeal(index, {...meal, calorias: parseInt(e.target.value) || 0})}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Proteínas (g)</Label>
                                  <Input
                                    type="number"
                                    value={meal.proteinas}
                                    onChange={(e) => updateMeal(index, {...meal, proteinas: parseInt(e.target.value) || 0})}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Carboidratos (g)</Label>
                                  <Input
                                    type="number"
                                    value={meal.carboidratos}
                                    onChange={(e) => updateMeal(index, {...meal, carboidratos: parseInt(e.target.value) || 0})}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Gorduras (g)</Label>
                                  <Input
                                    type="number"
                                    value={meal.gorduras}
                                    onChange={(e) => updateMeal(index, {...meal, gorduras: parseInt(e.target.value) || 0})}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <Utensils className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Complete os dados de antropometria e objetivos para gerar o plano nutricional automaticamente.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="report">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    📋 Relatório Completo de Avaliação Fitness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dados Pessoais */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">📍 Dados Pessoais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Nome:</strong> {personalData.nomeCompleto || 'Não informado'}</div>
                      <div><strong>Idade:</strong> {personalData.idade || 'Não informado'} anos</div>
                      <div><strong>Sexo:</strong> {personalData.sexo || 'Não informado'}</div>
                      <div><strong>Data de início:</strong> {personalData.dataInicio || 'Não informado'}</div>
                      <div><strong>Contato:</strong> {personalData.contato || 'Não informado'}</div>
                      <div><strong>Nível de treino:</strong> {personalData.nivelTreino || 'Não informado'}</div>
                    </div>
                    {personalData.historicoSaude && (
                      <div className="mt-2">
                        <strong>Histórico de saúde:</strong> {personalData.historicoSaude}
                      </div>
                    )}
                    {personalData.tempoCardio > 0 && (
                      <div className="mt-2">
                        <strong>Cardio:</strong> {personalData.tempoCardio} min/sessão ({calculateCardioCalories()} kcal queimadas)
                      </div>
                    )}
                  </div>

                  {/* Antropometria */}
                  {(anthropometry.peso || anthropometry.altura) && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">📊 Antropometria</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-bold text-lg text-blue-600">{anthropometry.peso} kg</div>
                          <div className="text-gray-600 text-sm">Peso</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-bold text-lg text-green-600">{anthropometry.altura} cm</div>
                          <div className="text-gray-600 text-sm">Altura</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-bold text-lg text-purple-600">{calculateIMC()}</div>
                          <div className="text-gray-600 text-sm">IMC</div>
                          <Badge className={`${report.imcCategory.color} text-white text-xs mt-1`}>
                            {report.imcCategory.category}
                          </Badge>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="font-bold text-lg text-orange-600">{calculateBodyFat()}%</div>
                          <div className="text-gray-600 text-sm">Body Fat</div>
                          <Badge className={`${report.bfCategory.color} text-white text-xs mt-1`}>
                            {report.bfCategory.category}
                          </Badge>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="font-bold text-lg text-red-600">{calculateTMB()} kcal</div>
                          <div className="text-gray-600 text-sm">TMB</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-center">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-bold text-lg text-gray-700">{calculateLeanMass()} kg</div>
                          <div className="text-gray-600 text-sm">Massa Magra</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-bold text-lg text-gray-700">{calculateFatMass()} kg</div>
                          <div className="text-gray-600 text-sm">Massa Gorda</div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                          <div className="font-bold text-lg text-indigo-600">{calculateTDEE()} kcal</div>
                          <div className="text-gray-600 text-sm">TDEE</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sono e Stress */}
                  {lifestyle.horasSono > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">😴 Sono e Stress</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-lg">{lifestyle.horasSono}h</div>
                              <div className="text-gray-600 text-sm">Horas de sono</div>
                            </div>
                            <Badge className={`${report.sleepQuality.color} text-white`}>
                              {report.sleepQuality.quality}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-2">{report.sleepQuality.description}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="font-bold text-lg">{lifestyle.nivelStress}/10</div>
                          <div className="text-gray-600 text-sm">Nível de stress</div>
                          <div className="text-xs text-gray-500 mt-1">Calculado automaticamente baseado no sono</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Plano de Treino */}
                  {trainingPlan.diasTreino.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">🏋️‍♂️ Plano de Treino</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-bold text-lg text-blue-600">{trainingPlan.frequenciaSemanal}</div>
                          <div className="text-gray-600">dias/semana</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-bold text-lg text-green-600">{trainingPlan.quantidadeTreinos}</div>
                          <div className="text-gray-600">treinos total</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-bold text-lg text-purple-600">{trainingPlan.tempoSessao}</div>
                          <div className="text-gray-600">min/sessão</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="font-bold text-lg text-orange-600">{trainingPlan.divisao}</div>
                          <div className="text-gray-600">divisão</div>
                        </div>
                      </div>
                      
                      {trainingPlan.diasTreino.map((day, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-lg">
                          <h4 className="font-semibold text-md mb-2">{day.nome}</h4>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {day.grupoMuscular.map(grupo => (
                              <Badge key={grupo} variant="outline" className="text-xs">
                                {grupo}
                              </Badge>
                            ))}
                          </div>
                          <div className="space-y-2">
                            {day.exercicios.map((exercise, exIndex) => (
                              <div key={exIndex} className="text-sm flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium">{exercise.nome}</span>
                                <span className="text-gray-600">{exercise.series}x{exercise.repeticoes} - {exercise.descanso}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nutrição */}
                  {report.nutrition && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">🍽️ Plano Nutricional</h3>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div>
                            <div className="font-bold text-xl text-green-600">{report.nutrition.calories} kcal</div>
                            <div className="text-gray-600 text-sm">Meta Diária</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg text-red-600">{report.nutrition.protein}g</div>
                            <div className="text-gray-600 text-sm">Proteínas</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg text-yellow-600">{report.nutrition.carbs}g</div>
                            <div className="text-gray-600 text-sm">Carboidratos</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg text-blue-600">{report.nutrition.fat}g</div>
                            <div className="text-gray-600 text-sm">Gorduras</div>
                          </div>
                        </div>
                      </div>
                      
                      {nutritionPlan.refeicoes.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Distribuição das Refeições:</h4>
                          {nutritionPlan.refeicoes.map((meal, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2 text-sm">
                              <span className="font-medium">{meal.nome}</span>
                              <span className="text-gray-600">
                                {meal.calorias} kcal | P: {meal.proteinas}g | C: {meal.carboidratos}g | G: {meal.gorduras}g
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Objetivos */}
                  {goals.objetivoPrincipal && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">🎯 Objetivos</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Objetivo principal:</strong> {
                          goals.objetivoPrincipal === 'ganhar_massa' ? 'Ganhar massa muscular' :
                          goals.objetivoPrincipal === 'perder_gordura' ? 'Perder gordura' :
                          goals.objetivoPrincipal === 'recomposicao' ? 'Recomposição corporal' :
                          'Manutenção'
                        }</div>
                        {goals.objetivosSecundarios && <div><strong>Objetivos secundários:</strong> {goals.objetivosSecundarios}</div>}
                        {goals.prazos && <div><strong>Prazos/metas:</strong> {goals.prazos}</div>}
                      </div>
                    </div>
                  )}

                  {/* Notas do Personal */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">🧾 Notas do Personal Trainer</h3>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Espaço livre para anotações sobre evolução, correções de postura, ajustes alimentares, motivação do aluno, etc."
                      rows={4}
                      className="w-full"
                    />
                  </div>

                  {/* Acompanhamento */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">📈 Acompanhamento e Checkpoints</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Pesagem semanal:</strong> Sempre no mesmo dia e horário
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Fotos de progresso:</strong> A cada 2 semanas
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Reavaliação de medidas:</strong> A cada 4 semanas
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Testes de performance:</strong> A cada 8-12 semanas
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={exportToPDF} 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Imprimir PDF
                </Button>
                <Button 
                  onClick={exportToText}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar .txt
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentTab('personal')}
                >
                  Editar Dados
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}