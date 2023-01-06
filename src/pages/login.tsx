import React from 'react'
import { auth, provider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider)
    navigate("/")
  }

  return (
    <div>
      <p> Sign In With Google To Continue </p>
      <button onClick={signInWithGoogle}> Sing In With Google </button>
    </div>
  )
}

export default Login