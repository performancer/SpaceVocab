import React from 'react'
import Togglable from './Togglable'

const PackageInfo = ({content, add}) => {

  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: '5px'
  }

  return (
    <div style={style} >
    <h4>{content.name}</h4>

    <button onClick={ () => add(content._id)}>add</button>
    <button>like</button>

    <p>
      Language: {content.language}<br />
      Words: {content.words.length}<br />
      Likes: 0
    </p>
    <Togglable buttonLabel='show words'>
      {content.words.map(w => <li key={w._id}>{w.word}</li>)}
    </Togglable>
    </div>
  )
}

export default PackageInfo
