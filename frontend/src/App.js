import React, {useEffect} from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import store from './store'

import Header from './components/Header'
import SubscriptionList from './components/SubscriptionList'
import ProgressList from './components/ProgressList'
import PackageInfo from './components/PackageInfo'
import PackageSearch from './components/PackageSearch'
import RegisterPage from './pages/Register'
import ReviewPage from './pages/Review'
import PackageEdit from './components/PackageEdit'

import helper from './utils/helper'

import './styles/basic.css'
import './styles/header.css'
import './styles/packages.css'
import './styles/modal.css'
import './styles/loader.css'

const App = () => {
  useEffect(() => {
    let user = null
    const userJSON = window.localStorage.getItem('translatorUser')

    if (userJSON)
      user = JSON.parse(userJSON)

    store.dispatch({ type: 'USER', data: { user: user}})
  }, [])

  if(!store.getState())
    return <div className='loader' />

  return (
    <BrowserRouter>
      <Header />
      <Routing />
    </BrowserRouter>
  )
}

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/"
        render={() =>
          store.getState().user ? <SubscriptionList /> : <p>Please log in.</p>
      } />
      <Route exact path="/register" render={() =>
          !store.getState().user ? <RegisterPage /> : <Redirect to="/" />
      } />
      <Route exact path="/subscriptions/:id" render={({ match }) =>
        store.getState().user ?
          <ProgressList id={match.params.id} /> : <Redirect to="/" />
      } />
      <Route exact path="/packages" render={() => <PackageSearch />} />
      <Route exact path="/packages/:id"
        render={({ match }) => <PackageInfo id={match.params.id} />}
      />
      <Route exact path="/review"
        render={() => <ReviewPage info={helper.getReviews()} />}
      />
      <Route exact path="/edit" render={() => <PackageEdit />} />
      <Route exact path='*' render={ () => <Redirect to="/" />} />
    </Switch>
  )
}

export default App
