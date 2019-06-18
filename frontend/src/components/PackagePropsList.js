import React from 'react'

const PackagePropsList = ({id, language, words, author}) => {
  return (
    <ul>
      <li>ID: <b>{id}</b></li>
      <li>Language: <b>{language}</b></li>
      <li>Words: <b>{words}</b></li>
      <li>Author:  <b>{author ? author.username : ''}</b></li>
    </ul>
  )
}


export default PackagePropsList
