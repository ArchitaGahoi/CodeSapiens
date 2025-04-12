import { createContext, useState } from 'react';
import axios from 'axios';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  
  // Add your transaction functions here
  
  return (
    <TransactionContext.Provider value={{ transactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;