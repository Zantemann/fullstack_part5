import { useState, useRef } from 'react'
import blogService from '../services/blogs'
import Notification from './Notification'
import Togglable from './Togglable'

const BlogsForm = ({
  handleLogout,
  user,
  successMessage,
  errorMessage,
  handleBlogsChange,
  handleSuccessMessageChange
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const newBlog = {
        title: title,
        author: author,
        url: url,
        likes: 0
      }

      await blogService.postBlog(newBlog, user)

      const updatedBlogs = await blogService.getAll()
      handleBlogsChange(updatedBlogs)

      handleSuccessMessageChange(`a new blog ${newBlog.title} by ${newBlog.author} added`)

      setTitle('')
      setAuthor('')
      setUrl('')
      blogFormRef.current.toggleVisibility()
      setTimeout(() => {
        handleSuccessMessageChange(null)
      }, 5000)
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessage} className="success"/>
      <Notification message={errorMessage} className="error" />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
          <div>
            title:
            <input
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
          author:
            <input
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
          url:
            <input
              type="text"
              value={url}
              name="Url"
              onChange={({ target }) => setUrl(target.value)}
            />
          </div>
          <button type="submit">create</button>
        </form>
      </Togglable>
    </div>
  )
}

export default BlogsForm