import React, { useEffect,useState } from 'react';
import './EditProduct.scss';

interface ExteriorBodyPartProduct {
  productName: string;
  partType: string;
  material?: string;
  position?: string;
  finish?: string;
  mountingFeatures?: string;
  electronicFeatures?: string;
  colorCode?: string;
  brand: string;
  compatibility?: string;
  notes?: string;
  quantity: number;
  price: number;
  minQuantity: number;
  discountType?: string;
  discountValue?: number;
  warranty?: string;
  manufacturer?: string;
  manufacturedDate?: string;
  expiryDate?: string;
  image?: File | null;
}

interface EditProductProps {
    category: string;
  existingData: ExteriorBodyPartProduct;
  onSave: (data: ExteriorBodyPartProduct) => void;
}

const ExteriorBodyPartEditForm: React.FC<EditProductProps> = ({ existingData, onSave }) => {
  const [formData, setFormData] = useState<ExteriorBodyPartProduct>(existingData);
//   const [imagePreview, setImagePreview] = useState<string | null>(
//     existingData.image ? URL.createObjectURL(existingData.image) : null
//   );
const [imagePreview, setImagePreview] = useState<string>('');

//   const handleChange = (field: keyof ExteriorBodyPartProduct, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       handleChange('image', file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = () => {
//     onSave(formData);
//   };
useEffect(() => {
    setFormData(existingData);
    if (existingData.image && typeof existingData.image === 'string') {
      setImagePreview(existingData.image);
    }
  }, [existingData]);

  const handleChange = (field: keyof ExteriorBodyPartProduct, value: any) => {
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
      <div className="add-product__section">
        <h3 className="add-product__section-title">Product Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input value={formData.productName} onChange={(e) => handleChange('productName', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Part Type *</label>
            <select value={formData.partType} onChange={(e) => handleChange('partType', e.target.value)}>
              <option>Select</option>
              <option>Bumpers</option>
              <option>Side Mirrors</option>
              <option>Grilles</option>
              <option>Wipers</option>
              <option>Paint & Touch-up Kits</option>
              <option>Door Handles</option>
              <option>Exterior Lights</option>
            </select>
          </div>

          <div className="form-group">
            <label>Material</label>
            <input value={formData.material || ''} onChange={(e) => handleChange('material', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input value={formData.position || ''} onChange={(e) => handleChange('position', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Paint/Finish</label>
            <input value={formData.finish || ''} onChange={(e) => handleChange('finish', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Mounting Features</label>
            <input value={formData.mountingFeatures || ''} onChange={(e) => handleChange('mountingFeatures', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Electronic</label>
            <input value={formData.electronicFeatures || ''} onChange={(e) => handleChange('electronicFeatures', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Color/Code</label>
            <input value={formData.colorCode || ''} onChange={(e) => handleChange('colorCode', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Brand *</label>
            <input value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
          </div>

          <div className="form-group">
            <label>Vehicle Compatibility</label>
            <input value={formData.compatibility || ''} onChange={(e) => handleChange('compatibility', e.target.value)} />
          </div>

          <div className="form-group full">
            <label>Notes</label>
            <textarea rows={3} value={formData.notes || ''} onChange={(e) => handleChange('notes', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="add-product__section">
        <h3 className="add-product__section-title">Pricing & Stocks</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" value={formData.quantity} onChange={(e) => handleChange('quantity', +e.target.value)} />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="text" value={formData.price} onChange={(e) => handleChange('price', +e.target.value)} />
          </div>
          <div className="form-group">
            <label>Minimum Quantity *</label>
            <input type="number" value={formData.minQuantity} onChange={(e) => handleChange('minQuantity', +e.target.value)} />
          </div>
          <div className="form-group">
            <label>Discount Type</label>
            <select value={formData.discountType || ''} onChange={(e) => handleChange('discountType', e.target.value)}>
              <option>Select</option>
              <option>Percentage</option>
              <option>Fixed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Discount Value</label>
            <input type="number" value={formData.discountValue || ''} onChange={(e) => handleChange('discountValue', +e.target.value)} />
          </div>
        </div>
      </div>

      <div className="add-product__section">
        <h3 className="add-product__section-title">Image</h3>
        <div className="add-product__image-upload">
          <label className="image-box">
            {imagePreview ? <img src={imagePreview} alt="Product" /> : <span>Add Image</span>}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className="add-product__section">
        <h3 className="add-product__section-title">Custom Fields</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Warranty *</label>
            <select value={formData.warranty || ''} onChange={(e) => handleChange('warranty', e.target.value)}>
              <option>Select</option>
              <option>6 months</option>
              <option>1 year</option>
              <option>2 years</option>
              <option>No warranty</option>
            </select>
          </div>
          <div className="form-group">
            <label>Manufacturer</label>
            <input value={formData.manufacturer || ''} onChange={(e) => handleChange('manufacturer', e.target.value)} />
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
        <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
};

export default ExteriorBodyPartEditForm;
