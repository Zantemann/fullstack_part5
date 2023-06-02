import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const postBlog = async (newBlog, user) => {
  await axios.post(baseUrl, newBlog, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, postBlog }