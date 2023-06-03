import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogsForm from './components/BlogsForm'
import Blog from './components/Blog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState('')

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  
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

  return (
    <div>
      {!user && 
        <LoginForm 
          handleLogin = {handleLogin}
          username = {username}
          password = {password}
          successMessage = {successMessage}
          errorMessage = {errorMessage}
          handleUsernameChange = {({ target }) => setUsername(target.value)}
          handlePasswordChange = {({ target }) => setPassword(target.value)}
        />
      }
      {user &&
        <div>
          <BlogsForm
            handleLogout = {handleLogout}
            user = {user}
            successMessage = {successMessage}
            errorMessage = {errorMessage}
            handleSuccessMessageChange = {setSuccessMessage}
            handleBlogsChange = {setBlogs}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
        
      }
    </div>
  )
}

export default App