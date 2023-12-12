import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auth, db } from '../../firebase/config';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from '../Detail/detail.module.css'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';

export const Detail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [comments, setNewComments] = useState([])
  const [newComment, setNewComment] = useState('');


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
    const postComments = async()=>{
      try {
        const commentsCollectionRef = collection(db, 'comments');

        const q = query(commentsCollectionRef, where( 'product', '==', id));

        const querySnapshot = await getDocs(q);
        
        const comments = querySnapshot.docs.map((doc)=>({
          id:doc.id,
          ...doc.data(),
        }));

        setNewComments(comments)
      } catch (error) {
        console.error(`Error al cargar los comentarios:`, error);

      }
    };
    detailId();
    postComments();
    
  }, []);


 

  const addProduct = async()=>{
    try {
      // Obtener el documento del usuario actual
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnapshot = await getDoc(userDoc);

      // Verificar si el documento del usuario existe en Firestore
      if (docSnapshot.exists()) {
        // Verificar si el producto ya está en el carrito
        const existingProduct = docSnapshot.data().shoppingCart.find(item => item.productId === id);

        if (existingProduct) {
          // Si el producto ya está en el carrito, actualizar la cantidad sumándole un número específico
          const incrementAmount = 1; // Puedes ajustar este número según tus necesidades
          await updateDoc(userDoc, {
            shoppingCart: docSnapshot.data().shoppingCart.map(item => (
              item.productId === id
                ? { ...item, quantity: item.quantity + incrementAmount }
                : item
            )),
          });
        } else {
          // Si el producto no está en el carrito, agregarlo con cantidad 1
          await updateDoc(userDoc, {
            shoppingCart: arrayUnion({ productId: id, quantity: 1 }),
          });
        }
      } else {
        // Si el documento no existe, crear uno nuevo con el campo "shoppingCart"
        await setDoc(userDoc, {
          email: auth.currentUser.email,
          shoppingCart: [{ productId: id, quantity: 1 }],
        });
      }
    
      alert("El producto se ha cargato al carrito correctamente")
    } catch (error) {
     console.error("Hubo un error al cargar el producto", error) 
    }
  }
  const handleNewComment = async(e)=>{
    try {
      e.preventDefault();
      const commentsCollectionRef = collection(db, 'comments');

      await addDoc(commentsCollectionRef, {
        clientId: auth.currentUser.uid,
        comment: newComment,
        answer: '',
        product: id
      })

      setNewComment('')
    } catch (error) {
      console.error('Error al cargar comentario:', error)
    }
  }
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
            
            <h3 className={styles.descriptionTittle}>Descripción:</h3>
            <p className={styles.description}>{product.description}</p>

            <h3 className={styles.availability}>Unidades Disponibles:<p className={styles.availabilityNumber}>{product.disponible} unidades</p></h3>
    
            <h4 className={styles.price}>Valor: ${product.productPrice}</h4>
            <button
              type="button"
              className={styles.whatsappButton}
              onClick={() => {
                window.open('https://wa.me/5493487522074', '_blank');
              }}
            >
              Contáctanos por WhatsApp
            </button>
            <button className={styles.comprarButton} onClick={addProduct}>Añade al carrito</button>
                </div>
        </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <div className={styles.commentsSection}>
        <h3>Comentarios:</h3>
        <ul className={styles.commentsList}>
          {comments.map((comment, index) => (
            <li key={index} className={styles.commentItem}>
              <p>- {comment.comment} -</p>
              <p>- {comment.answer} -</p>
            </li>
          ))}
        </ul>
        <form className={styles.commentForm} onSubmit={handleNewComment}>
          <h3>Deseas saber algo mas del producto?</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder=""
          />

          <button type="submit" className={styles.commentButton}>
            Enviar
          </button>
         
        </form>
      </div>
  </>
  )
}
