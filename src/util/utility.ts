import { Question } from './type'

export async function extractQustions(input: string) {
  const cleanedInput = input.replace(/\n\s*\n/g, '\n').trim();

  // Split by lines starting with "number.", "number)", or "-"
  const questionSegments = cleanedInput.split(/\n(?=\d+[.\)]|-)/);

  let questionId = 0;
  return questionSegments.map(segment => {
    // Match lines starting with "number.", "number)", or "-"
    const match = segment.match(/^(\d+[.\)]|-)\s*(.*)/s);
    if (!match) return null;

    const text = match[2].trim().replace(/\n/g, ' '); // Join multi-line text into single line
    return {
      id: ++questionId, // Assign sequential ID
      text: text
    };
  }).filter(q => q !== null); // Remove invalid segments

}


export const validateQuestions = (text: string) => {
  // Remove leading/trailing whitespace and empty lines
  const lines = text.trim().split('\n').filter(line => line.trim() !== '');


  if (lines.length === 0) {
    return 'Please enter at least one question';
  }

  // Patterns for different separators
  const numberParenPattern = /^\d+\)\s*.+/ // (1) Question
  const numberDotPattern = /^\d+\.\s*.+/; // 1. Question
  const hyphenPattern = /^-\s*.+/; // - Question

  // Determine the format of the first non-empty line
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

  // Validate all lines follow the same format
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (format === 'numberParen' && !numberParenPattern.test(line)) {
      return `Line ${i + 1} does not match (number) format`;
    } else if (format === 'numberDot' && !numberDotPattern.test(line)) {
      return `Line ${i + 1} does not match number. format`;
    } else if (format === 'hyphen' && !hyphenPattern.test(line)) {
      return `Line ${i + 1} does not match hyphen (-) format`;
    }

    // Additional validation for number formats
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


export const findTotalMark = (questions: Question[]) => {
  let totalMark = 0
  for (let q of questions) {
    let mark = 0
    if (q.performance === 1) {
      mark = 5
    } else if (q.performance === 2) {
      mark = 7
    } else if (q.performance === 3) {
      mark = 10
    }

    totalMark += mark
  }

  return parseFloat((totalMark / questions.length).toFixed(1))
}


export const findTotalRating = (mark: number) => {
  if(mark >= 5 && mark < 7)return 1
  else if(mark >= 7 && mark < 10)return 2
  else return 3
}





// 1) What is JavaScript? @Explain its use in web development!
// 2) How does the event 6 loop work in JS? #Important for async code.
// 3) What are closures? -> Used in - functional programming...
// 4) Explain "this" keyword in JavaScript; show with example.
// 5) What is the difference between var, let, and const? _Key to block scope.

// 1) Find the Second Largest Element in an Array
// 2) Reverse an Array In-Place
// 3) Count Frequency of Each Element in the Array

// 1) Abstraction – Abstract Class Implementation
// 2) Inheritance – Method Access in Subclass
// 3) Polymorphism – Method Overriding

