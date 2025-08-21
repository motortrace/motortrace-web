import React, { useState } from 'react';
import './ProductDetails.scss';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { categoryConfigs } from './categoryConfigs';
import ProductModal from '../AddProducts/ProductModal';
import ProductViewPanel from '../ViewProduct/ProductViewPanel';
import EditProduct from '../EditProduct/EditProduct'; 

import brakePadsImg from '../../../../assets/images/brakePads.png';
import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
import spark from '../../../../assets/images/spark.png';
import battery from '../../../../assets/images/battery.png';
import belt from '../../../../assets/images/timingBelt.png';

export interface Product {
  id: string;
  productName: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
  subcategory: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  stock: number;
  compatibility: string;
  position: string;
  brand: string;
  finish: string;
  material: string;
  surfaceUse: string;
  type: string;
  color: string;
  volume: string;
  mountingFeatures:string;
  colorCode: string;
  quantity: number;
  minQuantity: number;
  discountType: string;
  discountValue: number;
  warranty: string;
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  notes: string;
  resistance: string;
  dryTime: string;
  applicationMethod: string;
  voltage: string;
  ampRating: string;
  connectorType: string;
}

// Define the interface that EditProduct expects
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

// Add proper TypeScript interface for DeleteConfirmationPopup props
interface DeleteConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

