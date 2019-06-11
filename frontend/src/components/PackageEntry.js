import React from 'react'
import { withRouter } from 'react-router-dom'

const PackageEntry = (props) => {
  const {content} = props

  const getRate = () => {
    const likes = content.likes.filter(o => o.value > 0 ).length
    const dislikes = content.likes.filter(o => o.value < 0 ).length

    return likes - dislikes
  }

  const details = () => {
    props.history.push(`/packages/${content._id}`)
  }

  const rate = getRate()

  return (
    <div className='package' >
      <div className='flexContainer'>
        <div className='flexItem'>
          <h3><span className='fa fa-folder-o'/> {content.name}</h3>
        </div>
        <div className='flexItem'>
          <b className='right'>
            <span className={rate < 0 ? 'error' : 'success' }>
              <span className={rate < 0 ? 'fa fa-meh-o' : 'fa fa-smile-o' }/>
              {' '}{rate}
            </span>
          </b>
        </div>
      </div>
      <div className='flexContainer'>
        <div className='flexItem'>
          <ul>
            <li>Language: <b>{content.language}</b></li>
            <li>Words: <b>{content.words.length}</b></li>
          </ul>
        </div>
        <div className='flexItem'>
          <div className='relative'>
            <button className='rightbottom' onClick={details}>
                View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PackageEntryComponent = withRouter(PackageEntry)
export default PackageEntryComponent
