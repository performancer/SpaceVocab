import React from 'react'
import { withRouter } from 'react-router-dom'
import store from '../store'
import LoginForm from './LoginForm'
import Togglable from './Togglable'

const LoginStatus = (props) => {
  const modalRef = React.createRef()

  const register = () => {
    modalRef.current.setVisible(false)
    props.history.push('/register')
  }

  if(store.getState().user) {
    return(
      <div>
        <br />
        <b className="fa fa-user"> {store.getState().user.username}</b>
      </div>
    )
  }

  return (
    <div>
      <p>
        You are not logged in.
        <button className='simple'
          onClick={() => modalRef.current.setVisible(true)}>
          Login
        </button>
        or
        <button className='simple' onClick={register}>
          Sign up
        </button>
      </p>
      <Togglable ref={modalRef}>
        <LoginForm ref={modalRef} register={register}/>
      </Togglable>
    </div>
  )
}

const LoginStatusWithHistory = withRouter(LoginStatus)
export default LoginStatusWithHistory
