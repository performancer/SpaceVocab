import axios from 'axios'
import token from '../utils/token'
const commonUrl = '/api/packages'
const userUrl = '/api/users/packages'

const getAll = () => {
  const request = axios.get(commonUrl)
  return request.then(response => response.data)
}

const getMy = () => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const request = axios.get(userUrl, config)
  return request.then(response => response.data)
}

export default { getAll, getMy }
