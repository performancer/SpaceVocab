let token = null

const getToken = () => {
  return token
}

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

export default { getToken, setToken }
