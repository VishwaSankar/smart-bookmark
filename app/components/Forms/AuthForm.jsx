'use client'
import React from 'react'
import { signinWithGoogle } from '../../utils/actions'

const AuthForm = () => {
  return (
    <div>
        <form>
            <button className='btn' formAction={signinWithGoogle}>Sign In with Google</button>
        </form>
    </div>
  )
}

export default AuthForm