import axios from 'axios'
const baseUrl = '/api/reviews'

const get = (id) => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

export default { get }
