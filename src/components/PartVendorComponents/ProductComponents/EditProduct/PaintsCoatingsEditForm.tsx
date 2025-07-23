import React, { useEffect, useState } from 'react';
import './EditProduct.scss';

interface PaintsCoatingsProduct {
  productName: string;
  category?: string;
  color?: string;
  colorCode?: string;
  finish: string;
  type?: string;
  surfaceUse?: string;
  resistance?: string;
  dryTime?: string;
  volume?: string;
  applicationMethod?: string;
  brand?: string;
  compatibility?: string;
  description?: string;
  quantity?: number;
  price?: string;
  minimumQuantity?: number;
  discountType?: string;
  discountValue?: number;
  image?: File | string;
  warranty?: string;
  manufacturer?: string;
  manufacturedDate?: string;
  expiryDate?: string;
}

interface EditProductProps {
  category: string;
  existingData: PaintsCoatingsProduct;
  onSave: (data: PaintsCoatingsProduct) => void;
}

const PaintsCoatingsEditForm: React.FC<EditProductProps> = ({ existingData, onSave }) => {
  const [formData, setFormData] = useState<PaintsCoatingsProduct>(existingData);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setFormData(existingData);
    if (existingData.image && typeof existingData.image === 'string') {
      setImagePreview(existingData.image);
    }
  }, [existingData]);

  const handleChange = (field: keyof PaintsCoatingsProduct, value: any) => {
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
            <input type="text" value={formData.productName} onChange={(e) => handleChange('productName', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="">Select</option>
              <option>Touch-Up Paints</option>
                  <option>Spray Paints</option>
                  <option>Clear/Top Coats</option>
                  <option>Primers</option>
                  <option>Underbody/RustProof Coatings</option>
            </select>
          </div>
          <div className="form-group">
            <label>Color</label>
            <input type="text" value={formData.color || ''} onChange={(e) => handleChange('color', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Color Code</label>
            <input type="text" value={formData.colorCode || ''} onChange={(e) => handleChange('colorCode', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Finish</label>
            <input type="text" value={formData.finish || ''} onChange={(e) => handleChange('finish', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Type</label>
            <input type="text" value={formData.type || ''} onChange={(e) => handleChange('type', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Surface Use</label>
            <input type="text" value={formData.surfaceUse || ''} onChange={(e) => handleChange('surfaceUse', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Heat / UV Resistance</label>
            <input type="text" value={formData.resistance || ''} onChange={(e) => handleChange('resistance', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Dry Time</label>
            <input type="text" value={formData.dryTime || ''} onChange={(e) => handleChange('dryTime', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Volume</label>
            <input type="text" value={formData.volume || ''} onChange={(e) => handleChange('volume', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Application Method</label>
            <input type="text" value={formData.applicationMethod || ''} onChange={(e) => handleChange('applicationMethod', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input type="text" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Compatibility</label>
            <input type="text" value={formData.compatibility || ''} onChange={(e) => handleChange('compatibility', e.target.value)} />
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
            <input type="number" value={formData.minimumQuantity || ''} onChange={(e) => handleChange('minimumQuantity', parseInt(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Discount Type</label>
            <select value={formData.discountType || ''} onChange={(e) => handleChange('discountType', e.target.value)}>
              <option value="">Select</option>
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="form-group">
            <label>Discount Value</label>
            <input type="number" value={formData.discountValue || ''} onChange={(e) => handleChange('discountValue', parseFloat(e.target.value))} />
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
            <input type="date" value={formData.manufacturedDate || ''} onChange={(e) => handleChange('manufacturedDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Expiry On</label>
            <input type="date" value={formData.expiryDate || ''} onChange={(e) => handleChange('expiryDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="edit-product__footer">
        <button className="btn save" onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default PaintsCoatingsEditForm;

