import React, { useState, useEffect }  from 'react';
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'

import userService from '../services/users'

import '../styles.css'

const Sign = (props) => {
  const {handleLogin} = props
  const [error, setError] = useState("")

  const username = useField('username')
  const password = useField('password')
  const repeatPassword = useField('password')

  const submit = async (event) => {
     event.preventDefault()
     const data = {
        username: username.value,
        password: password.value,
        language: 'EN'
      }
      username.reset()
      password.reset()
      repeatPassword.reset()

      if(password.value !== repeatPassword.value)
        return setError('Your passwords do not match')

      try {
        console.log("signing up...")
        const user = await userService.signup(data)
        handleLogin(user)
        console.log("sign up successful")
        props.history.push('/')
      } catch (exception) {
        setError(exception.response.data.error)
      }
  }

  return (
    <div className='center'>
      <form onSubmit={submit}>
        <p className='error'>{error}</p>
        <p><b>Username</b><br />
        <input type="text" {...username.collection}/></p>
        <p><b>Password</b><br />
        <input type="password" {...password.collection}/></p>
        <p><input type="password" {...repeatPassword.collection}/></p>
        <p><button type="submit">Sign up</button></p>
      </form>
    </div>
  )
}

const SignWithHistory = withRouter(Sign)
export default SignWithHistory
