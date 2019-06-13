import store from '../store'

const login = (user) => {
    window.localStorage.setItem('translatorUser', JSON.stringify(user))
    store.dispatch({ type: 'USER', data: { user: user }})
}

const logout = () => {
  if( window.confirm('Are you sure you want to log out?')) {
    window.localStorage.removeItem('translatorUser')
    store.dispatch({ type: 'USER', data: { user: null }})
  }
}

let reviews = null

const getReviews = () => reviews
const setReviews = (value) => {
  reviews = value
}

export default {login, logout, getReviews, setReviews}
