import { signOut } from 'firebase/auth'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import styles from '../Navbar/navbar.module.css';

export const Navbar = () => {
  const navigate = useNavigate();

  const logOut = async()=>{
    try {
        await signOut(auth)
        navigate("/")
    } catch (error) {
        console.log(error)
    }
}

const toDashboard = async()=>{
  try {
    if(auth.currentUser.email === "agustinibarperrotta@gmail.com"){
      navigate("/dashboard")
    }
  } catch (error) {
    console.log(error)
  }
}
  return (
    <nav className={styles.navbar}>
    <Link to="/home" className={styles.navbarTitle}>
      A-muebla
    </Link>
    <div>
      <button className={styles.navbarButton} onClick={toDashboard}>
        Dashboard
      </button>
    </div>
    <div>
      <button className={styles.navbarButton} onClick={logOut}>
        Logout
      </button>
    </div>
  </nav>
  )
}
