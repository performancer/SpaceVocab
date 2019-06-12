import React, { useState }  from 'react';
import { withRouter } from 'react-router-dom'
import { useField } from '../hooks'
import userService from '../services/users'
import helper from '../utils/helper'

const Register = (props) => {
  const [error, setError] = useState("")

  const username = useField('username')
  const password = useField('password')
  const repeatPassword = useField('password')

  const register = async (event) => {
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
        helper.login(user)
        console.log("sign up successful")
        props.history.push('/')
      } catch (exception) {
        setError(exception.response.data.error)
      }
  }


  return (
      <form className='center' onSubmit={register}>
        <h1>Register</h1>
        <p className='error'>{error}</p>
        <p><b>Username</b><br />
        <input type="text" {...username.collection}/></p>
        <p><b>Password</b><br />
        <input type="password" {...password.collection}/></p>
        <p><input type="password" {...repeatPassword.collection}/></p>
        <p><button className='borderlessButtonDark' type="submit">Sign up</button></p>
      </form>
  )
}

const RegisterComponent = withRouter(Register)
export default RegisterComponent
