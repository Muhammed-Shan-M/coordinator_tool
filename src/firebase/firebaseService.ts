import { db } from './firebase'
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"
import { NormalWeekData, CompositeWeekData, FirestorePreset } from '@/util/type'




// export const addItem = async (data: NormalWeekData | CompositeWeekData, week: string) => {

//     if (week === 'week-4') {
//         const compositeData = data as CompositeWeekData

//         const promise = [1, 2, 3].map((num) => {
//             const tkey = `week${num}T` as keyof CompositeWeekData
//             const pkey = `week${num}P` as keyof CompositeWeekData

//             const docData: FirestorePreset = {
//                 week: `week-${num}`,
//                 theoryQuestions: compositeData[tkey].map((item) => item.text),
//                 practicalQuestions: compositeData[pkey].map((item) => item.text),
//             }
//             return addDoc(collection(db, "presets"), docData)
//         })
//         return Promise.all(promise)
//     } else {

//         const normalData = data as NormalWeekData

//         const docData: FirestorePreset = {
//             week,
//             theoryQuestions: normalData.T.map((item) => item.text),
//             practicalQuestions: normalData.P.map((item) => item.text),
//         }

//         return await addDoc(collection(db, "presets"), docData)
//     }
// }
type ExistingData = {
  [key in "week1" | "week2" | "week3"]: FirestorePreset[]
}


export const addItem = async (
  data: NormalWeekData | CompositeWeekData,
  week: string,
  existingData: ExistingData
) => {
  if (week === "week-4") {
    const compositeData = data as CompositeWeekData

    const promise = [1, 2, 3].map((num) => {
      const tkey = `week${num}T` as keyof CompositeWeekData
      const pkey = `week${num}P` as keyof CompositeWeekData
      const weekKey = `week${num}` as keyof ExistingData   // <- cast to correct type

      let docData: FirestorePreset = {
        week: `week-${num}`,
        theoryQuestions: compositeData[tkey].map((item) => item.text),
        practicalQuestions: compositeData[pkey].map((item) => item.text),
      }

      docData = removeDuplicateQuestions(docData, existingData[weekKey])

      if(docData.practicalQuestions.length === 0 && docData.theoryQuestions.length === 0)return

      return addDoc(collection(db, "presets"), docData)
    })
    return Promise.all(promise)
  } else {
    const normalData = data as NormalWeekData
    const weekKey = (week === 'week-1' ? 'week1' : week === 'week-2'? 'week2' : 'week3' ) as keyof ExistingData  // <- cast here

    let docData: FirestorePreset = {
      week,
      theoryQuestions: normalData.T.map((item) => item.text),
      practicalQuestions: normalData.P.map((item) => item.text),
    }

    docData = removeDuplicateQuestions(docData, existingData[weekKey])

    if(docData.practicalQuestions.length === 0 && docData.theoryQuestions.length === 0)return
    
    return await addDoc(collection(db, "presets"), docData)
  }
}



export const getPresets = async () => {

    const snapshot = await getDocs(collection(db, "presets"))
    const data: FirestorePreset[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FirestorePreset, "id">),
    }))

    return {
        week1: data.filter((item) => item.week === 'week-1'),
        week2: data.filter((item) => item.week === 'week-2'),
        week3: data.filter((item) => item.week === 'week-3')
    }
}

export const updateItem = async (id: string, data: Partial<{ name: string }>) => {
    const ref = doc(db, "items", id)
    return await updateDoc(ref, data)
}


function arraysAreEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  return a.every((val, i) => val === b[i])
}


function removeDuplicateQuestions( newPreset: FirestorePreset,  existingPresets: FirestorePreset[]): FirestorePreset {

  let theory = newPreset.theoryQuestions
  let practical = newPreset.practicalQuestions

  for (const preset of existingPresets) {
    if (arraysAreEqual(theory, preset.theoryQuestions)) {
      theory = [] 
    }
    if (arraysAreEqual(practical, preset.practicalQuestions)) {
      practical = [] 
    }
  }

  return {
    ...newPreset,
    theoryQuestions: theory,
    practicalQuestions: practical,
  }
}