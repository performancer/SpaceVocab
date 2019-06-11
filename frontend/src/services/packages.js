import axios from 'axios'
import token from '../utils/token'
const commonUrl = '/api/packages'
const userUrl = '/api/data/packages'

const getPublic = async () => {
  const response = await axios.get(commonUrl)
  return response.data
}

const getMine = async () => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.get(userUrl, config)
  return response.data
}

const addPackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const body = { id: id }

  const response = await axios.post(userUrl, body, config)
  return response.data
}

const getPackage = async (id) => {
  const response = await axios.get(`${commonUrl}/${id}`)
  return response.data
}

const ratePackage = async(id, value) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const body = { value: value }

  const response = await axios.put(`${commonUrl}/${id}`, body, config)
  return response.data
}

const removePackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.delete(`${userUrl}/${id}`, config)
  return response.data
}

const getWord = async (pack, id) => {
  const response = await axios.get(`${commonUrl}/${pack}/${id}`)
  return response.data
}


export default {
  getPublic,
  getMine,
  addPackage,
  getPackage,
  ratePackage, 
  removePackage,
  getWord
}
