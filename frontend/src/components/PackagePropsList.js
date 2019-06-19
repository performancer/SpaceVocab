import React from 'react'

const PackagePropsList = ({id, language, words, author}) => {
  return (
    <ul>
      <PropsEntry attribute='ID' value={id} />
      <PropsEntry attribute='Language' value={language} />
      <PropsEntry attribute='Words' value={words} />
      <PropsEntry attribute='Author' value={author} />
    </ul>
  )
}

const PropsEntry = ({attribute, value}) => <li>{attribute}: <b>{value}</b> </li>

export default PackagePropsList
