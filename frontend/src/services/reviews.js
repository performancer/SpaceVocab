import axios from 'axios'
import token from '../utils/token'
const baseUrl = '/api/reviews'

const get = (id) => {
  const config = {
    headers: { Authorization: token.getToken() },
  }
  const request = axios.get(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { get }
