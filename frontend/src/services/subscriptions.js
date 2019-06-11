import axios from 'axios'
import token from '../utils/token'
const url = '/api/data/packages'

const get = async () => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.get(url, config)
  return response.data
}

const subscribe = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const body = { id: id }

  const response = await axios.post(url, body, config)
  return response.data
}

const unsubscribe = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.delete(`${url}/${id}`, config)
  return response.data
}

export default { get, subscribe, unsubscribe }
