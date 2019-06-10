import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Link, Redirect, withRouter } from 'react-router-dom'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Sign from './pages/Sign'
import Review from './pages/Review'

import LoginForm from './components/LoginForm'
import token from './utils/token'
import './styles.css'

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

  return (
    <div>
      <BrowserRouter>
        <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout}/>
        <div>
          <div className='linkcase'>
            {user ?
              <div className='linkback'><Link className='link' to="/">My Packages</Link></div>
              : null
            }
            <div className='linkback'><Link className='link' to="/packages">Search for Packages</Link></div>
          </div>

          <Route exact path="/" render={() => <Home user={user}/>} />
          <Route exact path="/sign" render={() => user ? <Redirect to="/" /> : <Sign handleLogin={handleLogin}/>} />
          <Route exact path="/packages" render={() => <Packages user={user}/>} />
          <Route exact path="/packages/:id" render={({ match }) => <p>{match.params.id}</p>} />
          <Route exact path="/users" render={() => <p>uusers </p>} />
          <Route exact path="/users/:name" render={({ match }) => <p>{match.params.name}</p>} />
          <Route exact path="/review" render={() => !user ? <Redirect to="/" /> : <Review />} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
