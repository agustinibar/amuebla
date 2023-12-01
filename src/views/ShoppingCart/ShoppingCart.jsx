import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import { auth, db } from '../../firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from '../ShoppingCart/shoppingcart.module.css';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';

export const ShoppingCart = () => {

    const [currentUser, setCurrentUser] = useState(auth.currentUser);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0)
    const [preferenceId, setPreferenceId] = useState(null);   
    const [dataLoaded, setDataLoaded] = useState(false)
    
    initMercadoPago("TEST-b1609369-11aa-4417-ac56-d07ef28cfcff");

    
    useEffect(() => {
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });
  
      return () => {
        unsubscribeAuth(); 
      };
    }, []);
  
    useEffect(() => {
      const fetchCartItems = async () => {
        try {
          if (currentUser) {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    
            if (userDoc.exists() && userDoc.data().shoppingCart) {
              const cartProducts = userDoc.data().shoppingCart;
    
              const productsPromises = cartProducts.map(async (item) => {
                const productData = {
                  description: item.description,
                  disponible: item.disponible,
                  imageUrl: item.imageUrl,
                  name: item.name,
                  productPrice: item.productPrice,
                  quantity: item.quantity,
                  total: item.total,
                };
    
                return productData;
              });
    
              const productsData = await Promise.all(productsPromises);
    
              setCartItems(productsData);
              const total = productsData.reduce((acc, item) => acc + item.total, 0);
              setTotalAmount(total);
              setDataLoaded(true);
            }
          }
        } catch (error) {
          console.error('Error al obtener el carrito de compras:', error);
        }
      };
    
      fetchCartItems();
    }, [currentUser]);

    
      const createPreference = async()=>{
        try {
          if(!cartItems){
            return null;
          }
          const description = cartItems.map((item)=> item.name).join(', ')
          
          const response = await axios.post(`https://apimercadopago.onrender.com/createorder`,{
            description: `${description}`,
            price:`${totalAmount}`,
            quantity: `1`,
            currency_id: "ARS"
          });
    
          const {id} = response.data;
    
          return id; 
        } catch (error) {
          console.error(`Error al crear la preferencia de pago:`, error);
          return null;
        }
      };
      const handleBuyMercadoPago = async()=>{
        try {
          const id = await createPreference();
          if(id){
            setPreferenceId(id)
          }
        } catch (error) {
          console.error(`HandleBuyError`, error)
        }
      };
      
      const updateTotalAmount = (items) => {
        const total = items.reduce((acc, item) => acc + item.total, 0);
        setTotalAmount(total);
      };
    
      const updateCartInFirestore = async(updatedCart)=>{ 
        try {
          if(auth.currentUser){
            const userDocRef =  doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, {shoppingCart: updatedCart})
          }
        } catch (error) {
          console.error("Ocurrio un problema al actualizar el carrito:", error)
        }
      };

      const handleIncreaseQuantity = (name) => {
        const updatedCart = cartItems.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.productPrice }
            : item
        );
    
        setCartItems(updatedCart);
        updateCartInFirestore(updatedCart);
        updateTotalAmount(updatedCart);
      };
    
      const handleDecreaseQuantity = (name) => {
        const updatedCart = cartItems.map((item) =>
          item.name === name
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - 1),
                total: Math.max(1, item.quantity - 1) * item.productPrice
              }
            : item
        );
    
        setCartItems(updatedCart);
        updateCartInFirestore(updatedCart);
        updateTotalAmount(updatedCart);
      };
      const handleRemoveProduct = (name) => {
        const updatedCart = cartItems.filter((item) => item.name !== name);
      
        setCartItems(updatedCart);
        updateCartInFirestore(updatedCart);
        updateTotalAmount(updatedCart); 
      };
     
  return (
        <>
        <Navbar/>
        <div className={styles.shoppingCartContainer}>
            <h1 className={styles.cartHeader}>Carrito de Compras</h1>
            {!dataLoaded ? (
                <p>Cargando...</p>
            ) : (
                <ul className={styles.cartList}>
                {cartItems.map((item) => (
                    <li key={item.name} className={styles.cartItem}>
                    <div className={styles.productInfo}>
                        <p className={styles.productName}>Nombre: {item.name}</p>
                        <p className={styles.productQuantitys}>
                        Cantidad: 
                        <button onClick={() => handleIncreaseQuantity(item.name)}>+</button>
                        {item.quantity}{' '}
                        <button onClick={() => handleDecreaseQuantity(item.name)}>-</button>
                      </p>
                        <p className={styles.productPrice}>Precio: ${item.productPrice?.toLocaleString()}</p>
                        <p className={styles.productPrice}>Total p/ Producto: ${item.total?.toLocaleString()}</p>
                        <span className={styles.removeButton} onClick={()=> handleRemoveProduct(item.name)} role="img" aria-label="cruz">❌</span>
                    </div>
                    </li>
                ))}
                    <li className={styles.cartItem}>
                      <div className={styles.productInfo}>
                        <p className={styles.totalAmount}>Total a Pagar: ${totalAmount.toLocaleString()}</p>
                        <button className={styles.mercadoPagoButton} onClick={handleBuyMercadoPago}>Mercado Pago</button>
                        {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
                      </div>
                    </li>
                </ul>
            )}
        </div>
        </>
    );
  };