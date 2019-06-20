import axios from 'axios'
import token from '../utils/token'
const url = '/api/packages'

const get = async () => {
  const response = await axios.get(url)
  return response.data
}

const getPackage = async (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.get(`${url}/${id}`, config)
  return response.data
}

const ratePackage = async(id, value) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }
  const body = { opinion: value }

  const response = await axios.put(`${url}/${id}`, body, config)
  return response.data
}

const getWord = async (pack, id) => {
  const response = await axios.get(`${url}/${pack}/${id}`)
  return response.data
}

const create = async (content) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.post(url, content, config)
  return response.data
}

const edit = async (id, content) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.put(`${url}/${id}`, content, config)
  return response.data
}

const remove = async (id, content) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.delete(`${url}/${id}`, config)
  return response.data
}

export default {
  get,
  getPackage,
  ratePackage,
  getWord,
  create,
  edit,
  remove
}
