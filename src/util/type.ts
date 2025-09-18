

export type Question = {
  id: number
  text: string
  answered?: boolean
  notanswered?: boolean
  performance?: number | null
  href?: string,
}


export interface NormalWeekQuestions {
  practical: Question[]
  theory: Question[]
}


export type CompilationWeekQuestions = {
  [weekName: string]: NormalWeekQuestions
}

export type WeekQuestions = NormalWeekQuestions | CompilationWeekQuestions


export interface ReviewState {
  studentName: string
  selectedWeek: string
  questions: WeekQuestions
}

export type WeekName = "week-1" | "week-2" | "week-3"

// for Answered qustion payload

interface NormalWeekPayload {
  id: number
  performance: number
  questionType: "practical" | "theory"
}

export interface CompilationWeekPayload extends NormalWeekPayload {
  weekName: WeekName
}

export type SetAnsweredPayload = NormalWeekPayload | CompilationWeekPayload


// commen week payload

interface NormalCommenWeekPayload {
  id: number,
  questionType: "practical" | "theory"
}

export interface CompilationCommenWeekPayload extends NormalCommenWeekPayload {
  weekName: WeekName
}

export type CommenPayload = CompilationCommenWeekPayload | NormalCommenWeekPayload


// Base payload 

export interface BasePayload {
  id: number
  questionType: "practical" | "theory"
}


// UpdateType

export type UpdateType =
  | "answered"
  | "not-answered"
  | "remove-answered"
  | "remove-notanswered"



export interface Errors {
  cBasicTheory: string,
  cBasicPractical: string,
  cLogicalTheory: string,
  cLogicalPractical: string,
  javaTheory: string,
  javaPractical: string
}


export interface Week4Marks {
  'week-1': { P: string, T: string },
  'week-2': { P: string, T: string },
  'week-3': { P: string, T: string }
}


export type Segment = {
  key: "week-1" | "week-2" | "week-3"
  label: string
}


export type NormalWeekMarks = { P: string, T: string }



export interface NormalWeekData {
  T: Question[]
  P: Question[]
}


export interface CompositeWeekData {
  week1T: Question[]
  week2T: Question[]
  week3T: Question[]
  week1P: Question[]
  week2P: Question[]
  week3P: Question[]
}



export interface FireBaseQustionSet {
  href: string,
  text: string
}


export interface FirestorePreset {
  id?: string,
  week: string,
  theoryQuestions: FireBaseQustionSet[],
  practicalQuestions: FireBaseQustionSet[]
}


export interface QuestionSet {
  id: string
  name: string
  questions: FireBaseQustionSet[]
  href?: string,
  type?: string
}

export interface Presets {
  theory: QuestionSet[]
  practical: QuestionSet[]
}


export type PresetsByWeek = {
  week1: FirestorePreset[]
  week2: FirestorePreset[]
  week3: FirestorePreset[]
}





export type ExtraQuestion = {
  id: string
  title: string
  content: string | ContentBlock[] 
  category?: string
  isAsked?: boolean
}

export type ContentBlock = {
  type: "text" | "code" | string
  value: string
  language?: string
}


export type FecthDocType = {
  questions: Question[],
  error: null | string

}