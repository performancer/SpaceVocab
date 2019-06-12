import React from 'react'

const PackagePropsList = ({id, language, words}) => {
  return (
    <ul>
      <li>ID: <b>{id}</b></li>
      <li>Language: <b>{language}</b></li>
      <li>Words: <b>{words}</b></li>
    </ul>
  )
}


export default PackagePropsList
