
import React from 'react'
import './content.css'
const Content = (props) => {
  return (
    <div className={`content mb-3 mb-sm-0 p-md-3 ${props.className? props.className: ''}`}>
    {props.children}
    </div>
  )
}

export default Content