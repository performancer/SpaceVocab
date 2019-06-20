import React, { useState, useEffect } from 'react';
import { useField } from '../hooks'
import PackageEntry from './PackageEntry'
import packageService from '../services/packages'

const PackageSearch = () => {
  const [packages, setPackages] = useState(null)
  const keyword = useField('keyword')

  useEffect(() => {
    packageService.get().then(packages => {
      //calculate rating from opinions
      packages = packages.map(p => {
        p.rating = p.opinions.filter(o => o.value > 0).length
            - p.opinions.filter(o => o.value < 0).length
        return p
      })

      setPackages( packages )
      console.log(packages)
    })
  }, [])

  const compare = (packet, key) =>
    includes(packet.name, key)
    || includes(packet.details, key)
    || includes(packet.language, key)
    || includes(packet.id, key)

  const includes = (a, b) => a && a.toLowerCase().includes(b.toLowerCase())

  if(!packages)
    return <div className='loader' />

  return (
    <div>
      <h2>Search Packages</h2>
      <input type='text' placeholder='enter a keyword '{...keyword.collection}/>
      {
        packages
        .filter(packet => compare(packet, keyword.value))
        .sort((a, b) => b.rating - a.rating)
        .map(packet => <PackageEntry key={packet.id} content={packet}/>)
      }
    </div>
  )
}

export default PackageSearch
