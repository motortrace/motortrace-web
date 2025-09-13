// import React, { useState, useEffect } from 'react';
// import './EditProduct.scss';
// import WearTearPartsEditForm from './WearTearPartsEditForm';
// import ExteriorBodyPartEditForm from './ExteriorBodyPartsEditForm';
// import PaintsCoatingsEditForm from './PaintsCoatingsEditForm';
// import EngineDrivetrainProductEditForm from './EngineDriveTrainEditForm';
// import ElectricalEditForm from './ElectricalEditForm';
// import AccessoriesEditForm from './AccessoriesEditForm';

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
// }

// interface EditProductProps {
//   // category: string;
//   // existingData: EngineFluidProduct;
//   // onSave: (data: EngineFluidProduct) => void;
//   category: string;
//   existingData: any;
//   onSave: (data: any) => void;
// }

// const EngineFluidsEditForm: React.FC<EditProductProps> = ({ existingData, onSave }) => {
//   const [formData, setFormData] = useState<EngineFluidProduct>(existingData);
//   const [imagePreview, setImagePreview] = useState<string>('');

//   useEffect(() => {
//     setFormData(existingData);
//     if (existingData.image && typeof existingData.image === 'string') {
//       setImagePreview(existingData.image);
//     }
//   }, [existingData]);

//   const handleChange = (field: keyof EngineFluidProduct, value: any) => {
//     setFormData((prev: EngineFluidProduct) => ({ ...prev, [field]: value }));
//   };

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
//       <h2 className="edit-product__title">Engine & Brake Fluids</h2>
//       <div className="edit-product__section">
//         <h3>Product Information</h3>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Product Name *</label>
//             <input type="text" value={formData.productName} onChange={(e) => handleChange('productName', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Fluid Type *</label>
//             <select value={formData.fluidType} onChange={(e) => handleChange('fluidType', e.target.value)}>
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
//             <input type="text" placeholder="e.g., 5W-30, DOT 4" value={formData.specification} onChange={(e) => handleChange('specification', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Brand *</label>
//             <input type="text" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Volume *</label>
//             <input type="text" placeholder="e.g., 1L" value={formData.volume} onChange={(e) => handleChange('volume', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Compatibility</label>
//             <input type="text" placeholder="System/vehicle" value={formData.compatibility || ''} onChange={(e) => handleChange('compatibility', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Replacement Cycle</label>
//             <input type="text" value={formData.replacementCycle || ''} onChange={(e) => handleChange('replacementCycle', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Boiling Point</label>
//             <input type="text" value={formData.boilingPoint || ''} onChange={(e) => handleChange('boilingPoint', e.target.value)} />
//           </div>
//           <div className="form-group full">
//             <label>Description</label>
//             <textarea rows={3} value={formData.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
//           </div>
//         </div>
//       </div>
//       <div className="edit-product__section">
//         <h3>Pricing & Stock</h3>
//         <div className="form-grid">
//           <div className="form-group">
//             <label>Quantity *</label>
//             <input type="number" value={formData.stock} onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)} />
//           </div>
//           <div className="form-group">
//             <label>Minimum Stock Level</label>
//             <input type="number" value={formData.lowStockThreshold} onChange={(e) => handleChange('lowStockThreshold', parseInt(e.target.value) || 0)} />
//           </div>
//           <div className="form-group">
//             <label>Price *</label>
//             <input type="text" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Discount Type</label>
//             <select value={formData.discountType || ''} onChange={(e) => handleChange('discountType', e.target.value)}>
//               <option>Select</option>
//               <option>Percentage</option>
//               <option>Flat</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Discount Value</label>
//             <input type="number" value={formData.discountValue || ''} onChange={(e) => handleChange('discountValue', parseFloat(e.target.value) || 0)} />
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
//             <input type="text" value={formData.manufacturer || ''} onChange={(e) => handleChange('manufacturer', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Manufactured Date</label>
//             <input type="date" value={formData.manufacturedDate || ''} onChange={(e) => handleChange('manufacturedDate', e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Expiry Date</label>
//             <input type="date" value={formData.expiryDate || ''} onChange={(e) => handleChange('expiryDate', e.target.value)} />
//           </div>
//         </div>
//       </div>
//       <div className="edit-product__footer">
//         <button className="btn save" onClick={handleSubmit}>Save Changes</button>
//       </div>
//     </div>
//   );
// };

// const EditProduct: React.FC<EditProductProps> = ({ category, existingData, onSave }) => {
//   switch (category) {
//     case 'Engine & Fluids':
//       return <EngineFluidsEditForm category={category} existingData={existingData} onSave={onSave} />;
//      case 'Wear & Tear Parts':
//       return <WearTearPartsEditForm category={category} existingData={existingData} onSave={onSave} />;
//     case 'Exterior & Body Parts':
//       return <ExteriorBodyPartEditForm category={category} existingData={existingData} onSave={onSave} />;
//     case 'Paints & Coatings':
//       return <PaintsCoatingsEditForm category={category} existingData={existingData} onSave={onSave} />;
//     case 'Engine & Drivetrain Components':
//       return <EngineDrivetrainProductEditForm category={category} existingData={existingData} onSave={onSave} />;
//     case 'Electrical Components':
//       return <ElectricalEditForm category={category} existingData={existingData} onSave={onSave} />;
//     case 'Accessories & Add-ons':
//       return <AccessoriesEditForm category={category} existingData={existingData} onSave={onSave} />;
//     // Add more cases for other categories and their specific forms
//     default:
//       return <div style={{ padding: 32 }}>Edit form for this category is not implemented yet.</div>;
//   }
// };

// export default EditProduct;

// EditProduct.tsx
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
      const response = await fetch('http://localhost:3000/api/product/edit', {
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