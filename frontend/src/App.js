import React, { useState, useEffect }  from 'react';

import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import PublicPackage from './components/PublicPackage'

import loginService from './services/login'
import packageService from './services/packages'

import token from './utils/token'

function App() {
  const [user, setUser] = useState(null)
  const [packages, setPackages] = useState([])
  const [myPackages, setMyPackages] = useState([])

  const onLogin = async () => {
    const packages = await packageService.getMy()
    setMyPackages( packages )
    console.log(packages)
  }

  useEffect(() => {
    packageService.getAll().then(packages => setPackages( packages ))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('translatorUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      token.setToken(user.token)
      onLogin()
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('translatorUser', JSON.stringify(user))
      setUser(user)
      token.setToken(user.token)
    } catch (exception) {
      window.alert('käyttäjätunnus tai salasana virheellinen')
    }

    await onLogin()
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('translatorUser')
    setUser(null)
  }

  const login = () => {
    return (
      <div>
        <Togglable buttonLabel="sign up">
          <h2>Sign Up</h2>
          <p>Under construction</p>
        </Togglable>
        <Togglable buttonLabel="login">
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      </div>
    )
  }

  const logout = () => {
    return (
      <div>
        <p>Logged in as {user.username}</p>
        <button onClick={handleLogout}>logout</button>
      </div>
    )
  }

  return (
    <div className="App">
      { user ? logout() : login() }
      <h2>Public Packages</h2>
      { packages.map(p => <PublicPackage key={p._id} content={p}/>) }
      <h2>My Packages</h2>
      { myPackages.map(p => <li key={p._id}> {p.source} == {packages.find(pp => pp._id === p.source).name} </li>) }
    </div>
  )
}

export default App;
