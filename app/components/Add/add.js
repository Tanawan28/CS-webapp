"use client";
import React, { useContext, useState } from "react";
import { GlobalContext } from "../Context/globalcontext";

const AddNew = () => {
  const { 
    description, setDescription, 
    amount, setAmount, 
    addTransaction,
    categoryBudgets, 
    setCategoryBudget,
    getCategoryExpense 
  } = useContext(GlobalContext);

  const categories = ["Food", "Rent", "Entertainment", "Shopping"];

  // สร้าง State สำหรับสลับหน้า (Tabs)
  const [activeTab, setActiveTab] = useState("add"); // "add" หรือ "budget"
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Food");
  const [tempBudget, setTempBudget] = useState("");

  const handleAddTransaction = () => {
    if (!description || !amount) return;
    addTransaction(type, category);
  };

  const handleUpdateBudget = () => {
    if (!tempBudget) return;
    setCategoryBudget(category, tempBudget);
    setTempBudget("");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      
      {/* --- Navigation Buttons --- */}
      <div className="btn-group w-100 mb-4 shadow-sm">
        <button 
          className={`btn ${activeTab === "add" ? "btn-dark" : "transparent"}`}
          onClick={() => setActiveTab("add")}
        >
          เพิ่มรายการ
        </button>
        <button 
          className={`btn ${activeTab === "budget" ? "btn-dark" : "transparent"}`}
          onClick={() => setActiveTab("budget")}
        >
          วงเงินจำกัด
        </button>
      </div>

      {/* --- Content: Add Transaction Page --- */}
      {activeTab === "add" && (
        <div className="p-4 rounded bg-light shadow-sm">
          <h5 className="text-center fw-bold mb-4">เพิ่มรายการ</h5>
          
          <div className="mb-3">
            <label className="form-label fw-medium">รายละเอียด</label>
            <input
              type="text"
              className="form-control"
              value={description || ""}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">ราคา</label>
            <input
              type="number"
              className="form-control"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label fw-medium">ประเภท</label>
              <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="income">รายรับ</option>
                <option value="expense">รายจ่าย</option>
              </select>
            </div>
            <div className="col-6 mb-3">
              <label className="form-label fw-medium">หมวดหมู่</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Food">อาหาร</option>
                <option value="Rent">ค่าเช่า</option>
                <option value="Entertainment">ความบันเทิง</option>
                <option value="Misc">ซื้อของ</option>
              </select>
            </div>
          </div>

          <button 
            className={`btn w-100 mt-2 fw-semibold ${type === 'income' ? 'btn-success' : 'btn-danger'}`} 
            onClick={handleAddTransaction}
          >
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      )}

      {/* --- Content: Budget Settings Page --- */}
      {activeTab === "budget" && (
        <div className="p-4 rounded border bg-white shadow-sm">
          <h5 className="text-center fw-bold mb-4">ตั้งค่าวงเงินจำกัด</h5>
          
          <div className="mb-3">
            <label className="form-label fw-medium">หมวดหมู่</label>
            <select className="form-select mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">อาหาร</option>
              <option value="Rent">ค่าเช่า</option>
              <option value="Entertainment">ความบันเทิง</option>
              <option value="Misc">ซื้อของ</option>
            </select>
          </div>

          <label className="form-label fw-medium">กำหนดงบประมาณรายเดือน</label>
          <div className="input-group mb-3">
            <span className="input-group-text">฿</span>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0.00"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleUpdateBudget}>
              บันทึก
            </button>
          </div>

          <hr />
          
          <div className="mt-4">
  <h6 className="fw-bold mb-3 text-uppercase small text-muted border-bottom pb-2">
    ภาพรวมงบประมาณทั้งหมด
  </h6>
  
  <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
    {categories.map((cat) => {
      const limit = categoryBudgets[cat] || 0;
      const spent = getCategoryExpense(cat);
      // คำนวณเปอร์เซ็นต์ (ไม่ให้เกิน 100 สำหรับแถบสี)
      const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
      
      // แสดงเฉพาะหมวดหมู่ที่มีการตั้งงบไว้ (limit > 0)
      if (limit === 0) return null;

      return (
        <div key={cat} className="mb-3 p-2 bg-light rounded border-start border-4 border-dark">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold small">{cat}</span>
            <span className="small">
              <span className={spent > limit ? "text-danger fw-bold" : "text-dark"}>
                {spent}
              </span> 
              <span className="text-muted"> / {limit} ฿</span>
            </span>
          </div>
          
          <div className="progress" style={{ height: "6px" }}>
            <div 
              className={`progress-bar ${spent > limit ? 'bg-danger' : 'bg-success'}`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          
          {spent > limit && (
            <div className="text-danger" style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
              ⚠️ ยอดใช้จ่ายเกินวงเงิน !
            </div>
          )}
        </div>
      );
    })}

    {/* กรณีที่ยังไม่มีการตั้งงบเลยสักหมวดหมู่ */}
    {Object.values(categoryBudgets).every(v => v === 0 || !v) && (
      <p className="text-center text-muted small py-3">ยังไม่ได้กำหนดงบประมาณ</p>
    )}
  </div>
  </div>
        </div>
      )}
    </div>
  );
};

export default AddNew;