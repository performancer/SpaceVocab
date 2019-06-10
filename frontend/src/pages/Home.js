import React, { useState, useEffect }  from 'react';
import UserPackage from '../components/UserPackage'
import packageService from '../services/packages'
import '../loader.css'

const Home = ({user}) => {
  const [packages, setPackages] = useState(null)

  useEffect(() => {
    if(user) {
      packageService.getMine().then(packages => setPackages( packages ))
    } else {
      setPackages(null)
    }
  }, [user])

  const removePackage = async (id) => {
      try {
        console.log(`removing package ${id}`)
        await packageService.removePackage(id)
        setPackages(packages.filter(p => p._id !== id))
        console.log('package removed')
      } catch (exception) {
        console.log(exception)
      }
  }

  if(!user) {
    return <div>You need to log in to view your packages</div>
  }

  if(!packages){
    return <div className='loader' />
  }

  return (
    <div>
      <h2>My Packages</h2>
      { packages.length === 0 ? <div><p>No packages yet. :(</p> <p>Search for packages and subscribe to them.</p></div>
        : packages.map(p => <UserPackage key={p._id} content={p} remove={removePackage} />)}
    </div>
  )
}

export default Home
