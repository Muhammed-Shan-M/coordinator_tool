import { PayloadAction } from '@reduxjs/toolkit';
import { CommenPayload, Question, ReviewState, SetAnsweredPayload, CompilationWeekPayload, CompilationCommenWeekPayload, UpdateType, BasePayload, CompilationWeekQuestions, Week4Marks, WeekName, NormalWeekMarks, FirestorePreset, Presets, QuestionSet, FecthDocType } from './type'





export async function extractQustions(input: string, isPresets: boolean, allQustions: QuestionSet[]):Promise<Question[]> {

  if (isPresets) {
    const questions = allQustions.find((item) => item.id === input)?.questions.map((item, ind) => ({ id: ind + 1, text: item.text, href:item.href })) ?? []
    return questions
  }

  const cleanedInput = input.replace(/\n\s*\n/g, '\n').trim();

  const questionSegments = cleanedInput.split(/\n(?=\d+[.\)]|-)/);

  let questionId = 0;
  return questionSegments.map(segment => {
    const match = segment.match(/^(\d+[.\)]|-)\s*(.*)/s);
    if (!match) return null;

    const text = match[2].trim().replace(/\n/g, ' '); 
    return {
      id: ++questionId, 
      text: text
    };
  }).filter(q => q !== null); 

}



export function extractTextAndLinks(htmlContent: string): Question[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  let ind = 0;
  const results = Array.from(doc.querySelectorAll("p"))
  .map((p) => {
    const link = p.querySelector("a");

    if (link && link.textContent) {
      return {
        id: ++ind,
        text: link.textContent.trim(),
        href: link.href,
      };
    } else if (p.textContent) {
      const match = p.textContent.trim().match(/^\d+\.\s*(.*)/);
      if (match && match[1]) {
        return {
          id: ++ind,
          text: match[1].trim(),
        };
      }
    }

    return null;
  })
  .filter(Boolean);

  return results as Question[];
}


export const validateQuestions = (text: string, isPresets: boolean) => {

  const lines = text.trim().split('\n').filter(line => line.trim() !== '');

  if (lines.length === 0 && isPresets) {

    return 'Please select a question from the available list of sets before proceeding.'

  } else if (lines.length === 0) {

    return 'Please enter at least one question';

  }

  if (isPresets) return ""


  const numberParenPattern = /^\d+\)\s*.+/ // (1) qustion
  const numberDotPattern = /^\d+\.\s*.+/; // 1. question
  const hyphenPattern = /^-\s*.+/; // - question

  let format = null;
  if (numberParenPattern.test(lines[0])) {
    format = 'numberParen';
  } else if (numberDotPattern.test(lines[0])) {
    format = 'numberDot';
  } else if (hyphenPattern.test(lines[0])) {
    format = 'hyphen';
  } else {
    return 'Questions must start with (1), 1., or - followed by a space';
  }


  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (format === 'numberParen' && !numberParenPattern.test(line)) {
      return `Line ${i + 1} does not match (number) format`;
    } else if (format === 'numberDot' && !numberDotPattern.test(line)) {
      return `Line ${i + 1} does not match number. format`;
    } else if (format === 'hyphen' && !hyphenPattern.test(line)) {
      return `Line ${i + 1} does not match hyphen (-) format`;
    }


    if (format === 'numberParen') {
      const match = line.match(/^\((\d+)\)/);
      if (match && parseInt(match[1]) !== i + 1) {
        return `Line ${i + 1} should start with (${i + 1})`;
      }
    } else if (format === 'numberDot') {
      const match = line.match(/^(\d+)\./);
      if (match && parseInt(match[1]) !== i + 1) {
        return `Line ${i + 1} should start with ${i + 1}.`;
      }
    }
  }

  return '';
};





export const findTotalRating = (mark: number) => {
  if (mark >= 5 && mark < 7) return 1
  else if (mark >= 7 && mark < 10) return 2
  else return 3
}



const updateQuestion = (list: Question[], id: number, performance: number | null, updateType: UpdateType) => {
  const q = list.find(Item => Item.id === id)


  if (q && updateType === 'answered') {
    q.answered = true
    q.notanswered = false
    q.performance = performance
  } else if (q && updateType === 'not-answered') {
    q.answered = false
    q.notanswered = true
    q.performance = null
  } else if (q && updateType === 'remove-answered') {
    q.answered = false
    q.performance = null
  } else if (q && updateType === 'remove-notanswered') {
    q.notanswered = false
  }

}


const getQuestionList = (state: ReviewState, action: PayloadAction<CommenPayload | SetAnsweredPayload>, questionType: "practical" | "theory"): Question[] => {
  if ("practical" in state.questions) {
    return state.questions[questionType] as Question[]
  } else {
    const { weekName } = action.payload as CompilationWeekPayload | CompilationCommenWeekPayload
    return state.questions[weekName][questionType] as Question[]
  }
}


export function handleUpdate(state: ReviewState, action: PayloadAction<SetAnsweredPayload | CommenPayload>, updateType: UpdateType, performance: number | null) {

  const { id, questionType } = action.payload as BasePayload

  const list = getQuestionList(state, action, questionType)

  updateQuestion(list, id, performance ?? 0, updateType)
}

