import React from 'react'
import styles from '../Footer/footer.module.css'
export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <p className={styles.year}>&copy; 2023</p>
        <h3 className={styles.tittle}>Chateau. </h3>
        <p> Todos los derechos reservados.</p>
      </div>
    </div>
  )
}
