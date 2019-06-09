import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Link, Redirect, withRouter } from 'react-router-dom'

import Home from './pages/Home'
import Packages from './pages/Packages'

import LoginForm from './components/LoginForm'
import loginService from './services/login'
import token from './utils/token'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('translatorUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      token.setToken(user.token)
    }
  }, [])

  const handleLogin = (user) => {
      window.localStorage.setItem('translatorUser', JSON.stringify(user))
      setUser(user)
      token.setToken(user.token)
  }

  const handleLogout = async (event) => {
    if( window.confirm('are you sure you want to log out?')) {
      window.localStorage.removeItem('translatorUser')
      setUser(null)
    }
  }

  const padding = { padding: 5 }

  return (
    <div>
      <BrowserRouter>
        <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout}/>
        <div>
          <div>
            <Link style={padding} to="/">home</Link>
            <Link style={padding} to="/packages">packages</Link>
            <Link style={padding} to="/users">users</Link>
          </div>
          <Route exact path="/" render={() => <Home user={user}/>} />
          <Route exact path="/sign" render={() => <p>sign up</p>} />
          <Route exact path="/packages" render={() => <Packages user={user}/>} />
          <Route exact path="/packages/:id" render={({ match }) => <p>{match.params.id}</p>} />
          <Route exact path="/users" render={() => <p>uusers </p>} />
          <Route exact path="/users/:name" render={({ match }) => <p>{match.params.name}</p>} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
