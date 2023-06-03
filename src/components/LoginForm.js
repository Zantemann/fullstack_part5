import Notification from './Notification'

const LoginForm = ({
  handleLogin,
  username,
  password,
  successMessage,
  errorMessage,
  handleUsernameChange,
  handlePasswordChange
  }) => {
  return (
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
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit">login</button>
    </form>
  </div>
  )
}

export default LoginForm
