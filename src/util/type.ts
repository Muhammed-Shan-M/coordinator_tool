

export type Question = {
    id: number,
    text: string,
    answered?: boolean,
    notanswered?: boolean
    performance?: number | null
}

export interface ReviewState {
    studentName: string,
    selectedWeek: string,
    practicalQuestion: Question[]
    theoryQuestion: Question[]
}


export interface SetAnsweredPayload {
  id: number;
  performance: number;
  qustionType: string
}

export interface CommenPayload {
  id:number,
  qustionType: string
}