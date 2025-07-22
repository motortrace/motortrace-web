// import React, { useState, useEffect } from 'react';
// import './EditProduct.scss';

// // interface EditProductProps {
// //   existingData: any;
// //   onSave: (updatedData: any) => void;
// // }
// interface EngineFluidProduct {
//   productName: string;
//   fluidType: string;
//   specification: string;
//   brand: string;
//   volume: string;
//   compatibility?: string;
//   replacementCycle?: string;
//   boilingPoint?: string;
//   description?: string;
//   stock: number;
//   lowStockThreshold: number;
//   price: string;
//   discountType?: string;
//   discountValue?: number;
//   image?: File | string;
//   manufacturer?: string;
//   manufacturedDate?: string;
//   expiryDate?: string;
//   // add other fields if needed
// }

// interface EditProductProps {
//   existingData: EngineFluidProduct;
//   onSave: (data: EngineFluidProduct) => void;
// }

// const handleChange = (field: keyof EngineFluidProduct, value: any) => {
//   setFormData((prev: EngineFluidProduct) => ({ ...prev, [field]: value }));
// };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       handleChange('image', file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = () => {
//     onSave(formData);
//   };

//   return (
//     <div className="edit-product">
//       <h2 className="edit-product__title">Edit Product - Engine & Brake Fluids</h2>

//       <div className="edit-product__section">
//         <h3>Product Information</h3>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Product Name *</label>
//             <input
//               type="text"
//               value={formData.productName}
//               onChange={(e) => handleChange('productName', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Fluid Type *</label>
//             <select
//               value={formData.fluidType}
//               onChange={(e) => handleChange('fluidType', e.target.value)}
//             >
//               <option>Select</option>
//               <option>Engine Oil</option>
//               <option>Transmission Fluid</option>
//               <option>Brake Fluid</option>
//               <option>Coolant</option>
//               <option>Power Steering Fluid</option>
//               <option>Windshield Washer Fluid</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Specification *</label>
//             <input
//               type="text"
//               placeholder="e.g., 5W-30, DOT 4"
//               value={formData.specification}
//               onChange={(e) => handleChange('specification', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Brand *</label>
//             <input
//               type="text"
//               value={formData.brand}
//               onChange={(e) => handleChange('brand', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Volume *</label>
//             <input
//               type="text"
//               placeholder="e.g., 1L"
//               value={formData.volume}
//               onChange={(e) => handleChange('volume', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Compatibility</label>
//             <input
//               type="text"
//               placeholder="System/vehicle"
//               value={formData.compatibility}
//               onChange={(e) => handleChange('compatibility', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Replacement Cycle</label>
//             <input
//               type="text"
//               value={formData.replacementCycle}
//               onChange={(e) => handleChange('replacementCycle', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Boiling Point</label>
//             <input
//               type="text"
//               value={formData.boilingPoint}
//               onChange={(e) => handleChange('boilingPoint', e.target.value)}
//             />
//           </div>
//           <div className="form-group full">
//             <label>Description</label>
//             <textarea
//               rows={3}
//               value={formData.description}
//               onChange={(e) => handleChange('description', e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="edit-product__section">
//         <h3>Pricing & Stock</h3>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Quantity *</label>
//             <input
//               type="number"
//               value={formData.stock}
//               onChange={(e) => handleChange('stock', parseInt(e.target.value))}
//             />
//           </div>
//           <div className="form-group">
//             <label>Minimum Stock Level</label>
//             <input
//               type="number"
//               value={formData.lowStockThreshold}
//               onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value))}
//             />
//           </div>
//           <div className="form-group">
//             <label>Price *</label>
//             <input
//               type="text"
//               value={formData.price}
//               onChange={(e) => handleChange('price', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Discount Type</label>
//             <select
//               value={formData.discountType}
//               onChange={(e) => handleChange('discountType', e.target.value)}
//             >
//               <option>Select</option>
//               <option>Percentage</option>
//               <option>Flat</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Discount Value</label>
//             <input
//               type="number"
//               value={formData.discountValue}
//               onChange={(e) => handleChange('discountValue', parseFloat(e.target.value))}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="edit-product__section">
//         <h3>Image</h3>
//         <div className="add-product__image-upload">
//           <label className="image-box">
//             {imagePreview ? <img src={imagePreview} alt="Product" /> : <span>Add Image</span>}
//             <input type="file" accept="image/*" onChange={handleImageChange} />
//           </label>
//         </div>
//       </div>

