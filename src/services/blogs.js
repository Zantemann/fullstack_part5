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

const addLike = async (updatedBlog) => {
  const url = `${baseUrl}/${updatedBlog.id}`
  await axios.put(url, updatedBlog)
}

const remove = async (blog, user) => {
  const url = `${baseUrl}/${blog.id}`
  await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
}

export default { getAll, postBlog, addLike, remove }