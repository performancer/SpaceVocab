import React, {useState} from 'react'
import { useField } from '../hooks'
import loginService from '../services/login'
import helper from '../utils/helper'

const LoginForm = React.forwardRef(({register}, ref) => {
  const [error, setError] = useState("")

  const username = useField('username')
  const password = useField('password')

  const login = async (event) => {
     event.preventDefault()
     const credentials = {
        username: username.value,
        password: password.value
      }
      setError(false);
      username.reset()
      password.reset()

      try {
        console.log("logging in...")
        const user = await loginService.login(credentials)
        helper.login(user)
        console.log("logged in successfully")
        ref.current.setVisible(false)
      } catch (exception) {
        setError('Invalid username and/or password')
      }
  }

  const hide = () => {
    setError(false)
    ref.current.setVisible(false)
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" onClick={hide}>&times;</span>
          <h2>Log In</h2>
        </div>
        <form className="modal-body" onSubmit={login}>
          <p className='error'>{error}</p>
          <p><b>Username</b><br />
          <input type="text" {...username.collection}/></p>
          <p><b>Password</b><br />
          <input type="password"{...password.collection}/></p>
          <p><button className='dark' type="submit">Login</button></p>
        </form>
        <div className="modal-footer">
          <p>
            Do not have an account?
            <button className='simple'
              onClick={ () => {setError(false); register()}}>
              Sign up
            </button>
            now!
          </p>
        </div>
      </div>
    </div>
  )
})

export default LoginForm
