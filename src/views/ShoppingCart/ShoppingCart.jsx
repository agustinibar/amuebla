import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { auth, db } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore';
import styles from '../ShoppingCart/shoppingcart.module.css';

export const ShoppingCart = () => {
    const currentUser = auth.currentUser;
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0)

    useEffect(() => {
        const fetchCartItems = async () => {
          try {
            if (currentUser) {
              const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    
              if (userDoc.exists() && userDoc.data().shoppingCart) {
                const cartProducts = userDoc.data().shoppingCart;
    
                // Obtén información detallada de cada producto en el carrito
                const productsPromises = cartProducts.map(async (item) => {
                  const productDoc = await getDoc(doc(db, 'products', item.productId));
                  const productData = { ...productDoc.data(), quantity: item.quantity };
                  
                  // Calcula el total y agrega el campo total al objeto del producto
                  productData.total = productData.quantity * productData.productPrice;
    
                  return productData;
                });
    
                // Espera a que se completen todas las consultas
                const productsData = await Promise.all(productsPromises);
    
                setCartItems(productsData);
                const total = productsData.reduce((acc, item)=> acc + item.total, 0);

                setTotalAmount(total)
              }
            }
          } catch (error) {
            console.error('Error al obtener el carrito de compras:', error);
          }
        };
    
        fetchCartItems();
      }, [currentUser]);
    
    
 console.log(cartItems)


  return (
        <>
        <Navbar/>
        <div className={styles.shoppingCartContainer}>
            <h1 className={styles.cartHeader}>Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <p>Cargando...</p>
            ) : (
                <ul className={styles.cartList}>
                {cartItems.map((item) => (
                    <li key={item.productId} className={styles.cartItem}>
                    <div className={styles.productInfo}>
                        <p className={styles.productName}>Nombre: {item.name}</p>
                        <p className={styles.productQuantitys}>Cantidad: {item.quantity}</p>
                        <p className={styles.productPrice}>Precio: ${item.productPrice.toLocaleString()}</p>
                        <p className={styles.productPrice}>Total p/ Producto: ${item.total.toLocaleString()}</p>
                    </div>
                    </li>
                ))}
                    <li className={styles.cartItem}>
                      <div className={styles.productInfo}>
                        <p className={styles.totalAmount}>Total a Pagar: ${totalAmount.toLocaleString()}</p>
                      </div>
                    </li>
                </ul>
            )}
        </div>
        </>
    );
  };