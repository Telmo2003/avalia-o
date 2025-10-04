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
  isManualBodyFat: boolean
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

// Base de exercícios expandida por grupo muscular
const exerciseDatabase = {
  peito: [
    // Exercícios livres / pesos livres
    'Supino plano (barra)',
    'Supino plano (halteres)',
    'Supino inclinado (barra)',
    'Supino inclinado (halteres)',
    'Supino declinado (barra)',
    'Supino declinado (halteres)',
    'Crucifixo plano (halteres)',
    'Crucifixo inclinado (halteres)',
    'Crucifixo declinado (halteres)',
    'Flexões (tradicional)',
    'Flexões inclinada',
    'Flexões declinada',
    'Flexões com carga',
    'Flexões explosivas / pliométricas',
    // Máquinas / cabos
    'Supino máquina (plano)',
    'Supino máquina (inclinado)',
    'Supino máquina (declinado)',
    'Crossover no cabo (alto → baixo)',
    'Crossover no cabo (baixo → alto)',
    'Crossover no cabo (horizontal)',
    'Pec deck (voador)',
    'Chest press (horizontal)',
    'Chest press (convergente)'
  ],
  costas: [
    // Exercícios livres / pesos livres
    'Puxada na barra fixa (pegada pronada)',
    'Puxada na barra fixa (pegada supinada)',
    'Puxada na barra fixa (pegada neutra)',
    'Puxada na barra fixa (pegada aberta)',
    'Puxada na barra fixa (pegada fechada)',
    'Barra fixa com peso adicional',
    'Remada curvada (barra)',
    'Remada curvada (halteres)',
    'Remada unilateral com halter',
    'Remada cavalinho (T-bar row)',
    'Deadlift (convencional)',
    'Deadlift (sumo)',
    'Deadlift (romeno)',
    'Deadlift (stiff)',
    'Good mornings',
    'Shrugs (halteres)',
    'Shrugs (barra)',
    // Máquinas / cabos
    'Puxada frente (barra reta)',
    'Puxada frente (barra V)',
    'Puxada frente (corda)',
    'Remada baixa (barra reta)',
    'Remada baixa (triangulo)',
    'Remada baixa (corda)',
    'Remada máquina (convergente)',
    'Remada máquina (articulada)',
    'Remada máquina (hammer strength)',
    'Pulldown unilateral em cabo',
    'Pull-over (cabo)',
    'Pull-over (máquina)',
    'Shrug máquina'
  ],
  ombros: [
    // Exercícios livres / pesos livres
    'Desenvolvimento militar (barra)',
    'Desenvolvimento com halteres (sentado)',
    'Desenvolvimento com halteres (em pé)',
    'Arnold press',
    'Elevação lateral (halteres)',
    'Elevação frontal (halteres)',
    'Elevação frontal (barra)',
    'Elevação frontal (disco)',
    'Elevação posterior (halteres, inclinado)',
    'OHP (Overhead Press)',
    'Handstand push-up (peso corporal)',
    // Máquinas / cabos
    'Desenvolvimento máquina (vertical press)',
    'Elevação lateral na máquina',
    'Elevação frontal com cabo',
    'Face pull (cabo)',
    'Peck deck invertido (posterior de ombro)'
  ],
  quadriceps: [
    'Agachamento livre (barra alta)',
    'Agachamento livre (barra baixa)',
    'Front squat',
    'Overhead squat',
    'Agachamento búlgaro',
    'Lunges (avanço) – halteres',
    'Lunges (avanço) – barra',
    'Step-up em banco',
    'Sissy squat',
    'Hack squat (máquina)',
    'Leg press (horizontal)',
    'Leg press (45º)',
    'Leg press (vertical)',
    'Extensão de pernas (máquina)'
  ],
  gluteos_isquiotibiais: [
    'Peso morto romeno',
    'Peso morto stiff',
    'Glute bridge (com barra)',
    'Glute bridge (halteres)',
    'Hip thrust (barra)',
    'Hip thrust (máquina)',
    'Elevação pélvica no chão (peso corporal)',
    'Cadeira flexora (deitado)',
    'Cadeira flexora (sentado)',
    'Flexão de perna em cabo (kickback)',
    'Pull-through no cabo'
  ],
  gemeos: [
    'Elevação de gémeos em pé (peso corporal)',
    'Elevação de gémeos em pé (barra)',
    'Elevação de gémeos em pé (halteres)',
    'Elevação de gémeos sentado (halteres no colo)',
    'Elevação de gémeos sentado (máquina)',
    'Donkey calf raises',
    'Máquina gémeos (em pé)',
    'Máquina gémeos (sentado)',
    'Máquina gémeos (leg press)'
  ],
  biceps: [
    // Exercícios livres / pesos livres
    'Rosca direta (barra reta)',
    'Rosca direta (barra W)',
    'Rosca direta (halteres)',
    'Rosca alternada (halteres)',
    'Rosca martelo',
    'Rosca concentrada',
    'Rosca Scott (barra)',
    'Rosca Scott (halteres)',
    'Chin-up (barra fixa supinada, peso corporal)',
    // Máquinas / cabos
    'Rosca cabo (barra reta)',
    'Rosca cabo (corda)',
    'Rosca cabo (barra W)',
    'Rosca em banco Scott máquina',
    'Rosca unilateral cabo baixo',
    'Rosca martelo polia'
  ],
  triceps: [
    // Exercícios livres / pesos livres
    'Tríceps francês (halteres)',
    'Tríceps francês (barra W)',
    'Tríceps francês (barra reta)',
    'Tríceps testa (skull crusher)',
    'Mergulho em banco (peso corporal)',
    'Mergulho em banco (com carga)',
    'Dips em paralelas (peso corporal)',
    'Dips em paralelas (com carga)',
    'Fechamento de supino (close grip bench press)',
    // Máquinas / cabos
    'Tríceps polia barra reta',
    'Tríceps polia corda',
    'Tríceps polia barra V',
    'Kickback (halter)',
    'Kickback (cabo)',
    'Extensão unilateral polia alta'
  ],
  abdomen: [
    // Peso corporal
    'Crunch (tradicional)',
    'Crunch (reverso)',
    'Crunch (bicicleta)',
    'Crunch (oblíquo)',
    'Sit-up',
    'Prancha (frontal)',
    'Prancha (lateral)',
    'Prancha (com variações)',
    'Elevação de pernas suspenso (barra fixa)',
    'Elevação de pernas no banco',
    'Dragon flag',
    'Ab rollout (com roda)',
    'Ab rollout (com barra)',
    // Máquinas / cabos
    'Crunch máquina',
    'Crunch polia alta (joelhos no chão)',
    'Side bend polia (oblíquos)',
    'Ab twist (máquina de rotação)'
  ],
  trapezio: [
    'Encolhimento (shrug barra)',
    'Encolhimento (shrug halteres)',
    'Encolhimento (shrug máquina)',
    'Remada alta (barra)',
    'Remada alta (halteres)',
    'Remada alta (cabo)',
    'Face pull (polia)',
    'Upright row (barra reta)',
    'Upright row (barra W)'
  ],
  antebraco: [
    'Rosca punho (flexão de punho, barra)',
    'Rosca punho (flexão de punho, halteres)',
    'Extensão de punho (barra)',
    'Extensão de punho (halteres)',
    'Farmer\'s walk (halteres)',
    'Farmer\'s walk (trap bar)',
    'Pinch grip hold (segurar discos)',
    'Dead hang (na barra fixa)'
  ]
}

