import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { auth, db, storage } from '../../firebase/config';
import { Navbar } from '../../components/Navbar/Navbar';
import styles from '../Dashboard/dashboard.module.css';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

export const Dashboard = () => {
    const [newProductName, setNewProductName] = useState("");
    const [newProductDescription, setNewProductDescription] = useState("");
    const [disponible, setNewDisponible] = useState(0);
    const [productPrice, setProductPrice] = useState(0);
    const [file, setFile] = useState(null);

   //rutas de informacion:
   const productsCollectionRef= collection(db, "products"); 
 
   //funcion para crear propiedades
   const onSubmitProp = async () => {
     try {
       let imageUrl = null; 
       
       if(file){
        const folderRef = ref(storage, `products/${file.name + v4()}`);
        await uploadBytes(folderRef, file);
        imageUrl = await getDownloadURL(folderRef);
       }
       
         await addDoc(productsCollectionRef, {
           name: newProductName,
           description: newProductDescription,
           disponible: disponible,
           productPrice: productPrice,
           imageUrl: imageUrl,
           userId: auth?.currentUser?.uid,
         });
     
 
       // se limpia el estado 
       setNewProductName("");
       setNewProductDescription("");
       setNewDisponible(0);
       setProductPrice(0);
       setFile(null);
       alert('El producto se ha cargado con exito!');
     } catch (error) {
       console.log(error)
     }
   };
    return (
      <>
      <Navbar />
      <div className={styles.createContainer}>
      <h1>Especificaciones del producto: </h1>
      <input
        className={styles.formInput}
        placeholder="Nombre"
        onChange={(e) => setNewProductName(e.target.value)}
      ></input>
      <input
        className={styles.formInput}
        placeholder="Descripcion"
        onChange={(e) => setNewProductDescription(e.target.value)}
      ></input>
      <input
        className={styles.formInput}
        placeholder="Disponibilidad"
        type='number'
        onChange={(e) => setNewDisponible(e.target.value)}
      ></input>
        <input
        className={styles.formInput}
        placeholder="Precio"
        type='text'
        onChange={(e) => setProductPrice(parseFloat(e.target.value))}
      ></input>
       <input
              className={styles.range}
              onChange={(e)=> setFile(e.target.files[0])}
              type="file"
              name="imageFile"
              accept="image/*"
            />
            <p>{file?.name}</p>
      <button className={styles.createButton} onClick={onSubmitProp}>
        Cargar producto
      </button>
    </div>
      </>
  )
}