import { useState } from 'react'

import blogService from '../services/blogs'

const Blog = ({ blog, user, handleBlogsChange }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async (event) => {
    event.preventDefault()
    try {
      const updatedBlog = {
        ...blog,
        likes: likes + 1
      }
      setLikes(updatedBlog.likes)

      await blogService.addLike(updatedBlog)
      setLikes(updatedBlog.likes)
      const response = await blogService.getAll()
      handleBlogsChange(response)
    } catch (error){
      console.error(error)
    }
  }

  const handleRemove = async (event) => {
    event.preventDefault()
    const confirmed = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (confirmed) {
      try {
        await blogService.remove(blog, user)
        const response = await blogService.getAll()
        handleBlogsChange(response)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const showRemove = user.name === blog.user.name

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={handleToggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <a href={blog.url} target="_blank" rel="noreferrer">
            <p>{blog.url}</p>
          </a>
          <p>Likes: {likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user.name}</p>
          {showRemove && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </div>
  )
}

export default Blog