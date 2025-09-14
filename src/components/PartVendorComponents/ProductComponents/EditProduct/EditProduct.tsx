import React, { useState, useEffect } from 'react';
import './EditProduct.scss';

interface EditProductProps {
  category: string;
  existingData: any; // Flexible data structure
  onSave: (data: any) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ category, existingData, onSave }) => {
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setFormData(existingData);
    if (existingData.image) {
      setImagePreview(existingData.image);
    }
  }, [existingData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleChange('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${existingData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: existingData.id // Ensure product ID is included
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        onSave(updatedProduct);
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please try again.');
    }
  };

  // Render common fields that exist in all products
  const renderCommonFields = () => (
    <>
      <div className="form-group">
        <label>Product Name *</label>
        <input 
          type="text" 
          value={formData.productname || ''} 
          onChange={(e) => handleChange('productname', e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Brand *</label>
        <input 
          type="text" 
          value={formData.brand || ''} 
          onChange={(e) => handleChange('brand', e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Price *</label>
        <input 
          type="text" 
          value={formData.price || ''} 
          onChange={(e) => handleChange('price', e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Stock Quantity *</label>
        <input 
          type="number" 
          value={formData.stock || formData.quantity || 0} 
          onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)} 
        />
      </div>
      <div className="form-group">
        <label>Compatibility</label>
        <input 
          type="text" 
          value={formData.compatibility || ''} 
          onChange={(e) => handleChange('compatibility', e.target.value)} 
        />
      </div>
    </>
  );

  // Render category-specific fields
  const renderCategorySpecificFields = () => {
    switch (category) {
      case 'Engine & Fluids':
        return (
          <>
            <div className="form-group">
              <label>Fluid Type *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Engine Oil">Engine Oil</option>
                <option value="Transmission Fluid">Transmission Fluid</option>
                <option value="Brake Fluid">Brake Fluid</option>
                <option value="Coolant">Coolant</option>
                <option value="Power Steering Fluid">Power Steering Fluid</option>
                <option value="Windshield Washer Fluid">Windshield Washer Fluid</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specification</label>
              <input 
                type="text" 
                placeholder="e.g., 5W-30, DOT 4" 
                value={formData.specification || formData.description || ''} 
                onChange={(e) => handleChange('specification', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Volume</label>
              <input 
                type="text" 
                placeholder="e.g., 1L" 
                value={formData.volume || ''} 
                onChange={(e) => handleChange('volume', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Wear & Tear Parts':
        return (
          <>
            <div className="form-group">
              <label>Part Type *</label>
              <select 
                value={formData.subcategory || formData.partType || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Brake Pads">Brake Pads</option>
                <option value="Brake Rotors">Brake Rotors</option>
                <option value="Spark Plugs">Spark Plugs</option>
                {/* Add other part types */}
              </select>
            </div>
            <div className="form-group">
              <label>Material</label>
              <input 
                type="text" 
                value={formData.material || ''} 
                onChange={(e) => handleChange('material', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Position</label>
              <input 
                type="text" 
                value={formData.position || ''} 
                onChange={(e) => handleChange('position', e.target.value)} 
              />
            </div>
          </>
        );

      // Add cases for other categories following the same pattern

      default:
        return (
          <div className="form-group full">
            <label>Description</label>
            <textarea 
              rows={3} 
              value={formData.description || ''} 
              onChange={(e) => handleChange('description', e.target.value)} 
            />
          </div>
        );
    }
  };

  return (
    <div className="edit-product">
      <h2 className="edit-product__title">Edit {category}</h2>
      
      <div className="edit-product__section">
        <h3>Product Information</h3>
        <div className="form-grid">
          {renderCommonFields()}
          {renderCategorySpecificFields()}
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Image</h3>
        <div className="add-product__image-upload">
          <label className="image-box">
            {imagePreview ? <img src={imagePreview} alt="Product" /> : <span>No Image</span>}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Additional Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Manufacturer</label>
            <input 
              type="text" 
              value={formData.manufacturer || ''} 
              onChange={(e) => handleChange('manufacturer', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Warranty</label>
            <input 
              type="text" 
              value={formData.warranty || ''} 
              onChange={(e) => handleChange('warranty', e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="edit-product__footer">
        <button className="btn save" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProduct;