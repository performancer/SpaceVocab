import React, { useState, useEffect }  from 'react';
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

  return (
    <div>
      <h2>My Packages</h2>
      { myPackages.map(p => <UserPackage key={p._id} content={p} remove={removePackage} />)}
    </div>
  )
}

export default Home