// Delete Confirmation Popup Component with proper typing
const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    onConfirm();
    setIsDeleting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <div className="delete-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h3 className="delete-modal-title">Delete Product</h3>
          <p className="delete-modal-message">
            Are you sure you want to delete <strong>"{productName}"</strong>? 
            This action cannot be undone and will permanently remove the product from your inventory.
          </p>
        </div>
        
        <div className="delete-modal-actions">
          <button 
            className="delete-modal-btn delete-modal-btn--cancel" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="delete-modal-btn delete-modal-btn--delete" 
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="delete-spinner"></div>
                Deleting...
              </>
            ) : (
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const products: Product[] = [
  {
    id: 'PD001',
    productName: 'Castrol GTX Magnatec 10W-30',
    category: 'Accessories & Add-ons',
    subcategory: 'Engine Oil',
    description: 'High-performance ceramic brake pads.',
    price: 'LKR 15,500',
    rating: 4.5,
    reviewCount: 128,
    availability: 'In Stock',
    image: brakePadsImg,
    stock: 45,
    compatibility: "Petrol Engines (Toyota, Honda)",
    position: '',
    brand: 'Castrol',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '4 Litres',
    mountingFeatures: '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD002',
    productName: 'Bosch ESI6 DOT 4 Brake Fluid',
    category: 'Engine & Fluids',
    subcategory: 'Brake Fluid',
    description: 'Full synthetic motor oil providing superior engine protection and performance.',
    price: 'LKR 8,200',
    rating: 4.8,
    reviewCount: 256,
    availability: 'Low Stock',
    image: engineOilImg,
    stock: 120,
    compatibility: "Universal (ABS Compatible)",
    position: '',
    brand: 'Bosch',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '500 ml',
    mountingFeatures : '',
    colorCode: '',
    quantity: 10,
    minQuantity: 20,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD003',
    productName: 'Prestone All Vehicle Coolant',
    category: 'Engine & Fluids',
    subcategory: 'Coolant',
    description: 'High-efficiency air filter ensuring optimal engine performance and fuel economy.',
    price: 'LKR 3,750',
    rating: 4.2,
    reviewCount: 89,
    availability: 'Low Stock',
    image: spark,
    stock: 8,
    compatibility: "All Makes and Models",
    position: '',
    brand: 'Prestone',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '3.78 Litres',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD004',
    productName: 'STP Power Steering Fluid',
    category: 'Engine & Fluids',
    subcategory: 'Power Steering Fluid',
    description: 'Iridium spark plugs for enhanced ignition performance and longevity.',
    price: 'LKR 12,000',
    rating: 4.6,
    reviewCount: 164,
    availability: 'In Stock',
    image: spark,
    stock: 32,
    compatibility: "Honda, Nissan, Kia, Hyundai",
    position: '',
    brand: 'STP',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '946 ml',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD005',
    productName: 'Mobil ATF 3309',
    category: 'Engine & Fluids',
    subcategory: 'Transmission Fluid',
    description: 'Complete timing belt kit with tensioner and idler pulleys for reliable operation.',
    price: 'LKR 28,500',
    rating: 4.4,
    reviewCount: 76,
    availability: 'Out of Stock',
    image: belt,
    stock: 0,
    compatibility: "Toyota, Volvo (automatic gearboxes)",
    position: '',
    brand: 'Mobil',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '1 Litre',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD006',
    productName: 'Radiator Assembly',
    category: 'Engine & Fluids',
    subcategory: 'Cooling',
    description: 'Aluminum radiator with enhanced cooling capacity for optimal temperature control.',
    price: 'LKR 45,000',
    rating: 4.3,
    reviewCount: 45,
    availability: 'In Stock',
    image: belt,
    stock: 15,
    compatibility: "",
    position: '',
    brand: '',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD007',
    productName: 'Battery 12V 70Ah',
    category: 'Engine & Fluids',
    subcategory: 'Electrical',
    description: 'Maintenance-free lead-acid battery with excellent cold cranking performance.',
    price: 'LKR 18,750',
    rating: 4.7,
    reviewCount: 203,
    availability: 'In Stock',
    image: battery,
    stock: 28,
    compatibility: "",
    position: '',
    brand: '',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'PD008',
    productName: 'Alternator',
    category: 'Wear & Tear Parts',
    subcategory: 'Electrical',
    description: 'High-output alternator ensuring reliable electrical system performance.',
    price: 'LKR 35,200',
    rating: 4.1,
    reviewCount: 67,
    availability: 'In Stock',
    image: battery,
    stock: 12,
    compatibility: "",
    position: '',
    brand: '',
    finish: '',
    material: '',
    surfaceUse: '',
    type: '',
    color: '',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT001',
    productName: 'Brembo Ceramic Brake Pads',
    category: 'Wear & Tear Parts',
    subcategory: 'Brake Pads',
    description: 'High-performance ceramic brake pads with low dust and reduced noise.',
    price: 'LKR 15,800',
    rating: 4.7,
    reviewCount: 142,
    availability: 'In Stock',
    image: brakePadsImg,
    stock: 35,
    compatibility: 'Toyota Corolla, Honda Civic, Nissan Sunny',
    position: 'Front',
    brand: 'Brembo',
    finish: 'Ceramic',
    material: 'Ceramic/Steel',
    surfaceUse: 'Disc Brakes',
    type: 'Disc Pad',
    color: 'Black',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT002',
    productName: 'Bosch QuietCast Brake Rotor',
    category: 'Wear & Tear Parts',
    subcategory: 'Brake Rotors',
    description: 'Durable brake rotor with heat-dissipating design for longer life.',
    price: 'LKR 22,000',
    rating: 4.6,
    reviewCount: 98,
    availability: 'In Stock',
    image: battery,
    stock: 20,
    compatibility: 'Nissan X-Trail, Mitsubishi Outlander',
    position: 'Front',
    brand: 'Bosch',
    finish: 'Coated',
    material: 'Cast Iron',
    surfaceUse: 'Disc Brakes',
    type: 'Rotor',
    color: 'Silver',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT003',
    productName: 'Exedy OEM Clutch Kit',
    category: 'Wear & Tear Parts',
    subcategory: 'Clutch Kit',
    description: 'Complete clutch replacement kit with pressure plate, disc, and bearing.',
    price: 'LKR 65,000',
    rating: 4.5,
    reviewCount: 54,
    availability: 'Low Stock',
    image: battery,
    stock: 6,
    compatibility: 'Toyota Hilux, Nissan Navara',
    position: '',
    brand: 'Exedy',
    finish: '',
    material: 'Metal/Friction Compound',
    surfaceUse: 'Transmission',
    type: 'Manual Gearbox',
    color: '',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT004',
    productName: 'K&N High-Flow Air Filter',
    category: 'Wear & Tear Parts',
    subcategory: 'Air Filters',
    description: 'Reusable, washable performance air filter for increased airflow.',
    price: 'LKR 12,500',
    rating: 4.8,
    reviewCount: 183,
    availability: 'In Stock',
    image: battery,
    stock: 40,
    compatibility: 'Universal Fit (cut-to-size options)',
    position: '',
    brand: 'K&N',
    finish: '',
    material: 'Cotton Gauze',
    surfaceUse: 'Engine Intake',
    type: 'Performance',
    color: 'Red/Black',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT005',
    productName: 'Fram Fresh Breeze Cabin Air Filter',
    category: 'Wear & Tear Parts',
    subcategory: 'Cabin Air Filters',
    description: 'High-efficiency cabin filter infused with baking soda for fresher air.',
    price: 'LKR 5,200',
    rating: 4.3,
    reviewCount: 67,
    availability: 'In Stock',
    image: battery,
    stock: 22,
    compatibility: 'Honda Vezel, Toyota Axio, Suzuki Swift',
    position: 'Cabin',
    brand: 'Fram',
    finish: '',
    material: 'Activated Carbon',
    surfaceUse: 'Cabin Ventilation',
    type: 'HVAC Filter',
    color: 'White/Gray',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT006',
    productName: 'Dayco Engine Drive Belt',
    category: 'Wear & Tear Parts',
    subcategory: 'Engine Air Intake Hoses/Belts',
    description: 'High-strength serpentine belt with long service life and quiet operation.',
    price: 'LKR 9,500',
    rating: 4.4,
    reviewCount: 81,
    availability: 'In Stock',
    image: battery,
    stock: 18,
    compatibility: 'Toyota Prius, Nissan Note',
    position: 'Engine',
    brand: 'Dayco',
    finish: '',
    material: 'Reinforced Rubber',
    surfaceUse: 'Engine Drive',
    type: 'Serpentine Belt',
    color: 'Black',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
    id: 'WT007',
    productName: 'NGK Iridium IX Spark Plug',
    category: 'Wear & Tear Parts',
    subcategory: 'Spark Plugs',
    description: 'Iridium spark plug for better ignition, fuel efficiency, and longer life.',
    price: 'LKR 2,800',
    rating: 4.9,
    reviewCount: 240,
    availability: 'In Stock',
    image: battery,
    stock: 100,
    compatibility: 'Petrol Engines (Universal)',
    position: 'Engine',
    brand: 'NGK',
    finish: '',
    material: 'Iridium/Metal',
    surfaceUse: 'Ignition',
    type: 'Single Electrode',
    color: 'Silver',
    volume: '',
    mountingFeatures : '',
    colorCode: '',
    quantity: 0,
    minQuantity: 0,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    notes: '',
    resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
  },
  {
  id: "EBP001",
  productName: "Toyota Corolla Front Bumper",
  category: "Exterior & Body Parts",
  subcategory: "Bumpers",
  description: "OEM front bumper for Toyota Corolla 2016–2019 models.",
  price: "LKR 35,000",
  rating: 4.7,
  reviewCount: 52,
  availability: "In Stock",
  image: battery,
  stock: 10,
  compatibility: "Toyota Corolla (2016–2019)",
  position: "Front",
  surfaceUse: '',
  type: '',
  color: '',
  volume: '',
  brand: "Toyota Genuine",
  finish: "Primed (Paint Ready)",
  material: "ABS Plastic",
  mountingFeatures: "Direct Fit",
  colorCode: "Unpainted",
  quantity: 1,
  minQuantity: 2,
  discountType: "Percentage",
  discountValue: 5,
  warranty: "6 Months",
  manufacturer: "Toyota OEM",
  manufacturedDate: "2024-03-10",
  expiryDate: "",
  notes: "Requires painting before installation.",
  resistance: '',
    dryTime: '',
    applicationMethod: '',
    voltage: '',
    ampRating: '',
    connectorType: ''
},
{
  id: 'PC001',
  productName: 'Toyota Genuine Touch-Up Paint – Super White II',
  category: 'Paints & Coatings',
  subcategory: 'Touch-Up Paints',
  description: 'OEM color-matched touch-up paint for minor scratches and chips. Provides durable finish and prevents rusting.',
  price: 'LKR 2,800',
  rating: 4.6,
  reviewCount: 84,
  availability: 'In Stock',
  image: '',
  stock: 120,
  compatibility: 'Toyota Vehicles – Super White II (Color Code: 040)',
  position: '',
  brand: 'Toyota Genuine Parts',
  finish: 'Glossy',
  material: '',
  surfaceUse: 'Exterior body panels',
  type: 'Acrylic Lacquer',
  color: 'Super White II',
  volume: '15 ml',
  mountingFeatures: '',
  colorCode: '040',
  quantity: 120,
  minQuantity: 20,
  discountType: 'Percentage',
  discountValue: 10,
  warranty: '1 Year',
  manufacturer: 'Toyota Motor Corporation',
  manufacturedDate: '2025-01-10',
  expiryDate: '2027-01-10',
  notes: 'Shake well before use. Comes with brush applicator.',
  resistance: 'Weather & UV resistant',
  dryTime: '20 minutes',
  applicationMethod: 'Brush applicator',
  voltage: '',
    ampRating: '',
    connectorType: ''
},
{
  id: 'PC002',
  productName: '3M Professional Rust Preventive Spray – Black',
  category: 'Paints & Coatings',
  subcategory: 'Underbody/RustProof Coatings',
  description: 'High-performance rust preventive spray for underbody protection. Provides long-lasting resistance against corrosion, water, and road salt.',
  price: 'LKR 5,200',
  rating: 4.8,
  reviewCount: 142,
  availability: 'Low Stock',
  image: '',
  stock: 15,
  compatibility: 'Universal – all vehicle underbodies',
  position: '',
  brand: '3M',
  finish: 'Matte',
  material: '',
  surfaceUse: 'Underbody, wheel wells',
  type: 'Rubberized Coating',
  color: 'Black',
  volume: '500 ml',
  mountingFeatures: '',
  colorCode: '',
  quantity: 15,
  minQuantity: 10,
  discountType: 'Flat',
  discountValue: 500,
  warranty: '2 Years',
  manufacturer: '3M Automotive Solutions',
  manufacturedDate: '2024-11-05',
  expiryDate: '2027-11-05',
  notes: 'Protective rubberized coating. Prevents chips and corrosion.',
  resistance: 'Rust, moisture, salt, and abrasion resistant',
  dryTime: '60 minutes',
  applicationMethod: 'Aerosol Spray',
  voltage: '',
    ampRating: '',
    connectorType: ''
},
{
  id: 'ED001',
  productName: 'Mahle Piston Set for Toyota 1NZ-FE',
  category: 'Engine & Drivetrain Components',
  subcategory: 'Engine Components',
  description: 'High-quality forged piston set designed for Toyota 1NZ-FE engines. Ensures durability and improved performance.',
  price: 'LKR 65,000',
  rating: 4.7,
  reviewCount: 56,
  availability: 'In Stock',
  image: '',
  stock: 12,
  compatibility: 'Toyota 1NZ-FE Petrol Engines',
  position: 'Engine Block',
  brand: 'Mahle',
  finish: '',
  material: 'Forged Aluminum',
  surfaceUse: '',
  type: '',
  color: '',
  volume: '',
  mountingFeatures: '',
  colorCode: '',
  quantity: 0,
  minQuantity: 2,
  discountType: 'Percentage',
  discountValue: 5,
  warranty: '2 Years',
  manufacturer: 'Mahle GmbH',
  manufacturedDate: '2024-02-15',
  expiryDate: '',
  notes: 'Recommended for professional installation',
  resistance: '',
  dryTime: '',
  applicationMethod: '',
  voltage: '',
    ampRating: '',
    connectorType: ''
},
{
  id: 'ED002',
  productName: 'Exedy Clutch Kit for Honda Civic',
  category: 'Engine & Drivetrain Components',
  subcategory: 'Transmission Components',
  description: 'Performance clutch kit suitable for Honda Civic models. Provides smooth shifting and durability under load.',
  price: 'LKR 48,500',
  rating: 4.6,
  reviewCount: 89,
  availability: 'Low Stock',
  image: '',
  stock: 5,
  compatibility: 'Honda Civic (2006–2012)',
  position: 'Transmission System',
  brand: 'Exedy',
  finish: '',
  material: 'Steel + Organic Disc',
  surfaceUse: '',
  type: 'Clutch Kit',
  color: '',
  volume: '',
  mountingFeatures: '',
  colorCode: '',
  quantity: 0,
  minQuantity: 1,
  discountType: 'Flat',
  discountValue: 1500,
  warranty: '1 Year',
  manufacturer: 'Exedy Corporation',
  manufacturedDate: '2023-11-20',
  expiryDate: '',
  notes: 'Includes pressure plate, clutch disc, and release bearing',
  resistance: '',
  dryTime: '',
  applicationMethod: '',
  voltage: '',
    ampRating: '',
    connectorType: ''
},
{
  id: 'EL001',
  productName: 'Bosch High-Performance Car Battery',
  category: 'Electrical Components',
  subcategory: 'Charging & Starting System',
  description: '12V lead-acid battery with long-lasting performance and quick recharge capability.',
  price: 'LKR 32,500',
  rating: 4.7,
  reviewCount: 84,
  availability: 'In Stock',
  image: 'bosch_battery.png',
  stock: 25,
  compatibility: 'Toyota, Honda, Nissan (Petrol & Diesel)',
  position: 'Engine Bay',
  brand: 'Bosch',
  finish: '',
  material: 'Lead-Acid',
  surfaceUse: '',
  type: 'Battery',
  color: 'Black',
  volume: '',
  mountingFeatures: 'Standard Clamp Fit',
  colorCode: '',
  quantity: 25,
  minQuantity: 5,
  discountType: 'Percentage',
  discountValue: 10,
  warranty: '2 Years',
  manufacturer: 'Bosch GmbH',
  manufacturedDate: '2024-01-15',
  expiryDate: '2028-01-15',
  notes: 'Recharge every 3–4 months if vehicle unused',
  resistance: '',
  dryTime: '',
  applicationMethod: '',
  voltage: '12V',
  ampRating: '65Ah',
  connectorType: 'Standard Terminal'
},
{
  id: 'EL002',
  productName: 'Philips LED Headlight Bulb H4',
  category: 'Electrical Components',
  subcategory: 'Lighting & Signaling System',
  description: 'Bright white LED headlight with 6000K color temperature and long lifespan.',
  price: 'LKR 8,200',
  rating: 4.6,
  reviewCount: 190,
  availability: 'In Stock',
  image: 'philips_led.png',
  stock: 60,
  compatibility: 'Universal – H4 Socket',
  position: 'Front Headlight',
  brand: 'Philips',
  finish: '',
  material: 'LED + Aluminum Housing',
  surfaceUse: '',
  type: 'LED Bulb',
  color: 'Cool White',
  volume: '',
  mountingFeatures: 'Plug & Play',
  colorCode: '6000K',
  quantity: 60,
  minQuantity: 10,
  discountType: 'Flat',
  discountValue: 500,
  warranty: '1 Year',
  manufacturer: 'Philips Lighting',
  manufacturedDate: '2024-03-10',
  expiryDate: '2030-03-10',
  notes: 'Waterproof and vibration resistant',
  resistance: '',
  dryTime: '',
  applicationMethod: '',
  voltage: '12V',
  ampRating: '30W',
  connectorType: 'H4 Socket'
},
{
  id: "ACC-101",
  productName: "All-Weather Rubber Floor Mats",
  category: "Accessories & Add-ons",
  subcategory: "Interior Accessories",
  description: "Durable, waterproof floor mats designed to protect against dirt, mud, and spills. Easy to clean and long-lasting.",
  price: "7500.00",
  rating: 4.7,
  reviewCount: 124,
  availability: "In Stock",
  image: "images/accessories/floor-mat.jpg",
  stock: 45,
  compatibility: "Universal Fit - Most Sedan, SUV, Hatchback",
  position: "Interior",
  brand: "3D MAXpider",
  finish: "Matte",
  material: "Rubber Polymer",
  surfaceUse: "Interior",
  type: "Protective Mat",
  color: "Black",
  volume: "",
  mountingFeatures: "Non-slip backing, clip-on",
  colorCode: "",
  quantity: 45,
  minQuantity: 10,
  discountType: "Percentage",
  discountValue: 10,
  warranty: "1 Year Manufacturer Warranty",
  manufacturer: "3D MAXpider Automotive",
  manufacturedDate: "2024-01-10",
  expiryDate: "",
  notes: "Recommended for rainy season and off-road users",
  resistance: "Waterproof, Stain-resistant",
  dryTime: "",
  applicationMethod: "Direct Placement",
  voltage: "",
  ampRating: "",
  connectorType: ""
},
{
  id: "ACC-202",
  productName: "Aluminum Roof Rack Cross Bars",
  category: "Accessories & Add-ons",
  subcategory: "Exterior Accessories",
  description: "Lightweight aluminum roof rack bars for carrying extra cargo, bikes, or kayaks. Adjustable for most vehicles.",
  price: "22500.00",
  rating: 4.5,
  reviewCount: 89,
  availability: "Low Stock",
  image: "images/accessories/roof-rack.jpg",
  stock: 8,
  compatibility: "Compatible with vehicles with factory roof rails",
  position: "Roof",
  brand: "Thule",
  finish: "Brushed Aluminum",
  material: "Aluminum Alloy",
  surfaceUse: "Exterior",
  type: "Cargo Rack",
  color: "Silver",
  volume: "",
  mountingFeatures: "Adjustable clamps, lockable",
  colorCode: "",
  quantity: 8,
  minQuantity: 5,
  discountType: "Fixed",
  discountValue: 2000,
  warranty: "3 Years Limited Warranty",
  manufacturer: "Thule Group",
  manufacturedDate: "2024-05-20",
  expiryDate: "",
  notes: "Max load capacity: 75kg",
  resistance: "Weather-resistant, Rust-proof",
  dryTime: "",
  applicationMethod: "Bolt-on Installation",
  voltage: "",
  ampRating: "",
  connectorType: ""
}






];

const ITEMS_PER_PAGE = 5;

const ProductDetails: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>("Engine & Fluids");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Edit functionality state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const currentColumns = categoryConfigs[selectedCategory] || [];
  const filteredProducts = products.filter(
    (product) => product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProduct = () => {
    // Add your save logic here
    console.log('Product saved!');
    // You can add the new product to your products array here
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewPanelOpen(true);
  };

  const handleCloseViewPanel = () => {
    setIsViewPanelOpen(false);
    setSelectedProduct(null);
  };

  // Updated edit handler to open edit modal
  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
    // Close view panel if it's open
    setIsViewPanelOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setProductToEdit(null);
  };

  // Delete handlers
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
    // Close view panel if it's open
    setIsViewPanelOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      // Implement your actual delete logic here
      console.log('Deleting product:', productToDelete.id);
      
      // Example: Remove from products array (you'll need proper state management)
      // const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      // setProducts(updatedProducts);
      
      // Close modal
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      
      // Show success message
      alert('Product deleted successfully!');
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Conversion for Engine & Fluids (already present)
  const convertToEngineFluidProduct = (product: Product): EngineFluidProduct => ({
    productName: product.productName,
    fluidType: product.subcategory,
    specification: '',
    brand: product.brand,
    volume: product.volume,
    compatibility: product.compatibility,
    replacementCycle: '',
    boilingPoint: '',
    description: product.description,
    stock: product.stock,
    lowStockThreshold: 10,
    price: product.price,
    discountType: '',
    discountValue: 0,
    image: product.image,
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
  });

  // Conversion for Wear & Tear Parts
  const convertToWearTearProduct = (product: Product) => ({
    productName: product.productName,
    partType: product.subcategory,
    material: product.material,
    position: product.position,
    brand: product.brand,
    size: '',
    compatibility: product.compatibility,
    replacementCycle: '',
    description: product.description,
    quantity: product.stock,
    price: product.price,
    minimumQuantity: 1,
    discountType: '',
    discountValue: 0,
    image: product.image,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
  });

  // Conversion for Exterior & Body Parts
  const convertToExteriorBodyPartProduct = (product: Product) => ({
    productName: product.productName,
    partType: product.subcategory,
    material: product.material,
    position: product.position,
    finish: product.finish,
    mountingFeatures: '',
    electronicFeatures: '',
    colorCode: product.color,
    brand: product.brand,
    compatibility: product.compatibility,
    notes: product.description,
    quantity: product.stock,
    price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
    minQuantity: 1,
    discountType: '',
    discountValue: 0,
    warranty: '',
    manufacturer: '',
    manufacturedDate: '',
    expiryDate: '',
    image: product.image,
  });

  const handleSaveEditedProduct = (updatedData: EngineFluidProduct) => {
    // Here you would update your products array or make an API call
    console.log('Updated product data:', updatedData);
    
    // Example: Update the products array (you'll need to implement proper state management)
    // const updatedProducts = products.map(product => 
    //   product.id === productToEdit?.id 
    //     ? { ...product, ...updatedData } 
    //     : product
    // );
    
    // Close the edit modal
    setIsEditModalOpen(false);
    setProductToEdit(null);
    
    // Show success message or refresh the data
    alert('Product updated successfully!');
  };

  const handleDuplicateProduct = (product: Product) => {
    // Implement duplicate logic
    console.log('Duplicating product:', product);
    // Create a new product based on the current one
    setIsViewPanelOpen(false);
  };

  const handleDeleteFromViewPanel = (productId: string) => {
    // Find the product by ID
    const product = products.find(p => p.id === productId);
    if (product) {
      handleDeleteProduct(product);
    }
  };

  return (
    <div className="product-details">
      <div className="product-details__header">
        <h2 className="product-details__title">Product List</h2>
        <div className="product-details__actions">
          <button className="btn pdf">PDF</button>
          <button className="btn refresh">⟳</button>
          <button className="btn sort">⇅</button>
          <button className="btn add" onClick={handleAddProduct}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="product-details__filters">
        <input className="filter-input" placeholder="Search..." />
        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as keyof typeof categoryConfigs)}
        >
          {Object.keys(categoryConfigs).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select className="filter-select">
          <option value="">All Sub-Categories</option>
        </select>

        <select className="filter-select">
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className="product-details__table">        
        <div className="product-details__table-header">
          {currentColumns.map((col) => (
            <div key={col.key} className="product-details__header-cell">{col.label}</div>
          ))}
          <div className="product-details__header-cell">Price</div>
          <div className="product-details__header-cell">Stock</div>
          <div className="product-details__header-cell">Availability</div>
          <div className="product-details__header-cell">Actions</div>
        </div>
        <div className="product-details__table-body">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="product-details__row">
              {currentColumns.map((col) => (
                <div key={col.key} className="product-details__cell">
                  {product[col.key as keyof Product] ?? '—'}
                </div>
              ))}
              <div className="product-details__cell">{product.price}</div>
              <div className="product-details__cell">{product.stock}</div>
              <div className="product-details__cell">
                <span className={`product-details__status product-details__status--${product.availability.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.availability}
                </span>
              </div>
              <div className="product-details__cell product-details__actions-group">
                <button className="product-details__action-btn product-details__action-btn--view" onClick={() => handleViewProduct(product)}>
                  <Eye size={16} />
                </button>
                <button className="product-details__action-btn product-details__action-btn--edit" onClick={() => handleEditProduct(product)}>
                  <Pencil size={16} />
                </button>
                <button className="product-details__action-btn product-details__action-btn--delete" onClick={() => handleDeleteProduct(product)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="product-details__pagination">
        <button
          className="product-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="product-details__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="product-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Add Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
      />

      {/* Edit Product Modal */}
      {isEditModalOpen && productToEdit && (
        <div className="modal-overlay" onClick={handleCloseEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <h2>Edit Product</h2>
              </div>
              <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            </div>
            <div className='edit-product'>
            <EditProduct 
              category={productToEdit.category}
              existingData={
                productToEdit.category === 'Engine & Fluids'
                  ? convertToEngineFluidProduct(productToEdit)
                  : productToEdit.category === 'Wear & Tear Parts'
                  ? convertToWearTearProduct(productToEdit)
                  : productToEdit.category === 'Exterior & Body Parts'
                  ? convertToExteriorBodyPartProduct(productToEdit)
                  : productToEdit
              }
              onSave={handleSaveEditedProduct}
            />
            </div>
          </div>
        </div>
      )}

      {/* Product View Panel */}
      <ProductViewPanel
        isOpen={isViewPanelOpen}
        onClose={handleCloseViewPanel}
        product={selectedProduct}
        onDelete={handleDeleteFromViewPanel}
      />

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.productName || ''}
      />
    </div>
  );
};

export default ProductDetails;