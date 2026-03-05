"use client";
import React, { useContext } from "react";
import { GlobalContext } from "../Context/globalcontext";


const ExpenceIncome = () => {
  const { income, expense } = useContext(GlobalContext);

  return (
    <div className="d-flex justify-content-between gap-4 mb-4">

      <div className="flex-fill bg-success bg-opacity-10 p-3 rounded shadow-sm text-center">
        <h5 className="text-success text-uppercase mb-1 fw-bold">รายรับ</h5>
        <h4 className="fw-bold">{Number(income).toFixed(2)} ฿</h4>
      </div>

      <div className="flex-fill bg-danger bg-opacity-10 p-3 rounded shadow-sm text-center">
        <h5 className="text-danger text-uppercase mb-1 fw-bold">รายจ่าย</h5>
        <h4 className="fw-bold">{Number(expense).toFixed(2)} ฿</h4>
      </div>

    </div>
  );
};
export default ExpenceIncome;