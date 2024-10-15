import React from 'react'
import './error.css'
import { Link } from 'react-router-dom'
const NotAuthorized = () => {
  return (
    <div className="error-container">
     <div className="lock"></div>
     <div className='statement'>
      <h1>You are not authorized</h1>
      <p>You tried to access a page you did not have prior authorization for.</p>
      <p>If you want to register your Institute Please Contact  <span id='mailId'>support@edubuk.com</span> or <span id='mailId'>support@edubukeseal.org</span></p>
      <Link to='/'>Go Back Home</Link>
      </div>
    </div>
  )
}

export default NotAuthorized
