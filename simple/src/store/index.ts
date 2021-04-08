
interface State {
  subject: string
}

import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'


export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    subject: ''
  },
  mutations: {
    setSubject: (state, payload) => {
      state.subject = payload
    }
  }
})

// define your own `useStore` composition function
export function useStore () {
  return baseUseStore(key)
}

export default store