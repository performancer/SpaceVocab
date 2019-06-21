import React, {useEffect} from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import store from './store'

import Header from './components/Header'
import SubscriptionList from './components/SubscriptionList'
import ProgressList from './components/ProgressList'
import PackageInfo from './components/PackageInfo'
import PackageSearch from './components/PackageSearch'
import RegisterForm from './components/RegisterForm'
import ReviewForm from './components/ReviewForm'
import PackageEdit from './components/PackageEdit'

import helper from './utils/helper'

import './styles/styles.css'
import './styles/buttons.css'
import './styles/inputs.css'
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
          store.getState().user ? <SubscriptionList />
        : <button className="wide">Please log in.</button>
      } />
      <Route exact path="/register" render={() =>
          !store.getState().user ? <RegisterForm /> : <Redirect to="/" />
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
        render={() => <ReviewForm info={helper.getReviews()} />}
      />
      <Route exact path="/edit" render={() => <PackageEdit />} />
      <Route exact path='*' render={ () => <Redirect to="/" />} />
    </Switch>
  )
}

export default App
