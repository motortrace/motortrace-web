

import React, { useEffect, useState } from 'react';
import './EditProduct.scss';

interface WearTearProduct {
  productname: string;
  partType?: string;
  material?: string;
  position?: string;
  brand: string;
  size?: string;
  compatibility?: string;
  replacementCycle?: string;
  description?: string;
  quantity?: number;
  price?: string;
  minimumquantity?: number;
  discounttype?: string;
  discountvalue?: number;
  image?: File | string;
  warranty?: string;
  manufacturer?: string;
  manufactureddate?: string;
  expirydate?: string;
}

interface EditProductProps {
  category: string;
  existingData: WearTearProduct;
  onSave: (data: WearTearProduct) => void;
}

const WearTearPartsEditForm: React.FC<EditProductProps> = ({ existingData, onSave }) => {
  const [formData, setFormData] = useState<WearTearProduct>(existingData);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setFormData(existingData);
    if (existingData.image && typeof existingData.image === 'string') {
      setImagePreview(existingData.image);
    }
  }, [existingData]);

  const handleChange = (field: keyof WearTearProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="edit-product">
      <h2 className="edit-product__title">Edit Product - Wear & Tear Parts</h2>

      <div className="edit-product__section">
        <h3>Product Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" value={formData.productname} onChange={(e) => handleChange('productname', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Part Type *</label>
            <select value={formData.partType} onChange={(e) => handleChange('partType', e.target.value)}>
              <option value="">Select</option>
              <option>Brake Pads</option>
              <option>Brake Rotors</option>
              <option>Clutch Kit</option>
              <option>Air Filters</option>
              <option>Cabin Air Filters</option>
              <option>Engine Air Intake Hoses/Belts</option>
              <option>Spark Plugs</option>
            </select>
          </div>
          <div className="form-group">
            <label>Material</label>
            <input type="text" value={formData.material || ''} onChange={(e) => handleChange('material', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Position</label>
            <input type="text" value={formData.position || ''} onChange={(e) => handleChange('position', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input type="text" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Size/Dimension</label>
            <input type="text" value={formData.size || ''} onChange={(e) => handleChange('size', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Compatibility</label>
            <input type="text" value={formData.compatibility || ''} onChange={(e) => handleChange('compatibility', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Replacement Interval</label>
            <input type="text" value={formData.replacementCycle || ''} onChange={(e) => handleChange('replacementCycle', e.target.value)} />
          </div>
          <div className="form-group full">
            <label>Notes</label>
            <textarea rows={3} value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Pricing & Stocks</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" value={formData.quantity || ''} onChange={(e) => handleChange('quantity', parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="text" value={formData.price || ''} onChange={(e) => handleChange('price', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Minimum Quantity *</label>
            <input type="number" value={formData.minimumquantity || ''} onChange={(e) => handleChange('minimumquantity', parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Discount Type</label>
            <select value={formData.discounttype || ''} onChange={(e) => handleChange('discounttype', e.target.value)}>
              <option value="">Select</option>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="form-group">
            <label>Discount Value</label>
            <input type="number" value={formData.discountvalue || ''} onChange={(e) => handleChange('discountvalue', parseFloat(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Image</h3>
        <div className="add-product__image-upload">
          <label className="image-box">
            {imagePreview ? <img src={imagePreview} alt="Product" /> : <span>Add Image</span>}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Custom Fields</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Warranty *</label>
            <select value={formData.warranty || ''} onChange={(e) => handleChange('warranty', e.target.value)}>
              <option value="">Select</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
            </select>
          </div>
          <div className="form-group">
            <label>Manufacturer</label>
            <input type="text" value={formData.manufacturer || ''} onChange={(e) => handleChange('manufacturer', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Manufactured Date</label>
            <input type="date" value={formData.manufactureddate || ''} onChange={(e) => handleChange('manufactureddate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Expiry On</label>
            <input type="date" value={formData.expirydate || ''} onChange={(e) => handleChange('expirydate', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="edit-product__footer">
        <button className="btn save" onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default WearTearPartsEditForm;

