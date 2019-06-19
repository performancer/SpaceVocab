import React from 'react'
import { withRouter } from 'react-router-dom'

import PackagePropsList from './PackagePropsList'

const PackageEntry = (props) => {
  const {content} = props

  const details = () => {
    props.history.push(`/packages/${content.id}`)
  }

  const getRating = () => {
    const likes = content.opinions.filter(o => o.value > 0 ).length
    const dislikes = content.opinions.filter(o => o.value < 0 ).length

    const rate = likes - dislikes
    const color = rate >= 0 ? 'success' : 'error'
    const emoji = rate >= 0 ? 'fa fa-smile-o' : 'fa fa-meh-o'

    return (
      <b className={color}>
        <span className={emoji} />
        {' '}{rate}
      </b>
    )
  }

  return (
    <div className='package' >
      <div className='flexContainer'>
        <div className='flexItem'>
          <h3 className='pointer' onClick={details}>
            <span className='fa fa-folder-o'/>
            {' '}{content.name}
          </h3>
        </div>
        { getRating() }
      </div>

      <div className='flexContainer'>
        <div className='flexItem'>
          <PackagePropsList
            id={content.id}
            language={content.language}
            words={content.words.length}
            author={content.author ? content.author.username : null}
          />
        </div>
        <div className='relative'>
          <button className='rightbottom' onClick={details}>
              View Details
          </button>
        </div>
      </div>
    </div>
  )
}

const PackageEntryWithHistory = withRouter(PackageEntry)
export default PackageEntryWithHistory
