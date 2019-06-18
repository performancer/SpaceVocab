import axios from 'axios'
import token from '../utils/token'
const url = '/api/reviews'

const get = async (id, lesson) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }

  const response = await axios.get(`${url}/${id}?lesson=${lesson}`, config)
  return response.data
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
