import React, { useState, useEffect }  from 'react';

import LoginForm from '../components/LoginForm'
import Togglable from '../components/Togglable'
import PackageInfo from '../components/PackageInfo'
import UserPackage from '../components/UserPackage'

import packageService from '../services/packages'

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
    const pack = myPackages.find(p => p.source === id)

    if(pack) {
      if(!user) {
        console.log("you are not logged in")
        return;
      }

      try {
        console.log(`removing package ${pack._id}`)
        await packageService.removePackage(pack._id)
        setMyPackages(myPackages.filter(p => p._id !== pack._id))
        console.log('package removed')
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  const getMode = (id) => {
      if(myPackages.find(p => p.source === id)) {
        return { handle: removePackage, text: 'unsubscribe'}
      } else {
        return { handle: addPackage, text:'subscribe'}
      }
  }

  return (
    <div>
      <h2>Public Packages</h2>
      { packages.map(p => <PackageInfo key={p._id} content={p} handlers={getMode(p._id)}/>) }
    </div>
  )
}

export default Home;
