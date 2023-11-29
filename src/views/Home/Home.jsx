import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../../firebase/config';
import { getDownloadURL, ref } from 'firebase/storage';
import styles from '../Home/home.module.css'
import { Link, NavLink } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { Footer } from '../../components/Footer/Footer';

export const Home = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([]);

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
        setFilteredProducts(filterData);
      } catch (error) {
        console.log(error);
      }
    };

    getProductList();
  }, [productsCollectionRef]);
  
  const handleSearchResults = (filteredProducts) => {
    setProducts(filteredProducts);
  };

  return (
    <>
      <Navbar />
      <h1>Busca por nombre: </h1>
      <SearchBar
      products={products}
      onSearchResults={handleSearchResults}
      />
      <div className={styles.cardContainer}>
        {products.map((product) => (
          <>
          <div className={styles.card} key={product.id}>
          <NavLink to={`/detail/${product.id}`}>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
          </NavLink>
            <p>{product.description}</p>
            <p>Disponibilidad: {product.disponible} unidades</p>
            <p>Precio: ${product.productPrice}</p>
          </div>
          </>
        ))}
      </div>
    </>
  )
}
