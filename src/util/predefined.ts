export const predefinedQuestionSets = [
  {
    id: "math-basics",
    name: "Mathematics Basics",
    questions: Array.from({ length: 35 }, (_, i) => `Math Basic Question ${i + 1}: What is 2 + ${i}?`),
  },
  {
    id: "science-fundamentals",
    name: "Science Fundamentals",
    questions: Array.from(
      { length: 32 },
      (_, i) => `Science Fundamental Question ${i + 1}: Explain the concept of gravity.`,
    ),
  },
  {
    id: "history-events",
    name: "World History Events",
    questions: Array.from({ length: 40 }, (_, i) => `History Event Question ${i + 1}: When did World War II end?`),
  },
  {
    id: "literature-classics",
    name: "Classic Literature",
    questions: Array.from(
      { length: 30 },
      (_, i) => `Literature Classic Question ${i + 1}: Who wrote 'Romeo and Juliet'?`,
    ),
  },
  {
    id: "computer-science",
    name: "Computer Science Concepts",
    questions: Array.from({ length: 38 }, (_, i) => `Computer Science Question ${i + 1}: What is an algorithm?`),
  },
]



export const predefinedPracticalQuestionSets = [
  {
    id: "math-basics",
    name: "Mathematics Basics",
    questions: Array.from({ length: 35 }, (_, i) => `Math Basic Question ${i + 1}: What is 2 + ${i}?`),
  },
  {
    id: "science-fundamentals",
    name: "Science Fundamentals",
    questions: Array.from(
      { length: 32 },
      (_, i) => `Science Fundamental Question ${i + 1}: Explain the concept of gravity.`,
    ),
  },
  {
    id: "history-events",
    name: "World History Events",
    questions: Array.from({ length: 40 }, (_, i) => `History Event Question ${i + 1}: When did World War II end?`),
  }
]