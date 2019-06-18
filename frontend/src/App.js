import React, {useState, useEffect} from 'react'
import { BrowserRouter, Route, Link, Redirect, withRouter } from 'react-router-dom'
import store from './store'

import HomePage from './pages/Home'
import ProgressPage from './pages/Progress'
import PackageInfoPage from './pages/PackageInfo'
import PackageSearchPage from './pages/PackageSearch'
import RegisterPage from './pages/Register'
import ReviewPage from './pages/Review'

import LoginStatus from './components/LoginStatus'
import Togglable from './components/Togglable'
import Settings from './components/Settings'

import helper from './utils/helper'

import './styles/basic.css'
import './styles/header.css'
import './styles/packages.css'
import './styles/modal.css'
import './styles/loader.css'

const App = () => {
  const [spin, setSpin] = useState(false)

  useEffect(() => {
    let user = null
    const userJSON = window.localStorage.getItem('translatorUser')

    if (userJSON)
      user = JSON.parse(userJSON)

    store.dispatch({ type: 'USER', data: { user: user}})
  }, [])

  if(!store.getState())
    return <div className='loader' />

  const navRef = React.createRef()
  const setRef = React.createRef()

  return (
    <div>
      <BrowserRouter>
        <header>
          <div className='flexContainer'>
            <div className='menuButton'>
              <button className='left'
                onClick={() => {
                  navRef.current.toggleVisibility()
                  setRef.current.setVisible(false)
                  setSpin(false)
                }}>
                <span className="fa fa-bars" />
              </button>
            </div>
            <div className='menuButton'>
              <button className='right'
                onClick={() =>  {
                  setSpin(!setRef.current.getVisible())
                  setRef.current.toggleVisibility()
                  navRef.current.setVisible(false)
                }}>
                <div className={spin ? 'spinner' : ''}>
                  <span className="fa fa-gear" />
                </div>
            </button>
            </div>
          </div>
          <LoginStatus />
        </header>
        <div>
          <Togglable ref={navRef}>
            <div className='centered'>
              {store.getState().user ? <Link className='link' to="/">My Subscriptions</Link> : null }
              <Link className='link' to="/packages">Search for Packages</Link>
            </div>
          </Togglable>
          <Togglable ref={setRef}>
              <Settings />
          </Togglable>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/subscriptions/:id" render={({ match }) => <ProgressPage id={match.params.id} />} />
          <Route exact path="/register" render={() => store.getState().user ? <Redirect to="/" /> : <RegisterPage />} />
          <Route exact path="/packages" render={() => <PackageSearchPage />} />
          <Route exact path="/packages/:id" render={({ match }) => <PackageInfoPage id={match.params.id} />} />
          <Route exact path="/users" render={() => <p>users</p>} />
          <Route exact path="/users/:name" render={({ match }) => <p>{match.params.name}</p>} />
          <Route exact path="/review" render={() => !store.getState().user ? <Redirect to="/" />
          : <ReviewPage info={helper.getReviews()} />} />
        <Route render={ () => <Redirect to="/" />} />
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
