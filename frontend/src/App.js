import React, { useState, useEffect }  from 'react';

import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import PackageInfo from './components/PackageInfo'
import UserPackage from './components/UserPackage'

import loginService from './services/login'
import packageService from './services/packages'

import token from './utils/token'

function App() {
  const [user, setUser] = useState(null)
  const [packages, setPackages] = useState([])
  const [myPackages, setMyPackages] = useState([])

  const onLogin = async () => {
    const packages = await packageService.getMine()
    setMyPackages( packages )
  }

  useEffect(() => {
    packageService.getPublic().then(packages => setPackages( packages ))
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
      console.log("logging in...")

      const user = await loginService.login(credentials)
      window.localStorage.setItem('translatorUser', JSON.stringify(user))
      setUser(user)
      token.setToken(user.token)

      console.log("logged in successfully")
    } catch (exception) {
      window.alert('invalid username and/or password')
    }

    await onLogin()
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('translatorUser')
    setUser(null)
  }

  const addPackage = async (id) => {
      if(!user) {
        console.log("you are not logged in")
        return;
      }

      if( myPackages.find(mp => mp.source === id) ){
        console.log("you have already subscribed to this package")
        return;
      }

      console.log(`adding ${id} package to your list`)
      const response = await packageService.addPackage(id)
      setMyPackages([...myPackages, response])
      console.log('package added')
  }

  const removePackage = async (id) => {
      if(!user) {
        console.log("you are not logged in")
        return;
      }

      try {
        console.log(`removing package ${id}`)
        await packageService.removePackage(id)
        setMyPackages(myPackages.filter(p => p._id !== id))
        console.log('package removed')
      } catch (exception) {
        console.log(exception)
      }
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

  const renderPackages = () => {

    if(!myPackages || !packages)
      return;

    return (
      <div>
        <h2>My Packages</h2>
        { myPackages.map(p => <UserPackage key={p._id} content={p} remove={removePackage} />)}

      </div>
    )
  }

  const getSource = (id) => {
    const source = packages.find(p => p._id === id)
    return source
  }

  return (
    <div className="App">
      { user ? logout() : login() }
      <h2>Public Packages</h2>
      { packages.map(p => <PackageInfo key={p._id} content={p} add={addPackage}/>) }
      { renderPackages() }
    </div>
  )
}

export default App;
