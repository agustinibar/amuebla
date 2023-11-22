import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../../firebase/config';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import styles from '../Landing/landing.module.css';

export const Landing = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  console.log(auth?.currentUser?.email);
  // funcion para signIn
  const signIn = async()=>{
      try {
          await createUserWithEmailAndPassword(auth, email, password);      
          navigate('/home')
      } catch (error) {
          console.log(error)
      }
  };
  const signInGoogle = async()=>{
      try {
          await signInWithPopup(auth, googleProvider);
          navigate('/home')
      } catch (error) {
          console.log(error)
      }
  };
  const logOut = async()=>{
      try {
          await signOut(auth)
      } catch (error) {
          console.log(error)
      }
  }
  return(
      <div className={styles.loginContainer}>
      <input
        className={styles.loginInput}
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input
        className={styles.loginInput}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      ></input>
      <button className={styles.loginButton} onClick={signIn}>
        Sign In
      </button>
      <button className={styles.loginButton} onClick={signInGoogle}>
        Google
      </button>
      <button className={styles.loginButton} onClick={logOut}>
        Log Out
      </button>
    </div>
  )
}
