
import axios from 'axios'
import { ExtraQuestion } from './type'

const API_KEY = import.meta.env.VITE_API_KEY
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL



type AiResponse =
  | { success: true; answer: string }
  | { success: false; status: number ,error: string};

export async function askQuestionToAi(question: string, link: string, currentFilter: string, language: string): Promise<AiResponse> {
  try {
    let response

    if (currentFilter === 'theory') {
      response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: `Explain the following in a simple and clear way so that anyone can easily understand it. Do not include any code in the answer. You may use one short example if it helps to make the idea clearer: ${question}` }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
    } else {

      if (link) {
        const base64 = await extractImage(link)

        response = await axios.post(
          `${GEMINI_API_URL}?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    inlineData: {
                      mimeType: "image/png",
                      data: base64,
                    },
                  },
                  {
                    text: "I need a C program that generates the pattern shown in the image. The response should only include the code, without any extra explanation. You may include comments inside the code if needed.",
                  },
                ],
              },
            ],
          }
        );

      } else {

        response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: `Write only the ${language} code related to the following question. Do not provide any explanation, comments, or output. Return only valid, clean ${language} code in response: ${question}`
                  }
                ],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

    }



    const answer = response?.data.candidates?.[0]?.content?.parts?.[0]?.text
    return { success: true, answer }
  } catch (error: any) {
  
    return { success: false, status: error.response?.status || 500 ,error: error.message};
  }
}


type ExtraQuestionResult =
  | { success: true; questions: ExtraQuestion[] }
  | { success: false; status: number; message: string };


export async function getExtraQuestions(week: string): Promise<ExtraQuestionResult> {
  const prompt = buildPrompt(week);

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    text = cleanResponseText(text);


    const questions: ExtraQuestion[] = JSON.parse(text);
    return { success: true, questions }
  } catch (error: any) {
    console.error("Error fetching extra questions:", error);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Something went wrong while fetching questions.";

    return { success: false, status, message };
  }
}




function cleanResponseText(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}



function buildPrompt(week: string): string {
  if (week === "week-1" || week === 'week-2') {
    return `
You are a question generator. Create up to 30 beginner-friendly C programming questions.

Focus:
- Basics of C: variables, loops, conditionals, functions, arrays, strings, I/O, switch, pointers (very basic).
- Use loops and conditional statements and short, simple code snippets.
- Include several "predict the output" questions that use small C programs.
- Include coding (write this small program) tasks and short theory questions.
- Keep language simple and beginner-friendly.

FORMAT RULES (READ CAREFULLY):
1. Return ONLY a single valid JSON array. Do NOT include any extra text, explanation, or markdown outside the JSON.
2. Each array element must be an object with these exact fields:
   - "id": string (unique, sequential like "1", "2", ...)
   - "title": string
   - "content": an array of objects (see content rules below)
   - "category": "C"
3. Content array: each element must be one of:
   - { "type": "text", "value": "..." }       // plain question/instruction text
   - { "type": "code", "language": "c", "value": "..." }  // C code snippet as a raw string
4. NEVER put code inline inside a text value. All code must be a separate object with type "code".
5. For "predict the output" questions:
   - Provide a text content object that prompts the student to predict output.
   - Provide one code content object that contains the exact C program.
   - **Inside that same code string**, append the correct output as a C comment on a new line at the end of the code using this exact format: "/* Output: <exact output> */"
   - Do NOT add additional explanations outside that comment.
   - Example of the code object's value (must be a single string value in JSON):
     "#include <stdio.h>\\nint main() {\\n    int i = 0;\\n    while (i++ < 3) {\\n        printf(\"%d \", i);\\n    }\\n    return 0;\\n}\\n/* Output: 1 2 3 */"
6. For coding (write-this-program) tasks:
   - Use only a text content object describing the task (do NOT include the solution code).
7. For theory questions:
   - Use only a text content object with a precise, short question.
   - Include some questions that match these exact examples (please include all four):
     - "What is the difference between while and do-while loops?"
     - "If you write int a; printf(\"%d\", a); without initializing a, what happens?"
     - "What is the output of printf(\"%d\", 5/2); and why?"
     - "Why do we use return 0; in the main function?"
8. Question mix (aim for roughly this distribution in the set of up to 30):
   - At least 8 "predict the output" questions (with code + answer comment).
   - At least 10 small coding tasks (text-only prompts asking to write a small program).
   - The rest theory / short conceptual questions (including the four required examples above).
9. Keep code examples short (preferably <= 15 lines), use simple constructs, and avoid complex libraries.
10. Use simple, clear titles. Category must be "C" for every question.
11. Ensure the JSON is well-formed and parseable (no trailing commas, no extra text). Escape newlines in code strings as ("\n") if you produce the JSON literal.

EXAMPLE OF A SINGLE QUESTION OBJECT (for reference - you must produce many similar objects, not this single example):
{
  "id": "1",
  "title": "Predict the output of this loop",
  "content": [
    { "type": "text", "value": "Predict the output of the following C code:" },
    { "type": "code", "language": "c", "value": "#include <stdio.h>\\nint main() {\\n    int i = 0;\\n    while (i++ < 3) {\\n        printf(\"%d \", i);\\n    }\\n    return 0;\\n}\\n/* Output: 1 2 3 */" }
  ],
  "category": "C"
}

Now generate the JSON array of up to 30 questions following all rules above.`;
  }
  if (week === "week-3") {
    return `
You are a question generator. Create up to 30 beginner-level Java questions.

Focus:
- Goal: Help the student understand Java OOP concepts better this week.
- Topics: class, object, inheritance, polymorphism, method overriding, method hiding (static), constructors, initialization blocks, abstraction, encapsulation.
- Include several "predict the output" questions that demonstrate OOP behavior in tricky but beginner-friendly ways (like constructor chaining, method overriding, static vs instance methods, initialization blocks, etc.).
- Include theory questions with short, clear explanations in the text.
- Also include some basic coding tasks (ask the student to implement a concept).

FORMAT RULES:
1. Return ONLY a single valid JSON array. Do NOT include anything outside the JSON.
2. Each question object must have:
   - "id": string (unique, sequential like "1", "2", …)
   - "title": string
   - "content": array of objects (see below)
   - "category": must be "Java"
3. Content array rules:
   - For text: { "type": "text", "value": "..." }
   - For code: { "type": "code", "language": "java", "value": "..." }
4. For "predict the output" questions:
   - Always have a text prompt first: { "type": "text", "value": "Predict the output of this Java code:" }
   - Then the code snippet as { "type": "code", "language": "java", "value": "..." }
   - In the code, append the expected output as a comment at the end in this format: "// Output: ..."
   - Example:  
     "value": "class A {\\n    A() { System.out.println(\\"A\\"); }\\n}\\nclass B extends A {\\n    B() { System.out.println(\\"B\\"); }\\n}\\npublic class Main {\\n    public static void main(String[] args) {\\n        new B();\\n    }\\n}\\n// Output: A\\nB"
5. For theory questions:
   - Use only text objects.
   - Keep the answer short and simple, as part of the value string.  
   - Example:  
     { "type": "text", "value": "What is method overriding? Answer: It allows a subclass to provide a specific implementation of a method already defined in its superclass." }
6. For coding tasks:
   - Use text only, asking the student to implement something. No solution code should be included.
   - Example:  
     { "type": "text", "value": "Write a Java program with a superclass Vehicle and subclasses Car and Bike that demonstrate inheritance." }
7. Question mix:
   - At least 8 predict-the-output questions (with tricky OOP behavior).
   - At least 6 theory questions (with short answers in the text).
   - At least 6 coding tasks.
   - The rest can be mixed to reach up to 30.
8. Code should be short (preferably < 20 lines), focus on OOP, and use only standard Java.

EXAMPLE QUESTION OBJECT (for clarity):
{
  "id": "1",
  "title": "Constructor chaining",
  "content": [
    { "type": "text", "value": "Predict the output of this Java code:" },
    { "type": "code", "language": "java", "value": "class A {\\n    A() { System.out.println(\\"A\\"); }\\n}\\nclass B extends A {\\n    B() { System.out.println(\\"B\\"); }\\n}\\npublic class Main {\\n    public static void main(String[] args) {\\n        new B();\\n    }\\n}\\n// Output: A\\nB" }
  ],
  "category": "Java"
}

Now generate up to 30 such question objects, strictly following all rules above.`;
  }

  if (week === "week-4") {
    return `
Generate up to 40 mixed questions from C basics (week 1), C arrays/logic (week 2), and Java OOP (week 3).

Focus:
- Mix the types of questions from all three weeks
- Include "predict the output" style questions
- Include tricky but still beginner-friendly questions
- Keep English very simple
- Spread across categories: C Basics, C Arrays, Java OOP

IMPORTANT:
- Always separate text and code into objects.
- Use the right language key: "c" for C, "java" for Java.
- Never inline code inside text.
- Return ONLY valid JSON in this format:

[
  {
    "id": "1",
    "title": "Mixed Example Question",
    "content": [
      { "type": "text", "value": "Predict the output of this C code:" },
      { "type": "code", "language": "c", "value": "#include <stdio.h>\\nint main() {\\n   int x=5;\\n   if(x<10) printf(\\"Yes\\"); else printf(\\"No\\");\\n   return 0;\\n}" }
    ],
    "category": "Mixed"
  }
]`;
  }

  return "Invalid week.";
}




function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const base64 = reader.result.split(",")[1]; 
        resolve(base64);
      } else {
        reject(new Error("Failed to convert Blob to Base64 string"));
      }
    };

    reader.onerror = () => reject(new Error("FileReader failed while converting Blob to Base64"));
    reader.readAsDataURL(blob);
  });
}




function extractImageLinks(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));

  if (images.length === 0) {
    throw new Error("No <img> tags found in the provided HTML");
  }

  const firstImg = images[0].src;
  if (!firstImg) {
    throw new Error("Image source URL not found in HTML");
  }

  return firstImg;
}




export async function extractImage(url: string): Promise<string> {
  try {
    const parsed = new URL(url);
    const realUrl = parsed.searchParams.get("q");
    if (!realUrl) {
      throw new Error("Google Docs URL did not contain a 'q' parameter with the real URL");
    }

    const urlForExport = realUrl.replace(/\/edit.*$/, "/export?format=html");

    const res = await fetch(urlForExport);
    if (!res.ok) {
      throw new Error(`Failed to fetch exported HTML. Status: ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    if (!html) {
      throw new Error("Fetched HTML from Google Docs export is empty");
    }

    const imgLink = extractImageLinks(html);

    const imgRes = await fetch(imgLink);
    if (!imgRes.ok) {
      throw new Error(`Failed to fetch image from extracted link. Status: ${imgRes.status} ${imgRes.statusText}`);
    }

    const blob = await imgRes.blob();
    if (blob.size === 0) {
      throw new Error("Fetched image Blob is empty");
    }

    const base64img = await blobToBase64(blob);
    if (!base64img) {
      throw new Error("Conversion to Base64 returned an empty string");
    }

    return base64img;
  } catch (error: any) {
    console.error("extractImage error:", error.message || error);
    throw error; 
  }
}
