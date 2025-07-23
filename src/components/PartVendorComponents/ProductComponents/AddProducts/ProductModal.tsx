// ProductModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ProductModal.scss';
import './AddProduct.scss'

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('engine-fluids');
  const [image, setImage] = useState<File | null>(null);

  // Reset tab to Engine & Fluids every time modal opens
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('engine-fluids');
    }
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSave = () => {
    onSave();
    onClose();
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Fluid Type *</label>
                <select><option>Select</option>
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
                <input type="text" placeholder='e.g., 5W-30, DOT 4, OAT'/>
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Volume *</label>
                <input type="text" placeholder='e.g., 500ml, 1L, 4L'/>
            </div>
            <div className="form-group">
                <label>Compatibility</label>
                <input type='text' placeholder='System/vehicle/hydraulic compatibility'/>
            </div>
            <div className="form-group">
                <label>Replacement Cycle</label>
                <input type='text' placeholder='like per 5000 km or per 6 months'/>
            </div>
            <div className="form-group">
                <label>Type</label>
                <input type="text" placeholder='e.g., Synthetic oil, Manual Gear Oil' />
            </div>
            <div className="form-group">
                <label>Boiling Point</label>
                <input type="text"  />
            </div>
            <div className="form-group">
                <label>Barcode Symbology</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group full">
                <label>Item Barcode</label>
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
            <div className="form-grid">
            {/* <div className="form-group">
                <label>Product Type *</label>
                <div className="radio-group">
                <label><input type="radio" name="productType" /> Single Product</label>
                <label><input type="radio" name="productType" /> Variable Product</label>
                </div>
            </div> */}
            {/* <div className="form-group">
            </div> */}
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            {/* <div className="form-group">
                <label>Tax Type *</label>
                <select><option>Select</option></select>
            </div> */}
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            {/* <div className="form-group">
                <label>Warranty *</label>
                <select><option>Select</option></select>
            </div> */}
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Part Type *</label>
                <select><option>Select</option>
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
                <input type="text" placeholder='e.g., Rubber, Ceramic, Organic'/>
            </div>
            <div className="form-group">
                <label>Position</label>
                <input type="text" placeholder='Front / Rear / Left / Right' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Size/Dimension</label>
                <input type="text" placeholder=''/>
            </div>
            <div className="form-group">
                <label>Compatibility</label>
                <input type='text' placeholder='Vehicle Make / Model / Year'/>
            </div>
            <div className="form-group">
                <label>Replacement Interval</label>
                <input type='text' placeholder='Time or mileage'/>
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Part Type *</label>
                <select><option>Select</option>
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
                <input type="text" placeholder='e.g., Plastic, Steel, Chrome'/>
            </div>
            <div className="form-group">
                <label>Position</label>
                <input type="text" placeholder='Front / Rear / Left / Right' />
            </div>
            <div className="form-group">
                <label>Paint/Finish</label>
                <input type="text" placeholder='Gloss, Matte, Chrome, Painted/Unpainted' />
            </div>
            <div className="form-group">
                <label>Mounting Features</label>
                <input type="text" placeholder='With Fog Cutout, Sensor Slots, Lock Buttons' />
            </div>
            <div className="form-group">
                <label>Electronic</label>
                <input type="text" placeholder='Heating, Indicator Light, Power Folding' />
            </div>
            <div className="form-group">
                <label>Color/Code</label>
                <input type="text" placeholder='Body-colored or Manufacturer’s paint code' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Vehicle Compatibility</label>
                <input type='text' placeholder='Vehicle Make / Model / Year'/>
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty *</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Category *</label>
                <select><option>Select</option>
                  <option>Touch-Up Paints</option>
                  <option>Spray Paints</option>
                  <option>Clear/Top Coats</option>
                  <option>Primers</option>
                  <option>Underbody/RustProof Coatings</option>
                </select>
            </div>
            <div className="form-group">
                <label>Color</label>
                <input type="text" placeholder='e.g., Silver, Black, Custom (with code)'/>
            </div>
            <div className="form-group">
                <label>Color Code</label>
                <input type="text" placeholder='e.g., “NH731P” (Honda Black)' />
            </div>
            <div className="form-group">
                <label>Finish</label>
                <input type="text" placeholder='Gloss, Matte, Satin, Metallic' />
            </div>
            <div className="form-group">
                <label>Type</label>
                <input type="text" placeholder='Acrylic, Enamel, 1K, 2K, Bitumen-based, etc.' />
            </div>
            <div className="form-group">
                <label>Surface Use</label>
                <input type="text" placeholder='Plastic, Metal, Underbody' />
            </div>
            <div className="form-group">
                <label>Heat/UV Resistance</label>
                {/* <input type="text" placeholder='Body-colored or Manufacturer’s paint code' /> */}
                <div className="radio-group">
                <label><input type="radio" name="productType" /> Yes</label>
                <label><input type="radio" name="productType" /> No</label>
                </div>
            </div>
            <div className="form-group">
                <label>Dry Time</label>
                <input type="text" placeholder='Fast Dry / Regular' />
            </div>
            <div className="form-group">
                <label>Volume</label>
                <input type="text" placeholder='ml / oz / Litre' />
            </div>
            <div className="form-group">
                <label>Application Method</label>
                <input type="text" placeholder='Spray / Brush / Roll-on' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Vehicle Compatibility</label>
                <input type='text' placeholder='Vehicle Make / Model / Year'/>
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Category *</label>
                <select><option>Select</option>
                  <option>Engine Components</option>
                  <option>Transmission Components</option>
                  <option>Drivetrain & Differential Components</option>
                  <option>Final Drive / Supporting Components</option>
                </select>
            </div>
            <div className="form-group">
                <label>Vehicle Compatibility</label>
                <input type='text' placeholder='Vehicle Make / Model / Year / Engine Code'/>
            </div>
            <div className="form-group">
                <label>Transmission Type</label>
                <input type="text" placeholder='Manual / Automatic / CVT'/>
            </div>
            <div className="form-group">
                <label>Material</label>
                <input type="text" placeholder='Steel / Aluminum / Rubber / Composite' />
            </div>
            <div className="form-group">
                <label>Size / Length / Gear Ratio</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Position</label>
                <input type="text" placeholder='Front / Rear / Left / Right' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Category *</label>
                <select><option>Select</option>
                  <option>Charging & Starting System</option>
                  <option>Lighting & Signaling System</option>
                  <option>Sensors & Modules</option>
                  <option>Switches & Controls</option>
                  <option>Wiring, Fuses & Relays</option>
                </select>
            </div>
            <div className="form-group">
                <label>Vehicle Compatibility</label>
                <input type='text' placeholder='Vehicle Make / Model / Year / Engine Code'/>
            </div>
            <div className="form-group">
                <label>Voltage</label>
                <input type="text" placeholder='12V / 24V '/>
            </div>
            <div className="form-group">
                <label>Amp Rating</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Connector Type / Pin Count</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Position</label>
                <input type="text" placeholder='Front / Rear / Left / Right' />
            </div>
            <div className="form-group">
                <label>Material / Lens Color</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
                <input type="text"/>
            </div>
            <div className="form-group">
                <label>Category *</label>
                <select><option>Select</option>
                  <option>Interior Accessories</option>
                  <option>Electronic Add-ons</option>
                  <option>Exterior Accessories</option>
                  <option>Performance Add-ons (Non-Mechanical)</option>
                  <option>Protection & Utility Add-ons</option>
                </select>
            </div>
            <div className="form-group">
                <label>Vehicle Compatibility</label>
                <input type='text' placeholder='Universal or Make/Model/Year'/>
            </div>
            <div className="form-group">
                <label>Material</label>
                <input type="text" placeholder='Leather, Polyester, Rubber, Steel, Plastic '/>
            </div>
            <div className="form-group">
                <label>Size / Dimensions</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Color / Finish</label>
                <input type="text" placeholder='' />
            </div>
            <div className="form-group">
                <label>Brand *</label>
                <input type="text" />
            </div>
            <div className="form-group full">
                <label>Notes</label>
                <textarea placeholder="Maximum 60 words" rows={3} />
            </div>
            </div>
        </div>

        <div className="add-product__section">
            <h3 className="add-product__section-title">Pricing & Stocks</h3>
            <div className="form-grid">
            <div className="form-group">
                <label>Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Price *</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Minimum Quantity *</label>
                <input type="number" />
            </div>
            <div className="form-group">
                <label>Discount Type</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Discount Value</label>
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
            <div className="form-grid">
            <div className="form-group">
                <label>Warranty</label>
                <select><option>Select</option></select>
            </div>
            <div className="form-group">
                <label>Manufacturer</label>
                <input type="text" />
            </div>
            <div className="form-group">
                <label>Manufactured Date</label>
                <input type="date" />
            </div>
            <div className="form-group">
                <label>Expiry On</label>
                <input type="date" />
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
            {/* <button className="save-btn" onClick={handleSave}>
              Save Product
            </button> */}
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
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
          {/* <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button> */}
          <button className="add-btn" onClick={handleSave}>
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;