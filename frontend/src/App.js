import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Link, Redirect, withRouter } from 'react-router-dom'
import Home from './pages/Home'
import Packages from './pages/Packages'
import Sign from './pages/Sign'
import Review from './pages/Review'

import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import token from './utils/token'
import './styles/basic.css'
import './styles/header.css'
import './styles/packages.css'
import './styles/modal.css'
import './styles/loader.css'

const App = () => {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState(null)

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

  const handleReviews = async (reviews) => {
    setReviews(reviews)
  }

  const navRef = React.createRef()

  return (
    <div>
      <BrowserRouter>
        <header>
          <div className='flexContainer'>
            <div className='menuButton'>
              <button className='left' onClick={() => navRef.current.toggleVisibility()}>
                <span className="fa fa-bars"></span>
              </button>
            </div>
            <div className='menuButton'>
              <button className='right'><span className="fa fa-gear"></span></button>
            </div>
          </div>
          <LoginForm user={user} handleLogin={handleLogin} handleLogout={handleLogout}/>
        </header>
        <div>
          <Togglable ref={navRef}>
            <div className='centered'>
              {user ? <Link className='link' to="/">My Packages</Link> : null }
              <Link className='link' to="/packages">Search for Packages</Link>
            </div>
          </Togglable>
          <Route exact path="/" render={() => <Home user={user} reviewHandler={handleReviews}/>} />
          <Route exact path="/sign" render={() => user ? <Redirect to="/" /> : <Sign handleLogin={handleLogin}/>} />
          <Route exact path="/packages" render={() => <Packages user={user}/>} />
          <Route exact path="/packages/:id" render={({ match }) => <p>{match.params.id}</p>} />
          <Route exact path="/users" render={() => <p>uusers </p>} />
          <Route exact path="/users/:name" render={({ match }) => <p>{match.params.name}</p>} />
          <Route exact path="/review" render={() => !user ? <Redirect to="/" />
          : <Review reviews={reviews} reviewHandler={handleReviews}/>} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
