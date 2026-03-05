"use client";
import { createContext, useState } from "react";

export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});

  const addTransaction = (type, category) => {
    if (!description || !amount) return;

    const value = Number(amount);

    if (type === "income") {
      setIncome((prev) => prev + value);
      setBalance((prev) => prev + value);
    } else {
      setExpense((prev) => prev + value);
      setBalance((prev) => prev - value);
    }

    setTransactions([
      ...transactions,
      { 
        id: Date.now(), 
        description, 
        amount: value, 
        type, 
        category: type === "expense" ? category : "General" // บันทึกหมวดหมู่
      },
    ]);

    setDescription("");
    setAmount("");
  };

  const removeTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const setCategoryBudget = (category, amount) => {
    setCategoryBudgets({
      ...categoryBudgets,
      [category]: Number(amount),
    });
  };

  const getCategoryExpense = (category) => {
    return transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((acc, t) => acc + Number(t.amount), 0);
  };

  return (
    <GlobalContext.Provider
      value={{
        description, setDescription,
        amount, setAmount,
        transactions,
        addTransaction,
        removeTransaction,
        balance, income, expense,
        categoryBudgets,
        setCategoryBudget,
        getCategoryExpense,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}