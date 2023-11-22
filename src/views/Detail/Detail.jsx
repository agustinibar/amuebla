import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase/config';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from '../Detail/detail.module.css'

export const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);

  useEffect(()=>{
    const detailId = async () =>{
      try {
        const refProduct = doc(db, 'products' , id)
        const propertySnapshot = await getDoc(refProduct);
    
        if(propertySnapshot.exists()){
          
          setProduct(propertySnapshot.data());
        } else {
          console.log( 'no existe nada de info') 
        }
      } catch (error) {
        console.log(error)
      }
    }
    detailId();
    console.log(product)
  }, [])
  return (
    <>
    <Navbar />
    <div className={styles.detailContainer}>
      {product ? (
        <>
          <img className={styles.productImage} src={product.imageUrl} alt={product.name} />
          <div className={styles.productDetails}>
            <h2 className={styles.productName}>{product.name}</h2>
            <hr></hr>
            
            <h3 className={styles.description}>Descripción:</h3>
            <p className={styles.description}>{product.description}</p>

            <h3 className={styles.availability}>Unidades Disponibles:<p>{product.disponible}</p></h3>
    
            <h4 className={styles.price}>Valor: ${product.productPrice}</h4>
          </div>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  </>
  )
}
