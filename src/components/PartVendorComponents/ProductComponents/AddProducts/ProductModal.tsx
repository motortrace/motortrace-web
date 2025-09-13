// ProductModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ProductModal.scss';
import './AddProduct.scss'

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productData: any) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState('engine-fluids');
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

 const [formData, setFormData] = useState({
    // Common fields
    productName: '',
    category: 'Engine & Fluids',
    subcategory: '',
    description: '',
    price: '',
    quantity: 0,
    brand: '',
    compatibility: '',
    image: '',
    stock: 0,
    minQuantity: 1,

    fluidType: '',
    specification: '',
    volume: '',
    replacementCycle: '',
    boilingPoint: '',
    partType: '',
    material: '',
    position: '',
    size: '',
    finish: '',
    mountingFeatures: '',
    electronicFeatures: '',
    colorCode: '',
    color: '',
    surfaceUse: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: '',
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    discountType: '',
    discountValue: 0,
    type: ''
  });

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('engine-fluids');
    }
  }, [isOpen]);


 const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: value,
      category: getCategoryFromTab(activeTab)
    }));
  };

const getCategoryFromTab = (tab: string): string => {
    const tabMap: {[key: string]: string} = {
      'engine-fluids': 'Engine & Fluids',
      'wear-tear': 'Wear & Tear Parts',
      'exterior-body': 'Exterior & Body Parts',
      'paints-coatings': 'Paints & Coatings',
      'engine-drivetrain': 'Engine & Drivetrain Components',
      'electrical': 'Electrical Components',
      'accessories': 'Accessories & Add-ons'
    };
    return tabMap[tab] || 'Engine & Fluids';
  };

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      handleInputChange('image', URL.createObjectURL(file));
    }
  };


