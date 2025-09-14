import React, { useState, useEffect } from 'react';
import './EditProduct.scss';

interface EditProductProps {
  category: string;
  existingData: any; 
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
      formData.availability = formData.quantity > formData.minquantity 
        ? 'In Stock' 
        : formData.quantity === 0 
          ? 'Out of Stock' 
          : 'Low Stock';

      const response = await fetch(`http://localhost:3000/api/products/${existingData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: existingData.id 
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
    </>
  );

  
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
              <label>Type</label>
              <input 
                type="text" 
                placeholder="" 
                value={formData.type ||  ''} 
                onChange={(e) => handleChange('type', e.target.value)} 
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
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Brake Pads">Brake Pads</option>
                <option value="Brake Rotors">Brake Rotors</option>
                <option value="Clutch Kit">Clutch Kit</option>
                <option value="Air Filters">Air Filters</option>
                <option value="Cabin Air Filters">Cabin Air Filters</option>
                <option value="Engine Air Intake Hoses/Belts">Engine Air Intake Hoses/Belts</option>
                <option value="Spark Plugs">Spark Plugs</option>
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
            <div className="form-group">
              <label>Dimension</label>
              <input 
                type="text" 
                value={formData.size || ''} 
                onChange={(e) => handleChange('size', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Exterior & Body Parts':
        return (
          <>
            <div className="form-group">
              <label>Part Type *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Bumpers">Bumpers</option>
                <option value="Side Mirrors">Side Mirrors</option>
                <option value="Grilles">Grilles</option>
                <option value="Wipers">Wipers</option>
                <option value="Paint & Touch-up Kits">Paint & Touch-up Kits</option>
                <option value="Door Handles">Door Handles</option>
                <option value="Exterior Lights">Exterior Lights</option>
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
            <div className="form-group">
              <label>Paint/Finish</label>
              <input 
                type="text" 
                value={formData.finish || ''} 
                onChange={(e) => handleChange('finish', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Mounting Features</label>
              <input 
                type="text" 
                value={formData.mountingfeatures || ''} 
                onChange={(e) => handleChange('mountingfeatures', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <input 
                type="text" 
                value={formData.type || ''} 
                onChange={(e) => handleChange('type', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="text" 
                value={formData.color || ''} 
                onChange={(e) => handleChange('color', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Paints & Coatings':
        return (
          <>
            <div className="form-group">
              <label>Category *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Touch-Up Paints">Touch-Up Paints</option>
                <option value="Spray Paints">Spray Paints</option>
                <option value="Clear/Top Coats">Clear/Top Coats</option>
                <option value="Primers">Primers</option>
                <option value="Underbody/RustProof Coatings">Underbody/RustProof Coatings</option>
              </select>
            </div>
            <div className="form-group">
              <label>Volume</label>
              <input 
                type="text" 
                value={formData.volume || ''} 
                onChange={(e) => handleChange('volume', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Finish</label>
              <input 
                type="text" 
                value={formData.finish || ''} 
                onChange={(e) => handleChange('finish', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Surface Use</label>
              <input 
                type="text" 
                value={formData.surfaceuse || ''} 
                onChange={(e) => handleChange('surfaceuse', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <input 
                type="text" 
                value={formData.type || ''} 
                onChange={(e) => handleChange('type', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="text" 
                value={formData.color || ''} 
                onChange={(e) => handleChange('color', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>ColorCode</label>
              <input 
                type="text" 
                value={formData.colorcode || ''} 
                onChange={(e) => handleChange('colorcode', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Heat/UV Resistance</label>
              <input 
                type="text" 
                value={formData.resistance || ''} 
                onChange={(e) => handleChange('resistance', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Dry Time</label>
              <input 
                type="text" 
                value={formData.drytime || ''} 
                onChange={(e) => handleChange('drytime', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Application Method</label>
              <input 
                type="text" 
                value={formData.applicationmethod || ''} 
                onChange={(e) => handleChange('applicationmethod', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Engine & Drivetrain Components':
        return (
          <>
            <div className="form-group">
              <label>Category *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Engine Components">Engine Components</option>
                <option value="Transmission Components">Transmission Components</option>
                <option value="Drivetrain & Differential Components">Drivetrain & Differential Components</option>
                <option value="Final Drive / Supporting Components">Final Drive / Supporting Components</option>
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
            <div className="form-group">
              <label>Size/Length/Gear Ratio</label>
              <input 
                type="text" 
                value={formData.size || ''} 
                onChange={(e) => handleChange('size', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Transmission Type</label>
              <input 
                type="text" 
                value={formData.type || ''} 
                onChange={(e) => handleChange('type', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Electrical Components':
        return (
          <>
            <div className="form-group">
              <label>Category *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Charging & Starting System">Charging & Starting System</option>
                <option value="Lighting & Signaling System">Lighting & Signaling System</option>
                <option value="Sensors & Modules">Sensors & Modules</option>
                <option value="Switches & Controls">Switches & Controls</option>
                <option value="Wiring, Fuses & Relays">Wiring, Fuses & Relays</option>
              </select>
            </div>
            <div className="form-group">
              <label>Material/Lens Color</label>
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
            <div className="form-group">
              <label>Voltage</label>
              <input 
                type="text" 
                value={formData.voltage || ''} 
                onChange={(e) => handleChange('voltage', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Amp Rating</label>
              <input 
                type="text" 
                value={formData.amprating || ''} 
                onChange={(e) => handleChange('amprating', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Connector Type</label>
              <input 
                type="text" 
                value={formData.connectortype || ''} 
                onChange={(e) => handleChange('connectortype', e.target.value)} 
              />
            </div>
          </>
        );

      case 'Accessories & Add-ons':
        return (
          <>
            <div className="form-group">
              <label>Category *</label>
              <select 
                value={formData.subcategory || ''} 
                onChange={(e) => handleChange('subcategory', e.target.value)}
              >
                <option value="">Select</option>
                <option value="Interior Accessories">Interior Accessories</option>
                <option value="Electronic Add-ons">Electronic Add-ons</option>
                <option value="Exterior Accessories">Exterior Accessories</option>
                <option value="Performance Add-ons">Performance Add-ons</option>
                <option value="Protection & Utility Add-ons">Protection & Utility Add-ons</option>
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
              <label>Dimension</label>
              <input 
                type="text" 
                value={formData.size || ''} 
                onChange={(e) => handleChange('size', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input 
                type="text" 
                value={formData.color || ''} 
                onChange={(e) => handleChange('color', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Finish</label>
              <input 
                type="text" 
                value={formData.finish || ''} 
                onChange={(e) => handleChange('finish', e.target.value)} 
              />
            </div>
          </>
        );

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
          <div className="form-group">
            <label>Compatibility</label>
            <input 
              type="text" 
              value={formData.compatibility || ''} 
              onChange={(e) => handleChange('compatibility', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input 
              type="text" 
              value={formData.brand || ''} 
              onChange={(e) => handleChange('brand', e.target.value)} 
            />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea 
              rows={3} 
              value={formData.description || ''} 
              onChange={(e) => handleChange('description', e.target.value)} 
            />
          </div>
          <div className="form-group full">
            <label>Notes</label>
            <textarea 
              rows={3} 
              value={formData.notes || ''} 
              onChange={(e) => handleChange('notes', e.target.value)} 
            />
          </div>
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
        <h3>Pricing & Stocks</h3>
        <div className="form-grid">
           <div className="form-group">
              <label>Price *</label>
              <input 
                type="text" 
                value={formData.price || ''} 
                onChange={(e) => handleChange('price', e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Stock Quantity</label>
              <input 
                type="number" 
                value={ formData.quantity || 0} 
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="form-group">
              <label>Low Stock Quantity</label>
              <input 
                type="number" 
                value={formData.minquantity || 1} 
                onChange={(e) => handleChange('minquantity', parseInt(e.target.value) || 1)} 
              />
            </div>
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Additional Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Warranty</label>
            <input 
              type="text" 
              value={formData.warranty || ''} 
              onChange={(e) => handleChange('warranty', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Manufacturer</label>
            <input 
              type="text" 
              value={formData.manufacturer || ''} 
              onChange={(e) => handleChange('manufacturer', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Manufactured Date</label>
            <input 
              type="date" 
              value={formData.manufactureddate || ''} 
              onChange={(e) => handleChange('manufactureddate', e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input 
              type="date" 
              value={formData.expirydate || ''} 
              onChange={(e) => handleChange('expirydate', e.target.value)} 
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