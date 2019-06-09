import React from 'react'
import Togglable from './Togglable'

const PackageInfo = ({content, handlers}) => {
  const {handle, text} = handlers

  const style = {
    borderStyle: 'solid',
    borderColor: 'gray',
    borderRadius: '5px',
    padding: '5px'
  }

  const background = {
    backgroundColor: 'LightBlue',
    margin: 5
  }

  return (
    <div style={style} >
    <h4>{content.name}</h4>

    <button onClick={ () => handle(content._id)}>{text}</button>
    <button>like</button>

    <p>
      Language: {content.language}<br />
      Words: {content.words.length}<br />
      Likes: 0
    </p>
    <Togglable buttonLabel='show words' closeLabel='hide'>
      <p>
        {content.words.map(w => <b key={w._id} style={background}>{w.word}</b>)}
      </p>
    </Togglable>
    </div>
  )
}

export default PackageInfo
