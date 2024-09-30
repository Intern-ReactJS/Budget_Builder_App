import React, { useState, useEffect, useRef } from "react";

const MonthTable = ({
  monthsArray,
  incomeCategories,
  expenseCategories,
  setIncomeCategories,
  setExpenseCategories,
}) => {
  const [incomeTotal, setIncomeTotal] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState([]);
  const [openingBalance, setOpeningBalance] = useState([0]);
  const [closingBalance, setClosingBalance] = useState([]);
  const [profitLoss, setProfitLoss] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = Array(
      incomeCategories.length + expenseCategories.length
    )
      .fill()
      .map((_, i) =>
        Array(monthsArray.length)
          .fill()
          .map(() => React.createRef())
      );
  }, [incomeCategories.length, expenseCategories.length, monthsArray.length]);

  const handleInputChange = (
    categoryType,
    categoryIndex,
    subCategoryIndex,
    monthIndex,
    value
  ) => {
    const newValue = value.trim() === "" ? 0 : parseFloat(value);

    if (categoryType === "income") {
      const updatedIncomeCategories = [...incomeCategories];
      if (
        !updatedIncomeCategories[categoryIndex].subCategories[subCategoryIndex]
          .amounts
      ) {
        updatedIncomeCategories[categoryIndex].subCategories[
          subCategoryIndex
        ].amounts = [];
      }
      updatedIncomeCategories[categoryIndex].subCategories[
        subCategoryIndex
      ].amounts[monthIndex] = newValue;

      const subTotal = calculateTotalForSubCategories(
        updatedIncomeCategories[categoryIndex].subCategories,
        monthIndex
      );
      updatedIncomeCategories[categoryIndex].subCategories[
        subCategoryIndex
      ].subTotal = subTotal;

      setIncomeCategories(updatedIncomeCategories);
    } else {
      const updatedExpenseCategories = [...expenseCategories];
      if (
        !updatedExpenseCategories[categoryIndex].subCategories[subCategoryIndex]
          .amounts
      ) {
        updatedExpenseCategories[categoryIndex].subCategories[
          subCategoryIndex
        ].amounts = [];
      }
      updatedExpenseCategories[categoryIndex].subCategories[
        subCategoryIndex
      ].amounts[monthIndex] = newValue;

      const subTotal = calculateTotalForSubCategories(
        updatedExpenseCategories[categoryIndex].subCategories,
        monthIndex
      );
      updatedExpenseCategories[categoryIndex].subCategories[
        subCategoryIndex
      ].subTotal = subTotal;

      setExpenseCategories(updatedExpenseCategories);
    }
  };

  const handleKeyDown = (e, categoryType, categoryIndex) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newSubCategoryName = prompt("Nhập tên cho danh mục con mới:");
      if (newSubCategoryName) {
        if (categoryType === "income") {
          const newIncomeCategories = [...incomeCategories];
          const newSubCategory = {
            name: newSubCategoryName,
            amounts: [],
          };
          newIncomeCategories[categoryIndex].subCategories.push(newSubCategory);
          setIncomeCategories(newIncomeCategories);
        } else {
          const newExpenseCategories = [...expenseCategories];
          const newSubCategory = {
            name: newSubCategoryName,
            amounts: [],
          };
          newExpenseCategories[categoryIndex].subCategories.push(newSubCategory);
          setExpenseCategories(newExpenseCategories);
        }
      }
    }
  };
  

  const handleDeleteSubCategory = (categoryType, categoryIndex, subCategoryIndex) => {
    if (categoryType === "income") {
      const updatedIncomeCategories = [...incomeCategories];
      updatedIncomeCategories[categoryIndex].subCategories.splice(subCategoryIndex, 1);
      setIncomeCategories(updatedIncomeCategories);
    } else {
      const updatedExpenseCategories = [...expenseCategories];
      updatedExpenseCategories[categoryIndex].subCategories.splice(subCategoryIndex, 1);
      setExpenseCategories(updatedExpenseCategories);
    }
  };

  const calculateTotal = (categories, monthIndex) => {
    return categories.reduce((total, category) => {
      return (
        total +
        category.subCategories.reduce((subTotal, subCategory) => {
          return subTotal + (subCategory.amounts?.[monthIndex] || 0);
        }, 0)
      );
    }, 0);
  };

  const calculateTotalForSubCategories = (subCategories, monthIndex) => {
    return subCategories.reduce((subTotal, subCategory) => {
      return subTotal + (subCategory.amounts?.[monthIndex] || 0);
    }, 0);
  };

  useEffect(() => {
    const newIncomeTotal = monthsArray.map((_, index) => {
      return calculateTotal(incomeCategories, index);
    });

    const newExpenseTotal = monthsArray.map((_, index) => {
      return calculateTotal(expenseCategories, index);
    });

    setIncomeTotal(newIncomeTotal);
    setExpenseTotal(newExpenseTotal);

    const newOpeningBalance = [0];
    const newClosingBalance = [];
    const newProfitLoss = [];

    monthsArray.forEach((_, index) => {
      const income = newIncomeTotal[index];
      const expense = newExpenseTotal[index];

      if (income || expense) {
        const profit = income - expense;
        newProfitLoss.push(profit);

        if (index === 0) {
          newClosingBalance.push(newOpeningBalance[0] + profit);
        } else {
          newOpeningBalance.push(newClosingBalance[index - 1]);
          newClosingBalance.push(newOpeningBalance[index] + profit);
        }
      } else {
        newProfitLoss.push(null);
        newOpeningBalance.push(null);
        newClosingBalance.push(null);
      }
    });

    setOpeningBalance(newOpeningBalance);
    setClosingBalance(newClosingBalance);
    setProfitLoss(newProfitLoss);
  }, [incomeCategories, expenseCategories, monthsArray]);

  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Danh mục</th>
          {monthsArray.map((month) => (
            <th key={month} className="border p-2">
              {month}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* Income categories */}
        {incomeCategories.map((category, categoryIndex) => (
          <React.Fragment key={category.name}>
            <tr>
              <td className="border p-2 font-bold">{category.name}</td>
              {monthsArray.map((month) => (
                <td key={month} className="border p-2"></td>
              ))}
            </tr>
            {category.subCategories.map((subCategory, subCategoryIndex) => (
              <React.Fragment key={subCategory.name}>
                <tr>
                  <td className="border p-2 pl-4">{subCategory.name}</td>
                  {monthsArray.map((month, monthIndex) => (
                    <td key={month} className="border p-2">
                      <input
                        ref={inputRefs.current[categoryIndex][monthIndex]}
                        type="text"
                        defaultValue={subCategory.amounts?.[monthIndex] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "income",
                            categoryIndex,
                            subCategoryIndex,
                            monthIndex,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, "income", categoryIndex)} // Thêm xử lý nhấn Enter
                        className="border p-1 rounded w-full"
                      />
                    </td>
                  ))}
                  <td className="border p-2">
                    <button onClick={() => handleDeleteSubCategory("income", categoryIndex, subCategoryIndex)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}

        {/* Total Revenue */}
        <tr>
          <td className="border p-2 font-bold">Income Total</td>
          {incomeTotal.map((total, index) => (
            <td key={index} className="border p-2">
              {total || ""}
            </td>
          ))}
        </tr>

        

        {/* Expense categories */}
        {expenseCategories.map((category, categoryIndex) => (
          <React.Fragment key={category.name}>
            <tr>
              <td className="border p-2 font-bold">{category.name}</td>
              {monthsArray.map((month) => (
                <td key={month} className="border p-2"></td>
              ))}
            </tr>
            {category.subCategories.map((subCategory, subCategoryIndex) => (
              <React.Fragment key={subCategory.name}>
                <tr>
                  <td className="border p-2 pl-4">{subCategory.name}</td>
                  {monthsArray.map((month, monthIndex) => (
                    <td key={month} className="border p-2">
                      <input
                        ref={inputRefs.current[incomeCategories.length + categoryIndex][monthIndex]}
                        type="text"
                        defaultValue={subCategory.amounts?.[monthIndex] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "expense",
                            categoryIndex,
                            subCategoryIndex,
                            monthIndex,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, "expense", categoryIndex)} // Thêm xử lý nhấn Enter
                        className="border p-1 rounded w-full"
                      />
                    </td>
                  ))}
                  <td className="border p-2">
                    <button onClick={() => handleDeleteSubCategory("expense", categoryIndex, subCategoryIndex)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}

        {/* Total Expense */}
        <tr>
          <td className="border p-2 font-bold">Expense Total</td>
          {expenseTotal.map((total, index) => (
            <td key={index} className="border p-2">
              {total || ""}
            </td>
          ))}
        </tr>
        {/* Profit/Loss */}
        <tr>
          <td className="border p-2 font-bold">Profit/Loss</td>
          {profitLoss.map((profit, index) => (
            <td key={index} className="border p-2">
              {profit || ""}
            </td>
          ))}
        </tr>
        {/* Opening Balance */}
        <tr>
        <td className="border p-2 font-bold">Opening Balance</td>
        {openingBalance.map((balance, index) => (
          <td key={index} className="border p-2">
            {index === 0 ? 0 : balance || ""} {/* Hiển thị 0 cho tháng đầu tiên */}
          </td>
        ))}
      </tr>

        {/* Closing Balance */}
        <tr>
          <td className="border p-2 font-bold">Closing Balance</td>
          {closingBalance.map((balance, index) => (
            <td key={index} className="border p-2">
              {balance || ""}
            </td>
          ))}
        </tr>

        
      </tbody>
    </table>
  );
};

export default MonthTable;
