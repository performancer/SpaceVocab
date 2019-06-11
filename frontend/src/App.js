import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Link, Redirect, withRouter } from 'react-router-dom'
import store from './store'

import HomePage from './pages/Home'
import PackageInfoPage from './pages/PackageInfo'
import PackageSearchPage from './pages/PackageSearch'
import RegisterPage from './pages/Register'
import ReviewPage from './pages/Review'

import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import './styles/basic.css'
import './styles/header.css'
import './styles/packages.css'
import './styles/modal.css'
import './styles/loader.css'

const App = () => {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    let user = null
    const userJSON = window.localStorage.getItem('translatorUser')

    if (userJSON)
      user = JSON.parse(userJSON)

    store.dispatch({ type: 'USER', data: { user: user}})
  }, [])

  if(!store.getState())
    return <div className='loader' />

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
          <LoginForm />
        </header>
        <div>
          <Togglable ref={navRef}>
            <div className='centered'>
              {store.getState().user ? <Link className='link' to="/">My Subscriptions</Link> : null }
              <Link className='link' to="/packages">Search for Packages</Link>
            </div>
          </Togglable>
          <Route exact path="/" render={() => <HomePage reviewHandler={handleReviews}/>} />
          <Route exact path="/register" render={() => store.getState().user ? <Redirect to="/" /> : <RegisterPage />} />
          <Route exact path="/packages" render={() => <PackageSearchPage />} />
          <Route exact path="/packages/:id" render={({ match }) => <PackageInfoPage id={match.params.id} />} />
          <Route exact path="/users" render={() => <p>users</p>} />
          <Route exact path="/users/:name" render={({ match }) => <p>{match.params.name}</p>} />
          <Route exact path="/review" render={() => !store.getState().user ? <Redirect to="/" />
          : <ReviewPage reviews={reviews} reviewHandler={handleReviews}/>} />
        </div>

        <footer>
          <span className='right'>
            <i className='small'>by Alex Leppäkoski</i>
          </span>
        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App
