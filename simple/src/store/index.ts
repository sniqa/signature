import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

import { PersonInfos } from '../common/indexedDB'

export interface PersonState extends PersonInfos {
  personID: string
}

interface Persons {
  subjectID: string,
  indexedDB: IDBDatabase | null
  persons: Array<PersonState>
}
export const key: InjectionKey<Store<Persons>> = Symbol()

export const store = createStore<Persons>({
  state: {
    subjectID: '',
    indexedDB: null,
    persons: []
  },
  mutations: {
    setPersons: (state, payload: Array<PersonState>) => {
      state.persons = payload
    },
    setSubjectID: (state, payload: string) => {
      state.subjectID = payload
    },
    setIndexedDB: (state, payload: IDBDatabase) => {
      state.indexedDB = payload
    }
  }
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}

export default store