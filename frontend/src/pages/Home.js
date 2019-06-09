import React, { useState, useEffect }  from 'react';

import LoginForm from '../components/LoginForm'
import Togglable from '../components/Togglable'
import PackageInfo from '../components/PackageInfo'
import UserPackage from '../components/UserPackage'

import loginService from '../services/login'
import packageService from '../services/packages'

import token from '../utils/token'

const Home = ({user}) => {
  const [packages, setPackages] = useState([])
  const [myPackages, setMyPackages] = useState([])

  useEffect(() => {
    packageService.getPublic().then(packages => setPackages( packages ))

    if(user) {
      packageService.getMine().then(packages => setMyPackages( packages ))
    } else {
      setMyPackages([])
    }
  }, [user])

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
      { renderPackages() }
    </div>
  )
}

export default Home
