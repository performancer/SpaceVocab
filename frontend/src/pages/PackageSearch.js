import React, { useState, useEffect }  from 'react';
import store from '../store'
import PackageEntry from '../components/PackageEntry'
import packageService from '../services/packages'
import subscriptionService from '../services/subscriptions'

const PackageSearch = () => {
  const [packages, setPackages] = useState(null)
  const [myPackages, setMyPackages] = useState(null)

  useEffect(() => {
    packageService.get().then(packages => setPackages( packages ))

    if(store.getState().user) {
      subscriptionService.get().then(packages => setMyPackages( packages ))
    } else {
      setMyPackages([])
    }
  }, [])

  const addPackage = async (id) => {
      if(!store.getState().user) {
        console.log("you are not logged in")
        return;
      }

      if( myPackages.find(mp => mp.source._id === id || mp.source === id) ){
        console.log("you have already subscribed to this package")
        return;
      }

      console.log(`adding ${id} package to your list`)
      const response = await packageService.addPackage(id)
      setMyPackages([...myPackages, response])
      console.log('package added')
  }

  const removePackage = async (id) => {
    const pack = myPackages.find(p => p.source === id || p.source._id === id)

    if(pack) {
      if(!store.getState().user) {
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

  if(!packages || !myPackages){
    return <div className='loader' />
  }

  return (
    <div>
      <h2>Public Packages</h2>
      {packages.map(p =>
        <PackageEntry
          key={p._id}
          subscribed={myPackages.find(m => m.source === p._id || m.source._id === p._id) ? true : false}
          content={p}
          handleAdd={addPackage}
          handleRemove={removePackage}
        />
      )}
    </div>
  )
}

export default PackageSearch
