import axios from 'axios'
import token from '../utils/token'
const commonUrl = '/api/packages'
const userUrl = '/api/data/packages'

const get = async () => {
  const response = await axios.get(commonUrl)
  return response.data
}

const getPackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.get(`${commonUrl}/${id}`, config)
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

const getWord = async (pack, id) => {
  const response = await axios.get(`${commonUrl}/${pack}/${id}`)
  return response.data
}


export default {
  get,
  getPackage,
  ratePackage,
  getWord
}
