import { createStore } from 'redux'

const userReducer = (state = null, action) => {
  if (action.type === 'USER') {
     state = action.data
   }

  return state
}

const store = createStore(userReducer)

export default store
