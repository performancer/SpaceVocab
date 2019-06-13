import axios from 'axios'
import token from '../utils/token'
const url = '/api/subscriptions'

const get = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const newUrl = id ? `${url}/${id}` : url

  const response = await axios.get(newUrl, config)
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
