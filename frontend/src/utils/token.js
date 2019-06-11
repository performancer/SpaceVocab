import store from '../store'

const exists = () => {
  return store.getState() && store.getState().user
}

const getToken = () => {
  if(exists())  {
    return `bearer ${store.getState().user.token}`
  } else {
    return null
  }
}

export default { getToken, exists }
