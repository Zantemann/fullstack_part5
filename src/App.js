import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [user, setUser] = useState('')

  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error('Error in login:', exception)
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  
  const handleLogout = () => {
    window.localStorage.removeItem(`loggedNoteappUser`)
    setUser(null)
  }

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
      setBlogs(updatedBlogs)
      
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)

      setTitle('')
      setAuthor('')
      setUrl('')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={successMessage} className="success"/>
      <Notification message={errorMessage} className="error" />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogsForm = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessage} className="success"/>
      <Notification message={errorMessage} className="error" />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogsForm()}
    </div>
  )
}

export default App