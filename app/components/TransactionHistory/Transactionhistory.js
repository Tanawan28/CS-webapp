"use client";
import React, { useContext } from "react";
import { GlobalContext } from "../Context/globalcontext";

import "./Transactionhistory.css";

const TransactionHistory = () => {
  const { transactions, removeTransaction } = useContext(GlobalContext);

  return (
    <div className="mt-4">
      <h5 className="text-center fw-semibold mb-3">ประวัติรายการ</h5>

      {transactions.map((item) => (
        <div
          key={item.id}
          className={`container p-1 mt-2 rounded shadow-sm history-item d-flex justify-content-between align-items-center ${
            item.type === "income" ? "bg-income" : "bg-expense"
          }`}
        >
          <span className="fw-medium">{item.description}</span>

          <div className="d-flex align-items-center gap-2">
            <span
              className={`fw-bold ${
                item.type === "income" ? "text-success" : "text-danger"
              }`}
            >
              {item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}
            </span>

            <button className="btn" onClick={() => removeTransaction(item.id)}>
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;