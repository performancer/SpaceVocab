import React, {useState} from 'react'
import { withRouter } from 'react-router-dom'
import store from '../store'

import LoginForm from './LoginForm'
import helper from '../utils/helper'

const LoginStatus = (props) => {
  const [modalVisible, setModalVisible] = useState(false)

  const register = () => {
    setModalVisible(false)
    props.history.push('/register')
  }

  const renderUser = () => {
    return(
      <div className='login'>
        <span className='left'><b className="fa fa-user"> {' '}
          {store.getState().user.username}</b>
        </span>
        <button className='right' onClick={helper.logout}>Logout</button>
      </div>
    )
  }

  const renderLogin = () => {
    return (
      <div className='login'>
        <p>
          You are not logged in.
          <button className='simpleButton'
            onClick={() => setModalVisible(true)}>
            Login
          </button>
          or
          <button className='simpleButton' onClick={register}>
            Sign up
          </button>
        </p>
      </div>
    )
  }

  if(store.getState().user)
      return renderUser()

  return (
    <div>
      { renderLogin() }
      { (modalVisible) ?
        <LoginForm
        visibilityHandler={setModalVisible} registerHandler={register}
        />
        : null
      }
    </div>
  )
}

const Login = withRouter(LoginStatus)
export default Login
