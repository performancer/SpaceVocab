import React from 'react'
import { withRouter } from 'react-router-dom'

import PackagePropsList from './PackagePropsList'

const PackageEntry = (props) => {
  const {id, name, rating, language, words, author } = props.content

  const details = () => props.history.push(`/packages/${id}`)

  return (
    <div className='package' >
      <div className='flexContainer'>
        <div className='flexItem'>
          <h3 className='pointer' onClick={details}>
            <span className='fa fa-folder-o'/>
            {' '}{name}
          </h3>
        </div>
        <b className={rating >= 0 ? 'success' : 'error'}>
          <span className={rating >= 0 ? 'fa fa-smile-o' : 'fa fa-meh-o'} />
          {` ${rating}`}
        </b>
      </div>

      <div className='flexContainer'>
        <div className='flexItem'>
          <PackagePropsList id={id} language={language} words={words.length}
            author={author ? author.username : null}
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
