import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { getDownloadURL, ref } from 'firebase/storage';
import styles from '../Home/home.module.css'
import { Link, NavLink } from 'react-router-dom';

export const Home = () => {
  const [products, setProducts] = useState([])

  const productsCollectionRef= collection(db, "products"); 
  
  useEffect(() => {
    const getProductList = async () => {
      try {
        const data = await getDocs(productsCollectionRef);
        const filterData = await Promise.all(
          data.docs.map(async (doc) => {
            const propertyData = doc.data();

            if (propertyData.imageUrl) {
              const imageUrlRef = ref(storage, propertyData.imageUrl);
              propertyData.imageUrl = await getDownloadURL(imageUrlRef);
            }

            return {
              ...propertyData,
              id: doc.id,
            };
          })
        );

        setProducts(filterData);
      } catch (error) {
        console.log(error);
      }
    };

    getProductList();
  }, [productsCollectionRef]);
  
  return (
    <>
      <Navbar />
      <div className={styles.cardContainer}>
        {products.map((product) => (
          <NavLink to={`/detail/${product.id}`}>
          <div className={styles.card} key={product.id}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Disponibilidad: {product.disponible}</p>
            <p>Precio: {product.productPrice}</p>
          </div>
          </NavLink>
        ))}
      </div>
    </>
  )
}
