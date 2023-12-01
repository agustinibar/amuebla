import React, { useState } from 'react'
import { Navbar } from '../../components/Navbar/Navbar'
import styles from '../Dashboard/dashboard.module.css'
import { Analisis } from '../../components/AdminMenu/AnalisisTrafico/Analisis'
import { ChargeProduct }  from '../../components/AdminMenu/ChargeProduct/ChargeProduct'
import { Comments } from '../../components/AdminMenu/ComentariosRate/Comments'
import { Gestion } from '../../components/AdminMenu/GestionProducto/Gestion'
import { Orders } from '../../components/AdminMenu/Orders/Orders'
import { SecurityUser } from '../../components/AdminMenu/SeguridadUsuarios/SecurityUser'
import { SellProducts } from '../../components/AdminMenu/SellProducts/SellProducts'
import { Stadistics } from '../../components/AdminMenu/Stadistics/Stadistics'
import { Support } from '../../components/AdminMenu/Support/Support'

export const Dashboard = () => {
    const [selectedComponent, setSelectedComponent] = useState(null)

    const renderComponent = (selectedComponent) => {
        switch (selectedComponent) {
        case 'Analisis':
            return <Analisis/>;
        case 'Charge Product':
            return <ChargeProduct/>;
        case 'Comments':
            return <Comments/>;
        case 'Gestion':
            return <Gestion/>;
        case 'Orders':
            return <Orders/>;
        case 'SecurityUser':
            return <SecurityUser/>;
        case 'Sell Products':
            return <SellProducts/>;
        case 'Stadistics':
            return <Stadistics/>;
        case 'Support':
            return <Support/>;    
          default:
            return null;
        }
      };

      const handleMenuClick = (menuItem) => {
        // Actualiza el estado al hacer clic en un elemento del menú
        setSelectedComponent(menuItem);
      };

  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Charge Product')}>Cargar Producto</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Gestion')}>Gestión de Productos</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Comments')}>Comentarios y Reseñas</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('SecurityUser')}>Seguridad Y Usuarios</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Sell Products')}>Productos Vendidos</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Analisis')}>Análisis de Tráfico</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Orders')}>Órdenes y Transacciones</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Support')}>Ayuda y Soporte</button>
        </li>
        <li className={styles.menuItem}>
          <button className={styles.menuButton} onClick={()=> handleMenuClick('Stadistics')}>Informes y Estadísticas</button>
        </li>
      </ul>
      {selectedComponent && renderComponent(selectedComponent)}
    </div>
  </>
  )
}
