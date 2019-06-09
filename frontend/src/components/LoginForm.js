import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useField } from '../hooks'

import loginService from '../services/login'

import '../styles.css'
import '../modal.css'

const LoginForm = (props) => {
  const {user, handleLogin, handleLogout} = props
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")

  const signup = () => {
    setVisible(false)
    setError("")
    props.history.push('/sign')
  }

  const username = useField('username')
  const password = useField('password')

  const submit = async (event) => {
     event.preventDefault()
     const credentials = {
        username: username.value,
        password: password.value
      }
      setError("")
      username.reset()
      password.reset()

      try {
        console.log("logging in...")
        const user = await loginService.login(credentials)
        handleLogin(user)
        console.log("logged in successfully")
        setVisible(false)
      } catch (exception) {
        setError('Invalid username and/or password')
      }
  }

  const style = {
    backgroundColor: '#335',
    color: '#FFF',
    padding: 5,
  }

  const renderModal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close" onClick={() => {setError(false); setVisible(false)}}>&times;</span>
            <h2>Log In</h2>
          </div>
          <form className="modal-body" onSubmit={submit}>
            <p className='error'>{error}</p>
            <p><b>Username</b><br />
            <input type="text" {...username.collection}/></p>
            <p><b>Password</b><br />
            <input type="password"{...password.collection}/></p>
            <p><button type="submit">Login</button></p>
          </form>
          <div className="modal-footer">
            <p>Do not have an account? <button onClick={() => signup()}>Sign up</button> now!</p>
          </div>
        </div>
      </div>
    )
  }

  const renderUser = () => {
    return(
      <div style={style}>
        <p>
          Logged in as {user.username}
          <button onClick={handleLogout}>Log out</button>
        </p>
      </div>
    )
  }

  const renderLogin = () => {
    return (
      <div style={style}>
        <p>
          You are not logged in. <button onClick={() => setVisible(true)}>Login</button> or <button onClick={() => signup()}>Sign up</button>
        </p>
      </div>
    )
  }

  return (
    <div>
      { user ? renderUser() : renderLogin() }
      { (!user && visible) ? renderModal() : "" }
    </div>
  )
}

LoginForm.propTypes = {handleLogin: PropTypes.func.isRequired}

const Login = withRouter(LoginForm)

export default Login
