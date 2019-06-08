import React from 'react'
import PropTypes from 'prop-types'
import { useField } from '../hooks'

const LoginForm = ({handleLogin}) => {
  const username = useField('username')
  const password = useField('password')

  const submit = async (event) => {
     event.preventDefault()
     const credientals = {
        username: username.value,
        password: password.value
      }
      username.reset()
      password.reset()
      await handleLogin(credientals)
  }

  return (
    <div>
        <h2>Log In</h2>
        <form onSubmit={submit}>
            <div>
                username <input type="text" {...username.collection}/>
            </div>
            <div>
                password <input type="password"{...password.collection}/>
            </div>
            <button type="submit">log in</button>
        </form>
    </div>
  )
}

LoginForm.propTypes = {handleLogin: PropTypes.func.isRequired}

export default LoginForm