export function getWeek4ClipboardText(
  week4Marks: Week4Marks,
  week4Questions: CompilationWeekQuestions,
  feedbackText?: string
): string {
  const weekNameMap: Record<string, string> = {
    'week-1': 'C Basic Pattern',
    'week-2': 'C Logic Array',
    'week-3': 'Java OOPs',
  };



  return Object.entries(week4Questions)
    .map(([weekKey, weekQuestions]) => {
      const weekName = weekNameMap[weekKey] || weekKey;

      const practicalQs = weekQuestions.practical.map((q) => `   - ${q.text}`).join('\n');

      const theoryQs = weekQuestions.theory.map((q) => `   - ${q.text}`).join('\n');

      const marks = `P : ${week4Marks[weekKey as keyof typeof week4Marks].P}\nT : ${week4Marks[weekKey as keyof typeof week4Marks].T}`;

      return `${weekName}\npractical :\n${practicalQs}\ntheory :\n${theoryQs}\n\n${marks}`;
    })
    .join('\n\n') + (feedbackText ? `\n\nFeedback: ${feedbackText}` : '');
}



export const findTotalMark = (questions: Question[], totalQuestion: number) => {

  const halfThreShould = Math.ceil(totalQuestion / 2)
  const answerdCount = questions.length


  if (answerdCount === 0) return 0

  const avgStar = questions.reduce((sum, q) => sum + (q.performance ? q.performance : 0), 0) / answerdCount

  const perfFraction = (avgStar - 1) / 2

  const bonus = perfFraction * 5 * (answerdCount / totalQuestion)


  let finalMark = parseInt((answerdCount >= halfThreShould ? 5 + bonus : bonus).toFixed(2))

  return Math.min(finalMark, 10)

}




export function findMarks(reviewState: ReviewState, isWeek4: boolean): Week4Marks | NormalWeekMarks {
  if (isWeek4) {
    const weeks: WeekName[] = ["week-1", "week-2", "week-3"]

    const marks = weeks.reduce((acc, week) => {
      const practical = findAnsweredQuestions(isWeek4, reviewState, week, "practical")
      const theory = findAnsweredQuestions(isWeek4, reviewState, week, "theory")

      acc[week] = {
        P: findTotalMark(practical.questions, practical.totalQuestions).toString(),
        T: findTotalMark(theory.questions, theory.totalQuestions).toString(),
      }
      return acc
    }, {} as Week4Marks)

    return marks
  } else {
    const practical = findAnsweredQuestions(isWeek4, reviewState, "" as WeekName, "practical")
    const theory = findAnsweredQuestions(isWeek4, reviewState, "" as WeekName, "theory")


    const marks: NormalWeekMarks = {
      P: findTotalMark(practical.questions, practical.totalQuestions).toString(),
      T: findTotalMark(theory.questions, theory.totalQuestions).toString(),
    }

    return marks
  }
}




export function findAnsweredQuestions(isWeek4: boolean, reviewState: ReviewState, selectedSegment: WeekName | '', questionType: "theory" | "practical") {
  if (isWeek4) {
    const compilationWeek = reviewState.questions as CompilationWeekQuestions

    const questions = compilationWeek[selectedSegment][questionType].filter((q) => q.answered)
    return {
      questions: questions,
      totalQuestions: questions.length + compilationWeek[selectedSegment][questionType].filter((q) => q.notanswered).length
    }
  } else {
    const normalWeek = reviewState.questions[questionType] as Question[]
    const questions = normalWeek.filter((q) => q.answered)
    return {
      questions: questions,
      totalQuestions: questions.length + normalWeek.filter((q) => q.notanswered).length
    }
  }
}

// for conver firebase data to presets type

export const convertFirestorePresets = (docs: FirestorePreset[]): Presets => {
  return {
    theory: docs.reduce((acc, doc, i) => {
      if (doc.theoryQuestions.length > 0) {
        acc.push({
          id: `${doc.id}-theory-${i + 1}`,
          name: `Set ${i + 1}`,
          questions: doc.theoryQuestions,
        })
      }
      return acc
    }, [] as { id: string; name: string; questions: any[] }[]),

    practical: docs.reduce((acc, doc, i) => {
      if (doc.practicalQuestions.length > 0) {
        acc.push({
          id: `${doc.id}-practical-${i + 1}`,
          name: `Set ${i + 1}`,
          questions: doc.practicalQuestions,
        })
      }
      return acc
    }, [] as { id: string; name: string; questions: any[] }[]),
  }
}





// for fetch googledoc data 

export const fecthDoc = async (docLink: string): Promise<FecthDocType> => {
  try {
    const id = docLink.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (!id) throw new Error('id not tracked ')


    const url = `https://docs.google.com/document/d/${id[1]}/export?format=html`;
    const res = await fetch(url);

    if (!res.ok) throw new Error('Failed to load url : is it public?')


    const html = await res.text()

    return {
      questions: extractTextAndLinks(html),
      error: null
    }

  } catch (error: any) {
    return {
      questions: [],
      error: error.message
    }
  }
}



