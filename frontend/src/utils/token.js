import store from '../store'

const exists = () => {
  return store.getState() && store.getState().user
}

const getToken = () => {
  return `bearer ${store.getState().user.token}`
}

export default { getToken, exists }
