
import React, { useEffect, useState } from 'react';
import styles from '../SearchBar/searchbar.module.css';

export const SearchBar = ({ products, onSearchResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const filteredResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);

    // Llama a la función onSearchResults solo si hay un término de búsqueda
    if (searchTerm) {
      onSearchResults(filteredResults);
    }
  }, [searchTerm, products, onSearchResults]);

  return (
    <>
       <div className={styles.searchBarContainer}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    </>
  );
};