import axios from 'axios'
import token from '../utils/token'
const commonUrl = '/api/packages'
const userUrl = '/api/data/packages'

const getPublic = () => {
  const request = axios.get(commonUrl)
  return request.then(response => response.data)
}

const getMine = () => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const request = axios.get(userUrl, config)
  return request.then(response => response.data)
}

const addPackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const body = { id: id }

  const response = await axios.post(userUrl, body, config)
  return response.data
}

const removePackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.delete(`${userUrl}/${id}`, config)
  return response.data
}


export default { getPublic, getMine, addPackage, removePackage }
