import { db } from './firebase'
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore"
import { NormalWeekData, CompositeWeekData, FirestorePreset, FireBaseQustionSet } from '@/util/type'
import { href } from 'react-router-dom'





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
        theoryQuestions: compositeData[tkey].map((item) => ({
          href: item.href ? item.href : '',
          text: item.text
        })),
        practicalQuestions: compositeData[pkey].map((item) => ({
          href: item.href ? item.href : '',
          text: item.text
        })),
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
      theoryQuestions: normalData.T.map((item) => ({
          href: item.href ? item.href : '',
          text: item.text
        })),
      practicalQuestions: normalData.P.map((item) => ({
          href: item.href ? item.href : '',
          text: item.text
        })),
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


function cleanHref(href: string) {
  return href.split("&")[0].trim().toLowerCase();
}

function arraysAreEqual(a: FireBaseQustionSet[], b: FireBaseQustionSet[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, i) =>
    val.text.trim().toLowerCase() === b[i].text.trim().toLowerCase() &&
    cleanHref(val.href) === cleanHref(b[i].href)
  );
}


function removeDuplicateQuestions( newPreset: FirestorePreset,  existingPresets: FirestorePreset[]): FirestorePreset {

  let theory = newPreset.theoryQuestions
  let practical = newPreset.practicalQuestions

  console.log('from remove duplicates',existingPresets )

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