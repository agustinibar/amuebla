import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../firebase/config';
import { createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import styles from '../Landing/landing.module.css';
import landingPage from '../../assets/landingPage.mp4';
import { doc, getDoc, setDoc } from 'firebase/firestore';


export const Landing = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();



  // funcion para signIn
  const signIn = async()=>{
      try {
          await createUserWithEmailAndPassword(auth, email, password);      

          const userDoc = doc(db, 'users', auth.currentUser.uid);
          const docSnapshot = await getDoc(userDoc);

          if (!docSnapshot.exists()) {
            await setDoc(userDoc, {
              email: auth.currentUser.email,
              shoppingCart: []          
            });

          }

          navigate('/home')
      } catch (error) {
          console.log(error)
      }
  };
  const signInGoogle = async()=>{
      try {
          await signInWithPopup(auth, googleProvider);

          const userDoc = doc(db, 'users', auth.currentUser.uid);
          const docSnapshot = await getDoc(userDoc);

          if (!docSnapshot.exists()) {
            await setDoc(userDoc, {
              email: auth.currentUser.email,
              shoppingCart: []          
            });

          }
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
    <video className={styles.videoBackground} autoPlay loop muted>
      <source src={landingPage} type="video/mp4" />
      Tu navegador no soporta el elemento de video.
    </video>

    <div className={styles.overlay}>
      <h1 className={styles.title}>Chateau Design</h1>
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
    </div>
  </div>
  )
}
