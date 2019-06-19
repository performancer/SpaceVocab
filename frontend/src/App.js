import React, {useState, useEffect} from 'react'
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'
import store from './store'

import HomePage from './pages/Home'
import ProgressList from './components/ProgressList'
import PackageInfo from './components/PackageInfo'
import PackageSearch from './components/PackageSearch'
import RegisterPage from './pages/Register'
import ReviewPage from './pages/Review'
import PackageEdit from './components/PackageEdit'

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
            <div className='centered' onClick={() => navRef.current.setVisible(false)}>
              {store.getState().user ? <Link className='link' to="/">My Subscriptions</Link> : null }
              <Link className='link' to="/packages">Search for Packages</Link>
              {store.getState().user ? <Link className='link' to="/edit">Create Package</Link> : null }
            </div>
          </Togglable>
          <Togglable ref={setRef}>
              <Settings />
          </Togglable>
          <Switch>
            <Route exact path="/" render={() => <HomePage />} />
            <Route exact path="/subscriptions/:id" render={({ match }) => <ProgressList id={match.params.id} />} />
            <Route exact path="/register" render={() => store.getState().user ? <Redirect to="/" /> : <RegisterPage />} />
            <Route exact path="/packages" render={() => <PackageSearch />} />
            <Route exact path="/packages/:id" render={({ match }) => <PackageInfo id={match.params.id} />} />

            <Route exact path="/review" render={() =>
                store.getState().user ?
                <ReviewPage info={helper.getReviews()} />
                : <Redirect to="/" />
            } />

          <Route exact path="/edit" render={() =>
                store.getState().user ? <PackageEdit /> : <Redirect to="/" />
            } />

            <Route exact path="*" render={ () => <Redirect to="/" />} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