const validateForm = (): boolean => {
    const requiredFields = ['productName', 'brand', 'price', 'quantity'];
    
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill in the ${field} field`);
        return false;
      }
    }
    if (formData.quantity < 0) {
      alert('Quantity cannot be negative');
      return false;
    }
    
    if (parseFloat(formData.price) <= 0) {
      alert('Price must be greater than 0');
      return false;
    }
    
    return true;
  };

const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API - clean up empty values
      const productToSave = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => 
          value !== '' && value !== null && value !== undefined
        )
      );
      // Add default values
      productToSave.rating = 0;
      productToSave.reviewCount = 0;
      productToSave.availability = formData.quantity > formData.minQuantity 
        ? 'In Stock' 
        : formData.quantity === 0 
          ? 'Out of Stock' 
          : 'Low Stock';
      
      // Call your API endpoint - use the correct endpoint
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToSave),
      });
      if (response.ok) {
        const savedProduct = await response.json();
        onSave(savedProduct);
        onClose();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    //   alert(`Error saving product: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'engine-fluids':
        return (
        <div className="tab-content">
            <div className="add-product__section">
              <h3 className="add-product__section-title">Product Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text"
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fluid Type *</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    required
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
                {/* <div className="form-group">
                  <label>Specification</label>
                  <input 
                    type="text" 
                    placeholder='e.g., 5W-30, DOT 4, OAT'
                    value={formData.specification}
                    onChange={(e) => handleInputChange('specification', e.target.value)}
                  />
                </div> */}
                <div className="form-group">
                  <label>Brand *</label>
                  <input 
                    type="text" 
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Volume *</label>
                  <input 
                    type="text" 
                    placeholder='e.g., 500ml, 1L, 4L'
                    value={formData.volume}
                    onChange={(e) => handleInputChange('volume', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Compatibility</label>
                  <input 
                    type='text' 
                    placeholder='System/vehicle/hydraulic compatibility'
                    value={formData.compatibility}
                    onChange={(e) => handleInputChange('compatibility', e.target.value)}
                  />
                </div>
                {/* <div className="form-group">
                  <label>Replacement Cycle</label>
                  <input 
                    type='text' 
                    placeholder='like per 5000 km or per 6 months'
                    value={formData.replacementCycle}
                    onChange={(e) => handleInputChange('replacementCycle', e.target.value)}
                  />
                </div> */}
                <div className="form-group">
                  <label>Type</label>
                  <input 
                    type="text" 
                    placeholder='e.g., Synthetic oil, Manual Gear Oil'
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  />
                </div>
                <div className="form-group full">
                  <label>Description</label>
                  <textarea 
                    placeholder="Product description" 
                    rows={3} 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                <div className="form-group full">
                  <label>Notes</label>
                  <textarea 
                    placeholder="Additional notes" 
                    rows={2} 
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Stocks Section */}
            <div className="add-product__section">
              <h3 className="add-product__section-title">Pricing & Stocks</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.minQuantity}
                    onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>


            {/* Image Section */}
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
        
        );
      case 'wear-tear':
         return (
          <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text"
                            value={formData.productName}
                            onChange={(e) => handleInputChange('productName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Part Type *</label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => handleInputChange('subcategory', e.target.value)}
                            required
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
                        <input type="text" placeholder='e.g., Rubber, Ceramic, Organic'
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <input type="text" placeholder='Front / Rear / Left / Right' 
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Size/Dimension</label>
                        <input type="text" placeholder=''
                            value={formData.size}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Compatibility</label>
                        <input type='text' placeholder='Vehicle Make / Model / Year'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    {/* <div className="form-group">
                        <label>Replacement Interval</label>
                        <input type='text' placeholder='Time or mileage'
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div> */}
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Stocks Section */}
            <div className="add-product__section">
              <h3 className="add-product__section-title">Pricing & Stocks</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.minQuantity}
                    onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>


            {/* Image Section */}
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            
          </div>
        );
      case 'exterior-body':
        return (
        <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text"
                            value={formData.productName}
                            onChange={(e) => handleInputChange('productName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Part Type *</label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => handleInputChange('subcategory', e.target.value)}
                            required
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
                        <input type="text" placeholder='e.g., Plastic, Steel, Chrome'
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <input type="text" placeholder='Front / Rear / Left / Right' 
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Paint/Finish</label>
                        <input type="text" placeholder='Gloss, Matte, Chrome, Painted/Unpainted' 
                            value={formData.finish}
                            onChange={(e) => handleInputChange('finish', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mounting Features</label>
                        <input type="text" placeholder='With Fog Cutout, Sensor Slots, Lock Buttons' 
                            value={formData.mountingFeatures}
                            onChange={(e) => handleInputChange('mountingFeatures', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <input type="text" placeholder='Heating, Indicator Light, Power Folding' 
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color</label>
                        <input type="text" placeholder='Body-colored or Manufacturer’s paint code' 
                            value={formData.color}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Vehicle Compatibility</label>
                        <input type='text' placeholder='Vehicle Make / Model / Year'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type='text' placeholder=''
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Stocks Section */}
            <div className="add-product__section">
              <h3 className="add-product__section-title">Pricing & Stocks</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.minQuantity}
                    onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>


            {/* Image Section */}
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
        );
      case 'paints-coatings':
        return (
        <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                            <input type="text"
                                value={formData.productName}
                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => handleInputChange('subcategory', e.target.value)}
                            required
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
                        <label>Color</label>
                        <input type="text" placeholder='e.g., Silver, Black, Custom'
                            value={formData.color}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color Code</label>
                        <input type="text" placeholder='e.g., “NH731P” (Honda Black)' 
                            value={formData.colorCode}
                            onChange={(e) => handleInputChange('colorCode', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Finish</label>
                        <input type="text" placeholder='Gloss, Matte, Satin, Metallic' 
                            value={formData.finish}
                            onChange={(e) => handleInputChange('finish', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <input type="text" placeholder='Acrylic, Enamel, 1K, 2K, Bitumen-based, etc.' 
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Surface Use</label>
                        <input type="text" placeholder='Plastic, Metal, Underbody' 
                            value={formData.surfaceUse}
                            onChange={(e) => handleInputChange('surfaceUse', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Heat/UV Resistance</label>
                        <input type="text" placeholder='' 
                            value={formData.resistance}
                            onChange={(e) => handleInputChange('resistance', e.target.value)}
                        />                      
                    </div>
                    <div className="form-group">
                        <label>Dry Time</label>
                        <input type="text" placeholder='Fast Dry / Regular' 
                            value={formData.dryTime}
                            onChange={(e) => handleInputChange('dryTime', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Volume</label>
                        <input type="text" placeholder='ml / oz / Litre' 
                            value={formData.volume}
                            onChange={(e) => handleInputChange('volume', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Application Method</label>
                        <input type="text" placeholder='Spray / Brush / Roll-on' 
                            value={formData.applicationMethod}
                            onChange={(e) => handleInputChange('applicationMethod', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Vehicle Compatibility</label>
                        <input type='text' placeholder='Vehicle Make / Model / Year'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type='text' placeholder=''
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {/* Pricing & Stocks Section */}
            <div className="add-product__section">
              <h3 className="add-product__section-title">Pricing & Stocks</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Quantity *</label>
                  <input 
                    type="number" 
                    value={formData.minQuantity}
                    onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>


            {/* Image Section */}
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
            
          </div>
        );
      case 'engine-drivetrain':
        return (
          <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text"
                            value={formData.productName}
                            onChange={(e) => handleInputChange('productName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => {
                                handleInputChange('subcategory', e.target.value);
                            }}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Engine Components">Engine Components</option>
                            <option value="Transmission Components">Transmission Components</option>
                            <option value="Drivetrain & Differential Components">Drivetrain & Differential Components</option>
                            <option value="Final Drive / Supporting Components">Final Drive / Supporting Components</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Vehicle Compatibility</label>
                        <input type='text' placeholder='Vehicle Make / Model / Year / Engine Code'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Transmission Type</label>
                        <input type="text" placeholder='Manual / Automatic / CVT'
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Material</label>
                        <input type="text" placeholder='Steel / Aluminum / Rubber / Composite' 
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Size / Length / Gear Ratio</label>
                        <input type="text" placeholder='' 
                            value={formData.size}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <input type="text" placeholder='Front / Rear / Left / Right' 
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                    </div>
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="add-product__section">
                <h3 className="add-product__section-title">Pricing & Stocks</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input type="number" 
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price *</label>
                        <input type="text" 
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Minimum Quantity *</label>
                        <input type="number" 
                            value={formData.minQuantity}
                            onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                            required
                        />
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
        );
      case 'electrical':
        return (
          <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text"
                            value={formData.productName}
                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => {
                                handleInputChange('subcategory', e.target.value);
                            }}
                            required
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
                        <label>Vehicle Compatibility</label>
                        <input type='text' placeholder='Vehicle Make / Model / Year / Engine Code'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Voltage</label>
                        <input type="text" placeholder='12V / 24V '
                            value={formData.voltage}
                            onChange={(e) => handleInputChange('voltage', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Amp Rating</label>
                        <input type="text" placeholder='' 
                            value={formData.ampRating}
                            onChange={(e) => handleInputChange('ampRating', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Connector Type / Pin Count</label>
                        <input type="text" placeholder='' 
                            value={formData.connectorType}
                            onChange={(e) => handleInputChange('connectorType', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <input type="text" placeholder='Front / Rear / Left / Right' 
                            value={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Material / Lens Color</label>
                        <input type="text" placeholder='' 
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                    </div>
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="add-product__section">
                <h3 className="add-product__section-title">Pricing & Stocks</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input type="number" 
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price *</label>
                        <input type="text" 
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Minimum Quantity *</label>
                        <input type="number" 
                            value={formData.minQuantity}
                            onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                            required
                        />
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
        );
      case 'accessories':
        return (
        <div className="tab-content">
            <div className="add-product__section">
                <h3 className="add-product__section-title">Product Information</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name *</label>
                        <input type="text"
                            value={formData.productName}
                            onChange={(e) => handleInputChange('productName', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            value={formData.fluidType}
                            onChange={(e) => {
                                handleInputChange('subcategory', e.target.value);
                            }}
                            required
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
                        <label>Vehicle Compatibility</label>
                        <input type='text' placeholder='Universal or Make/Model/Year'
                            value={formData.compatibility}
                            onChange={(e) => handleInputChange('compatibility', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Material</label>
                        <input type="text" placeholder='Leather, Polyester, Rubber, Steel, Plastic '
                            value={formData.material}
                            onChange={(e) => handleInputChange('material', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Size / Dimensions</label>
                        <input type="text" placeholder='' 
                            value={formData.size}
                            onChange={(e) => handleInputChange('size', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Color / Finish</label>
                        <input type="text" placeholder='' 
                            value={formData.finish}
                            onChange={(e) => handleInputChange('finish', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Brand *</label>
                        <input type="text" 
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
                    </div>
                    <div className="form-group full">
                        <label>Notes</label>
                        <textarea placeholder="Maximum 60 words" rows={3} 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="add-product__section">
                <h3 className="add-product__section-title">Pricing & Stocks</h3>
                <div className="form-grid">
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input type="number" 
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price *</label>
                        <input type="text" 
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Minimum Quantity *</label>
                        <input type="number" 
                            value={formData.minQuantity}
                            onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 1)}
                            required
                        />
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
                <div className="form-grid">
                    <div className="form-group">
                        <label>Warranty</label>
                        <input type="text" 
                            value={formData.warranty}
                            onChange={(e) => handleInputChange('warranty', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input type="text" 
                            value={formData.manufacturer}
                            onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manufactured Date</label>
                        <input type="date" 
                            value={formData.manufacturedDate}
                            onChange={(e) => handleInputChange('manufacturedDate', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Expiry On</label>
                        <input type="date" 
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>Create Product</h2>
            <p>Create a comprehensive product record</p>
          </div>
          <div className="modal-actions">
            <button className="close-btn" onClick={onClose}>
              <X size={20}/>
            </button>
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'engine-fluids' ? 'active' : ''}`}
            onClick={() => setActiveTab('engine-fluids')}
          >
            <span className="tab-icon">🚗</span>
            Engine & Fluids
          </button>
          <button
            className={`tab-btn ${activeTab === 'wear-tear' ? 'active' : ''}`}
            onClick={() => setActiveTab('wear-tear')}
          >
            <span className="tab-icon">🧩</span>
            Wear & Tear Parts
          </button>
          <button
            className={`tab-btn ${activeTab === 'exterior-body' ? 'active' : ''}`}
            onClick={() => setActiveTab('exterior-body')}
          >
            <span className="tab-icon">🛠️</span>
            Exterior & Body Parts
          </button>
          <button
            className={`tab-btn ${activeTab === 'paints-coatings' ? 'active' : ''}`}
            onClick={() => setActiveTab('paints-coatings')}
          >
            <span className="tab-icon">🎨</span>
            Paints & Coatings
          </button>
          <button
            className={`tab-btn ${activeTab === 'engine-drivetrain' ? 'active' : ''}`}
            onClick={() => setActiveTab('engine-drivetrain')}
          >
            <span className="tab-icon">⚙️</span>
            Engine & Drivetrain Components
          </button>
          <button
            className={`tab-btn ${activeTab === 'electrical' ? 'active' : ''}`}
            onClick={() => setActiveTab('electrical')}
          >
            <span className="tab-icon">🔌</span>
            Electrical Components
          </button>
          <button
            className={`tab-btn ${activeTab === 'accessories' ? 'active' : ''}`}
            onClick={() => setActiveTab('accessories')}
          >
            <span className="tab-icon">🧰</span>
            Acessories & Add-ons
          </button>
        </div>

        <div className="modal-content">
          {renderTabContent()}
        </div>

        <div className="modal-footer">
          <button className="add-btn" onClick={handleSave}>
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;