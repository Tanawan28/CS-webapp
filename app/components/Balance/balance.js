"use client";
import React, { useContext } from "react";
import { GlobalContext } from "../Context/globalcontext";


const CurrentBalance = () => {
  const { balance } = useContext(GlobalContext);

  return (
    <div className="text-center bg-light p-4 rounded shadow-sm mb-4">
      <h6 className="text-uppercase text-muted mb-1">ยอดคงเหลือ</h6>
      <h2 className="fw-bold">{Number(balance).toFixed(2)} ฿</h2>
    </div>
  );
};

export default CurrentBalance;