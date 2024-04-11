// import React, { useState } from 'react';
// import { faqs } from '../DATA';
// import SearchBar from './SearchBar';
// import FAQList from './FaqList';

// const FAQPage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredFAQs, setFilteredFAQs] = useState([]);

//   const handleSearchChange = (e) => {
//     const searchTerm = e.target.value.toLowerCase();
//     setSearchTerm(searchTerm);
//     setFilteredFAQs(faqs.filter(faq => faq.question.toLowerCase().includes(searchTerm)));
//   };

//   return (
//     <div>
//       <h1>Buscador de Preguntas Frecuentes</h1>
//       <SearchBar onChange={handleSearchChange} />
//       <FAQList faqs={filteredFAQs.length > 0 ? filteredFAQs : faqs} />
//     </div>
//   );
// };

// export default FAQPage;