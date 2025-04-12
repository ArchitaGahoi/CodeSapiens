import { useState, useContext } from 'react';
import TransactionContext from '../../context/TransactionContext';

const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const { addTransaction } = useContext(TransactionContext);

  const onSubmit = (e) => {
    e.preventDefault();
    
    const newTransaction = {
      description: text,
      amount: +amount,
      category,
      type
    };

    addTransaction(newTransaction);
    
    // Reset form
    setText('');
    setAmount('');
    setCategory('Food');
    setType('expense');
  };

  return (
    <div className="form-container">
      <h3>Add New Transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Description</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter description..."
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            required
          />
        </div>
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Housing">Housing</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-control">
          <label>Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              Expense
            </label>
            <label>
              <input
                type="radio"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              Income
            </label>
          </div>
        </div>
        <button className="btn">Add Transaction</button>
      </form>
    </div>
  );
};

export default AddTransaction;