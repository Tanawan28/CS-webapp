"use client";
import React, { useContext, useState, useEffect, useRef } from "react";
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

  const incomeCategories = ["เงินเดือน", "เงินกู้", "ขายของ", "ดอกเบี้ย/ปันผล", "ธุรกิจ", "อื่นๆ"];
  const expenseCategories = ["อาหาร", "ค่าที่พัก", "ความบันเทิง", "ซื้อของ", "การท่องเที่ยว", "การศึกษา", "ค่าบิล", "สุขภาพ", "ค่ารถ", "อื่นๆ"];

  const [activeTab, setActiveTab] = useState("income"); 
  const [category, setCategory] = useState(incomeCategories[0]);
  const [tempBudget, setTempBudget] = useState("");
  
  // --- State สำหรับรูปภาพ ---
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // เปลี่ยนหมวดหมู่เริ่มต้นตามแท็บ
    if (activeTab === "income") {
      setCategory(incomeCategories[0]);
    } else {
      setCategory(expenseCategories[0]);
    }
    // ล้างรูปภาพเมื่อสลับแท็บ
    clearImage();
  }, [activeTab]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ล้าง URL เก่าก่อนสร้างใหม่ (Memory Management)
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddTransaction = (type) => {
    if (!description || !amount) {
      alert("กรุณากรอกรายละเอียดและจำนวนเงิน");
      return;
    }
    
    // ส่งข้อมูลไปยัง Context (รองรับ imagePreview เป็น string URL หรือ base64)
    addTransaction(type, category, imagePreview); 
    
    // ล้างค่าหลังจากบันทึก
    setDescription("");
    setAmount("");
    clearImage();
  };

  const handleUpdateBudget = () => {
    if (!tempBudget || isNaN(tempBudget)) return;
    setCategoryBudget(category, parseFloat(tempBudget));
    setTempBudget("");
  };

  // UI ส่วนอัปโหลดรูปภาพ
  const renderImageUpload = () => (
    <div className="mb-3">
      <label className="form-label fw-medium">แนบรูปภาพ</label>
      <input 
        type="file" 
        className="form-control form-control-sm" 
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
      />
      {imagePreview && (
        <div className="mt-2 position-relative d-inline-block">
          <img 
            src={imagePreview} 
            alt="preview" 
            className="img-thumbnail" 
            style={{ maxHeight: "120px", objectFit: "cover" }} 
          />
          <button 
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
            onClick={clearImage}
            style={{ borderRadius: '50%', width: '24px', height: '24px', padding: '0', lineHeight: '1' }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      {/* --- Navigation Buttons --- */}
      <div className="btn-group w-100 mb-4 shadow-sm">
        <button 
          className={`btn ${activeTab === "income" ? "btn-success text-white" : "btn-outline-success"}`} 
          onClick={() => setActiveTab("income")}
        >
          รายรับ
        </button>
        <button 
          className={`btn ${activeTab === "expense" ? "btn-danger text-white" : "btn-outline-danger"}`} 
          onClick={() => setActiveTab("expense")}
        >
          รายจ่าย
        </button>
        <button 
          className={`btn ${activeTab === "budget" ? "btn-dark" : "btn-outline-dark"}`} 
          onClick={() => setActiveTab("budget")}
        >
          จำกัดวงเงิน
        </button>
      </div>

      {/* --- Content: Income & Expense --- */}
      {(activeTab === "income" || activeTab === "expense") && (
        <div className={`p-4 rounded bg-light shadow-sm border-top border-4 ${activeTab === "income" ? "border-success" : "border-danger"}`}>
          <h5 className={`text-center fw-bold mb-4 ${activeTab === "income" ? "text-success" : "text-danger"}`}>
            {activeTab === "income" ? "เพิ่มรายการรายรับ" : "เพิ่มรายการรายจ่าย"}
          </h5>
          
          <div className="mb-3">
            <label className="form-label fw-medium">รายละเอียด</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder={activeTab === "income" ? "เช่น เงินเดือน" : "เช่น ค่าอาหาร"}
              value={description || ""} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">จำนวนเงิน (บาท)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="0.00"
              value={amount || ""} 
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium">หมวดหมู่</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {(activeTab === "income" ? incomeCategories : expenseCategories).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {renderImageUpload()}

          <button 
            className={`btn ${activeTab === "income" ? "btn-success" : "btn-danger"} w-100 mt-2 fw-semibold shadow-sm`} 
            onClick={() => handleAddTransaction(activeTab)}
          >
            บันทึก{activeTab === "income" ? "รายรับ" : "รายจ่าย"}
          </button>
        </div>
      )}

      {/* --- Content: Budget Settings --- */}
      {activeTab === "budget" && (
        <div className="p-4 rounded border bg-white shadow-sm border-top border-4">
          <h5 className="text-center fw-bold mb-4">ตั้งค่าจำกัดวงเงิน</h5>
          
          <div className="mb-3">
            <label className="form-label fw-medium">เลือกหมวดหมู่</label>
            <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="input-group mb-4">
            <span className="input-group-text">฿</span>
            <input 
              type="number" 
              className="form-control" 
              placeholder="ระบุงบประมาณ"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
            />
            <button className="btn btn-dark" onClick={handleUpdateBudget}>บันทึก</button>
          </div>

          <hr />
          
          <div className="mt-4">
            <h6 className="fw-bold mb-3 text-muted small border-bottom pb-2">ภาพรวมงบประมาณ</h6>
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {expenseCategories.map((cat) => {
                const limit = categoryBudgets[cat] || 0;
                const spent = getCategoryExpense(cat);
                const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                if (limit === 0) return null;

                return (
                  <div key={cat} className="mb-3 p-2 bg-light rounded border-start border-4 border-dark">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">{cat}</span>
                      <span className="small">
                        <span className={spent > limit ? "text-danger fw-bold" : ""}>{spent}</span>
                        <span className="text-muted"> / {limit} ฿</span>
                      </span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div className={`progress-bar ${spent > limit ? 'bg-danger' : 'bg-success'}`} style={{ width: `${percent}%` }}></div>
                    </div>
                    {spent > limit && (
                      <div className="text-danger" style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '5px' }}>
                        ⚠️ ยอดใช้จ่ายเกินวงเงิน !
                      </div>
                    )}
                  </div>
                );
              })}
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