// Função para gerar frases inspiradoras
const generateInspirationalQuote = (nome: string) => {
  const quotes = [
    `${nome}, sua jornada de transformação começa hoje. Cada repetição te aproxima do seu melhor!`,
    `${nome}, lembre-se: músculos são construídos com consistência, não com perfeição. Vamos em frente!`,
    `${nome}, você tem o poder de esculpir o corpo dos seus sonhos. Acredite no processo!`,
    `${nome}, cada treino é um investimento no seu futuro. Sua versão mais forte te espera!`,
    `${nome}, a disciplina de hoje é a liberdade de amanhã. Continue firme na sua jornada!`,
    `${nome}, seu corpo pode aguentar. É a sua mente que você precisa convencer. Você consegue!`,
    `${nome}, grandes transformações começam com pequenos passos. Cada dia conta!`,
    `${nome}, você não está apenas construindo músculos, está construindo caráter. Siga forte!`,
    `${nome}, a dor que você sente hoje será a força que você sentirá amanhã. Persista!`,
    `${nome}, seu único limite é você mesmo. Quebre suas barreiras e alcance novos patamares!`
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
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
    bodyFat: 0,
    isManualBodyFat: false
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
    // Se foi inserido manualmente, usar o valor manual
    if (anthropometry.isManualBodyFat && anthropometry.bodyFat > 0) {
      return anthropometry.bodyFat.toFixed(1)
    }
    
    // Senão, calcular automaticamente
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
    // Criar uma nova janela com o conteúdo formatado para PDF
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const inspirationalQuote = generateInspirationalQuote(personalData.nomeCompleto || 'Atleta')
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Avaliação ${personalData.nomeCompleto}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.4; 
            position: relative;
            background-image: url('https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/68aa45c2-90d2-43c8-aab3-ac364df34a76.jpg');
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 200px 200px;
            background-attachment: fixed;
            background-opacity: 0.1;
          }
          body::before {
            content: '';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background-image: url('https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/68aa45c2-90d2-43c8-aab3-ac364df34a76.jpg');
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.05;
            z-index: -1;
            pointer-events: none;
          }
          h1 { text-align: center; color: #333; margin-bottom: 30px; }
          h2 { color: #555; border-bottom: 2px solid #ddd; padding-bottom: 5px; margin-top: 25px; }
          h3 { color: #666; margin-top: 20px; }
          .section { margin-bottom: 20px; }
          .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
          .metric { background: #f5f5f5; padding: 10px; border-radius: 5px; text-align: center; }
          .training-section { margin-bottom: 30px; }
          .nutrition-section { margin-bottom: 30px; }
          .exercise-list { margin-left: 20px; }
          .meal-item { margin-bottom: 10px; padding: 8px; background: #f9f9f9; border-radius: 4px; }
          .disclaimer { margin-top: 40px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; font-size: 12px; line-height: 1.6; }
          .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature-box { text-align: center; width: 200px; }
          .signature-line { border-bottom: 1px solid #000; margin-bottom: 5px; height: 40px; }
          .inspirational { margin-top: 30px; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; text-align: center; font-style: italic; font-size: 16px; }
          .clube-ferro { margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; border-radius: 10px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 15px; }
          .clube-ferro img { width: 40px; height: 40px; border-radius: 50%; background: white; padding: 2px; }
          .clube-ferro-text { text-align: center; }
          .clube-ferro-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
          .clube-ferro-subtitle { font-size: 14px; opacity: 0.9; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>Avaliação ${personalData.nomeCompleto || 'Aluno'}</h1>
        
        <div class="section">
          <h2>📍 Dados Pessoais</h2>
          <div class="grid">
            <div><strong>Nome:</strong> ${personalData.nomeCompleto || 'Não informado'}</div>
            <div><strong>Idade:</strong> ${personalData.idade || 'Não informado'} anos</div>
            <div><strong>Sexo:</strong> ${personalData.sexo || 'Não informado'}</div>
            <div><strong>Data de início:</strong> ${personalData.dataInicio || 'Não informado'}</div>
            <div><strong>Contato:</strong> ${personalData.contato || 'Não informado'}</div>
            <div><strong>Nível de treino:</strong> ${personalData.nivelTreino || 'Não informado'}</div>
          </div>
          ${personalData.historicoSaude ? `<div style="margin-top: 10px;"><strong>Histórico de saúde:</strong> ${personalData.historicoSaude}</div>` : ''}
          ${personalData.tempoCardio > 0 ? `<div style="margin-top: 10px;"><strong>Cardio:</strong> ${personalData.tempoCardio} min/sessão (${calculateCardioCalories()} kcal queimadas)</div>` : ''}
        </div>

        ${(anthropometry.peso || anthropometry.altura) ? `
        <div class="section">
          <h2>📊 Antropometria</h2>
          <div class="grid">
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${anthropometry.peso} kg</div>
              <div>Peso</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #10b981;">${anthropometry.altura} cm</div>
              <div>Altura</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #8b5cf6;">${calculateIMC()}</div>
              <div>IMC</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">${calculateBodyFat()}%</div>
              <div>Body Fat</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #ef4444;">${calculateTMB()} kcal</div>
              <div>TMB</div>
            </div>
          </div>
          <div class="grid" style="margin-top: 15px;">
            <div class="metric">
              <div style="font-size: 16px; font-weight: bold;">${calculateLeanMass()} kg</div>
              <div>Massa Magra</div>
            </div>
            <div class="metric">
              <div style="font-size: 16px; font-weight: bold;">${calculateFatMass()} kg</div>
              <div>Massa Gorda</div>
            </div>
            <div class="metric">
              <div style="font-size: 16px; font-weight: bold;">${calculateTDEE()} kcal</div>
              <div>TDEE</div>
            </div>
          </div>
        </div>
        ` : ''}

        ${trainingPlan.diasTreino.length > 0 ? `
        <div class="training-section">
          <h2>🏋️‍♂️ Plano de Treino</h2>
          <div class="grid">
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${trainingPlan.frequenciaSemanal}</div>
              <div>dias/semana</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #10b981;">${trainingPlan.quantidadeTreinos}</div>
              <div>treinos total</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #8b5cf6;">${trainingPlan.tempoSessao}</div>
              <div>min/sessão</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">${trainingPlan.divisao}</div>
              <div>divisão</div>
            </div>
          </div>
          
          ${trainingPlan.diasTreino.map((day, index) => `
            <h3>${day.nome}</h3>
            <div style="margin-left: 20px;">
              <div style="margin-bottom: 10px;"><strong>Grupos musculares:</strong> ${day.grupoMuscular.join(', ')}</div>
              <div class="exercise-list">
                ${day.exercicios.map(exercise => `
                  <div style="margin-bottom: 5px;">
                    <strong>${exercise.nome}</strong> - ${exercise.series}x${exercise.repeticoes} - ${exercise.descanso}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${calculateNutritionGoals() ? `
        <div class="nutrition-section">
          <h2>🍽️ Plano Nutricional</h2>
          <div class="grid">
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #10b981;">${calculateNutritionGoals()?.calories} kcal</div>
              <div>Meta Diária</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #ef4444;">${calculateNutritionGoals()?.protein}g</div>
              <div>Proteínas</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #f59e0b;">${calculateNutritionGoals()?.carbs}g</div>
              <div>Carboidratos</div>
            </div>
            <div class="metric">
              <div style="font-size: 18px; font-weight: bold; color: #3b82f6;">${calculateNutritionGoals()?.fat}g</div>
              <div>Gorduras</div>
            </div>
          </div>
          
          ${nutritionPlan.refeicoes.length > 0 ? `
            <h3>Distribuição das Refeições:</h3>
            ${nutritionPlan.refeicoes.map(meal => `
              <div class="meal-item">
                <strong>${meal.nome}</strong> - ${meal.calorias} kcal | P: ${meal.proteinas}g | C: ${meal.carboidratos}g | G: ${meal.gorduras}g
              </div>
            `).join('')}
          ` : ''}
        </div>
        ` : ''}

        ${goals.objetivoPrincipal ? `
        <div class="section">
          <h2>🎯 Objetivos</h2>
          <div><strong>Objetivo principal:</strong> ${
            goals.objetivoPrincipal === 'ganhar_massa' ? 'Ganhar massa muscular' :
            goals.objetivoPrincipal === 'perder_gordura' ? 'Perder gordura' :
            goals.objetivoPrincipal === 'recomposicao' ? 'Recomposição corporal' :
            'Manutenção'
          }</div>
          ${goals.objetivosSecundarios ? `<div style="margin-top: 10px;"><strong>Objetivos secundários:</strong> ${goals.objetivosSecundarios}</div>` : ''}
          ${goals.prazos ? `<div style="margin-top: 10px;"><strong>Prazos/metas:</strong> ${goals.prazos}</div>` : ''}
        </div>
        ` : ''}

        <div class="section">
          <h2>📈 Acompanhamento e Checkpoints</h2>
          <div class="grid">
            <div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">
              <strong>Pesagem semanal:</strong> Sempre no mesmo dia e horário (preferência de manhã antes de comer)
            </div>
            <div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">
              <strong>Fotos de progresso:</strong> A cada 2 semanas
            </div>
            <div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">
              <strong>Reavaliação de medidas:</strong> A cada 4 semanas ou mediante instrução do avaliador
            </div>
            <div style="padding: 10px; background: #f5f5f5; border-radius: 5px;">
              <strong>Testes de performance:</strong> A cada 8-12 semanas
            </div>
          </div>
        </div>

        <div class="inspirational">
          ${inspirationalQuote}
        </div>

        <div class="clube-ferro">
          <img src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/68aa45c2-90d2-43c8-aab3-ac364df34a76.jpg" alt="Clube de Ferro" />
          <div class="clube-ferro-text">
            <div class="clube-ferro-title">Vem fazer parte do Clube de Ferro no WhatsApp</div>
            <div class="clube-ferro-subtitle">Comunidade exclusiva de fitness e musculação</div>
          </div>
          <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.386"/>
          </svg>
        </div>

        <div class="disclaimer">
          <strong>DECLARAÇÃO DE RESPONSABILIDADE:</strong><br>
          Declaro, para os devidos efeitos, que tenho pleno conhecimento de que o avaliador/treinador não possui formação académica ou profissional nas áreas de Desporto, Nutrição ou Suplementação Desportiva, sendo todas as orientações, avaliações e recomendações fornecidas baseadas exclusivamente na sua experiência prática e no conhecimento adquirido de forma autónoma. Reconheço e aceito que a participação em qualquer atividade ou plano decorrente desta orientação é da minha inteira responsabilidade, isentando o referido avaliador/treinador de qualquer responsabilidade civil, profissional ou legal decorrente da utilização das informações transmitidas.
        </div>

        <div class="signatures">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Assinatura do Avaliador</strong></div>
            <div style="font-size: 12px; margin-top: 5px;">Data: ___/___/______</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div><strong>Assinatura do Avaliado</strong></div>
            <div style="font-size: 12px; margin-top: 5px;">Data: ___/___/______</div>
          </div>
        </div>

        <div class="footer">
          Processado a computador
        </div>
      </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.print()
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
            Avalia-o
          </h1>
          <p className="text-gray-600">
            Avaliação completa com planos de treino personalizados e nutrição automatizada
          </p>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 gap-1">
            <TabsTrigger value="personal" className="flex items-center gap-1 text-xs">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Pessoal</span>
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
                    <Label htmlFor="tempoCardio">Tempo de Cardio Semanal (minutos)</Label>
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
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0
                        setAnthropometry({
                          ...anthropometry, 
                          bodyFat: value,
                          isManualBodyFat: value > 0
                        })
                      }}
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
                        {anthropometry.isManualBodyFat && (
                          <div className="text-xs text-blue-500 mt-1">Manual</div>
                        )}
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
                        <strong>Pesagem semanal:</strong> Sempre no mesmo dia e horário (preferência de manhã antes de comer)
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Fotos de progresso:</strong> A cada 2 semanas
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <strong>Reavaliação de medidas:</strong> A cada 4 semanas ou mediante instrução do avaliador
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