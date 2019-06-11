import axios from 'axios'
import token from '../utils/token'
const url = '/api/reviews'

const get = (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }
  const request = axios.get(`${url}/${id}`, config)
  return request.then(response => response.data)
}

const review = async (pack, word, answer) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const body = {
    answer: answer
  }

  const response = await axios.put(`${url}/${pack}/${word}`, body, config)
  return response.data
}

export default { get, review }
