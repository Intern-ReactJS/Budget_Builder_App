import React, { useState, useEffect } from 'react';
import MonthTable from './MonthTable';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetBuilder = () => {
  const [startMonth, setStartMonth] = useState('January');
  const [endMonth, setEndMonth] = useState('December');
  const [monthsArray, setMonthsArray] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([
    { name: 'Income', subCategories: [{ name: 'General Income'}, { name: 'Other Income' }] }
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    { name: 'Expenses', subCategories: [{ name: 'Operational Expenses' }, { name: 'Salaries & Wages' }] }
  ]);
  const [newIncomeSubCategoryName, setNewIncomeSubCategoryName] = useState('');
  const [newExpenseSubCategoryName, setNewExpenseSubCategoryName] = useState('');

  useEffect(() => {
    const getMonthsInRange = (start, end) => {
      const startIndex = months.indexOf(start);
      const endIndex = months.indexOf(end);
      return months.slice(startIndex, endIndex + 1);
    };

    setMonthsArray(getMonthsInRange(startMonth, endMonth));
  }, [startMonth, endMonth]);

  const handleAddIncomeSubCategory = () => {
    if (newIncomeSubCategoryName) {
      const newSubCategory = { name: newIncomeSubCategoryName, amounts: [] };
      setIncomeCategories(prevIncomeCategories => {
        const updatedIncomeCategories = [...prevIncomeCategories];
        updatedIncomeCategories[0].subCategories.push(newSubCategory); // Thay đổi danh mục chính nếu cần
        return updatedIncomeCategories;
      });
      setNewIncomeSubCategoryName('');
    }
  };
  
  const handleAddExpenseSubCategory = () => {
    if (newExpenseSubCategoryName) {
      const newSubCategory = { name: newExpenseSubCategoryName, amounts: [] };
      setExpenseCategories(prevExpenseCategories => {
        const updatedExpenseCategories = [...prevExpenseCategories];
        updatedExpenseCategories[0].subCategories.push(newSubCategory); // Thay đổi danh mục chính nếu cần
        return updatedExpenseCategories;
      });
      setNewExpenseSubCategoryName('');
    }
  };
  

  return (
    <div className='p-10'>
      <h1 className='text-2xl font-bold mb-4'>Budget Builder</h1>

      <div className='flex mb-6 space-x-4'>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-semibold">Start Month:</label>
          <select
            value={startMonth}
            onChange={(e) => setStartMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-semibold">End Month:</label>
          <select
            value={endMonth}
            onChange={(e) => setEndMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className='mb-4'>
        <input 
          type="text"
          value={newIncomeSubCategoryName}
          onChange={(e) => setNewIncomeSubCategoryName(e.target.value)}
          placeholder="New Income Name"
          className='border p-1 rounded mr-2'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddIncomeSubCategory();
            }
          }}
        />
        <button onClick={handleAddIncomeSubCategory} className='bg-green-500 text-white px-4 py-2 rounded mr-2'>
          Add Income Category
        </button>

        <input 
          type="text"
          value={newExpenseSubCategoryName}
          onChange={(e) => setNewExpenseSubCategoryName(e.target.value)}
          placeholder="New Expense Name"
          className='border p-1 rounded mr-2'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddExpenseSubCategory();
            }
          }}
        />
        <button onClick={handleAddExpenseSubCategory} className='bg-red-500 text-white px-4 py-2 rounded'>
          Add Expense Category
        </button>
      </div>

      <MonthTable
        monthsArray={monthsArray}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
        setIncomeCategories={setIncomeCategories} 
        setExpenseCategories={setExpenseCategories} 
      />
    </div>
  );
};


export default BudgetBuilder;