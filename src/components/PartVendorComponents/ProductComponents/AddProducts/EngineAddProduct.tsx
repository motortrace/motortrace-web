//this is EngineAddProduct.tsx
import React, { useState } from 'react';
import './AddProduct.scss';

const AddProduct: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  return (
    <div className="add-product">
      <h2 className="add-product__title">Create Product</h2>
       {/* <div className="add-product__header">
        <h2 className="add-product__title">Product List</h2>
        <div className="add-product__actions">
            <button className="btn pdf">PDF</button>
            <button className="btn refresh">⟳</button>
            <button className="btn sort">⇅</button>
            <button className="btn add">+ Add Product</button>
            </div>
        </div> */}


        <div className="add-product__section">
            <h3 className="add-product__section-title">Product Information</h3>
            <div className="add-product__form-grid">
            <div className="form-group">
                <label>Store *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Warehouse *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Product Name *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Slug *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>SKU *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Selling Type *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Category *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Sub Category *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Unit *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Barcode Symbology *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group full">
                <label>Item Barcode *</label>
                <input type="text" />
            </div>
            <div className="form-group full">
                <label>Description</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="add-product__form-grid">
            <div className="form-group">
                <label>Product Type *</label>
                <div className="radio-group">
                <label><input type="radio" name="productType" /> Single Product</label>
                <label><input type="radio" name="productType" /> Variable Product</label>
                </div>
            </div>
            <div className="form-group">
            </div>
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Tax Type *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Type *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value *</label>
                <input type="number" />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Image</h3>
            <div className="add-product__image-upload">
            <label className="image-box">
                {image ? (
                <img src={URL.createObjectURL(image)} alt="Product" />
                ) : (
                <span>Add Image</span>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Custom Fields</h3>
            <div className="add-product__form-grid">
            <div className="form-group">
                <label>Warranty *</label>
            <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date *</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On *</label>
                <input type="date" />
            </div>
            </div>
        </div>

        <div className="add-product__actions">
            <button type="button">Cancel</button>
            <button type="submit">Add Product</button>
        </div>
    </div>
  );
};

export default AddProduct;
