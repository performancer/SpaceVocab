import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import store from '../store'
import loginService from '../services/login'
import helper from '../utils/helper'

const LoginForm = (props) => {
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")

  const username = useField('username')
  const password = useField('password')

  const register = () => {
    setVisible(false)
    setError("")
    props.history.push('/register')
  }

  const login = async (event) => {
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
        helper.login(user)
        console.log("logged in successfully")
        setVisible(false)
      } catch (exception) {
        setError('Invalid username and/or password')
      }
  }

  const renderModal = () => {
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close" onClick={
                () => {setError(false); setVisible(false)}
              }>&times;</span>
            <h2>Log In</h2>
          </div>
          <form className="modal-body" onSubmit={login}>
            <p className='error'>{error}</p>
            <p><b>Username</b><br />
            <input type="text" {...username.collection}/></p>
            <p><b>Password</b><br />
            <input type="password"{...password.collection}/></p>
            <p><button type="submit">Login</button></p>
          </form>
          <div className="modal-footer">
            <p>
              Do not have an account?
              <button className='simpleButton' onClick={register}>
                Sign up
              </button>
              now!
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderUser = () => {
    return(
      <div>
        <span className='left'><b className="fa fa-user"> {' '}
          {store.getState().user.username}</b>
        </span>
        <button className='right' onClick={helper.logout}>Logout</button>
      </div>
    )
  }

  const renderLogin = () => {
    return (
      <p>
        You are not logged in.
        <button className='simpleButton' onClick={() => setVisible(true)}>
          Login
        </button>
        or
        <button className='simpleButton' onClick={register}>
          Sign up
        </button>
      </p>
    )
  }

  return (
    <div>
      <div className='login'>
        { store.getState().user ? renderUser() : renderLogin() }
      </div>
      { (!store.getState().user && visible) ? renderModal() : null }
    </div>
  )
}

const Login = withRouter(LoginForm)
export default Login
