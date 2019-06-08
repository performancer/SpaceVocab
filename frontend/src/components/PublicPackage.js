import React from 'react'

const PublicPackage = ({content}) => {

  return (
    <div>
    <h4>{content.name}</h4>
    Language: {content.language} Words: {content.words.length}

    {content.words.map(w => <li>{w.word}</li>)}
    </div>
  )
}

export default PublicPackage
