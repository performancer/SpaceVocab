const userReducer = (state = null, action) => {
  if (action.type === 'USER') {
     state = action.data
   }

  return state
}


export default userReducer
