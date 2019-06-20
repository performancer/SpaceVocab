import React, { useState, useEffect } from 'react';
import PackageEntry from './PackageEntry'
import packageService from '../services/packages'

const PackageSearch = () => {
  const [packages, setPackages] = useState(null)

  useEffect(() => {
    packageService.get().then(packages => {
      setPackages( packages )
      console.log(packages)
    })
  }, [])

  if(!packages)
    return <div className='loader' />

  return (
    <div>
      <h2>Search Packages</h2>
      { packages.map(p => <PackageEntry key={p.id} content={p}/>) }
    </div>
  )
}

export default PackageSearch