//       <div className="edit-product__section">
//         <h3>Custom Fields</h3>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Manufacturer</label>
//             <input
//               type="text"
//               value={formData.manufacturer}
//               onChange={(e) => handleChange('manufacturer', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Manufactured Date</label>
//             <input
//               type="date"
//               value={formData.manufacturedDate}
//               onChange={(e) => handleChange('manufacturedDate', e.target.value)}
//             />
//           </div>
//           <div className="form-group">
//             <label>Expiry Date</label>
//             <input
//               type="date"
//               value={formData.expiryDate}
//               onChange={(e) => handleChange('expiryDate', e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="edit-product__footer">
//         <button className="btn save" onClick={handleSubmit}>Save Changes</button>
//       </div>
//     </div>
//   );
// };

// export default EditProduct;


import React, { useState, useEffect } from 'react';
import './EditProduct.scss';

interface EngineFluidProduct {
  productName: string;
  fluidType: string;
  specification: string;
  brand: string;
  volume: string;
  compatibility?: string;
  replacementCycle?: string;
  boilingPoint?: string;
  description?: string;
  stock: number;
  lowStockThreshold: number;
  price: string;
  discountType?: string;
  discountValue?: number;
  image?: File | string;
  manufacturer?: string;
  manufacturedDate?: string;
  expiryDate?: string;
}

interface EditProductProps {
  existingData: EngineFluidProduct;
  onSave: (data: EngineFluidProduct) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ existingData, onSave }) => {
  // Initialize formData state with existingData
  const [formData, setFormData] = useState<EngineFluidProduct>(existingData);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Update formData when existingData changes
  useEffect(() => {
    setFormData(existingData);
    // Handle image preview for existing string URLs
    if (existingData.image && typeof existingData.image === 'string') {
      setImagePreview(existingData.image);
    }
  }, [existingData]);

  const handleChange = (field: keyof EngineFluidProduct, value: any) => {
    setFormData((prev: EngineFluidProduct) => ({ ...prev, [field]: value }));
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
      <h2 className="edit-product__title">Edit Product - Engine & Brake Fluids</h2>

      <div className="edit-product__section">
        <h3>Product Information</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Fluid Type *</label>
            <select
              value={formData.fluidType}
              onChange={(e) => handleChange('fluidType', e.target.value)}
            >
              <option>Select</option>
              <option>Engine Oil</option>
              <option>Transmission Fluid</option>
              <option>Brake Fluid</option>
              <option>Coolant</option>
              <option>Power Steering Fluid</option>
              <option>Windshield Washer Fluid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Specification *</label>
            <input
              type="text"
              placeholder="e.g., 5W-30, DOT 4"
              value={formData.specification}
              onChange={(e) => handleChange('specification', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Brand *</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Volume *</label>
            <input
              type="text"
              placeholder="e.g., 1L"
              value={formData.volume}
              onChange={(e) => handleChange('volume', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Compatibility</label>
            <input
              type="text"
              placeholder="System/vehicle"
              value={formData.compatibility || ''}
              onChange={(e) => handleChange('compatibility', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Replacement Cycle</label>
            <input
              type="text"
              value={formData.replacementCycle || ''}
              onChange={(e) => handleChange('replacementCycle', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Boiling Point</label>
            <input
              type="text"
              value={formData.boilingPoint || ''}
              onChange={(e) => handleChange('boilingPoint', e.target.value)}
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
        </div>
      </div>

      <div className="edit-product__section">
        <h3>Pricing & Stock</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Minimum Stock Level</label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Discount Type</label>
            <select
              value={formData.discountType || ''}
              onChange={(e) => handleChange('discountType', e.target.value)}
            >
              <option>Select</option>
              <option>Percentage</option>
              <option>Flat</option>
            </select>
          </div>
          <div className="form-group">
            <label>Discount Value</label>
            <input
              type="number"
              value={formData.discountValue || ''}
              onChange={(e) => handleChange('discountValue', parseFloat(e.target.value) || 0)}
            />
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
              value={formData.manufacturedDate || ''}
              onChange={(e) => handleChange('manufacturedDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate || ''}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="edit-product__footer">
        <button className="btn save" onClick={handleSubmit}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditProduct;