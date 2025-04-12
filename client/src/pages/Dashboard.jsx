import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import TransactionContext from '../context/TransactionContext';
import AddTransaction from '../components/transactions/AddTransaction';
import TransactionList from '../components/transactions/TransactionList';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { transactions, getTransactions } = useContext(TransactionContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getTransactions();
    }
  }, [user, navigate, getTransactions]); // Added dependencies

  return (
    <div className="dashboard">
      <button onClick={logout}>Logout</button>
      <AddTransaction />
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default Dashboard;