

// import React, { useState } from 'react';
// import './ProductDetails.scss';
// import { Pencil, Trash2, Eye } from 'lucide-react';
// import { categoryConfigs } from './categoryConfigs';
// import ProductModal from '../AddProducts/ProductModal';
// import ProductViewPanel from '../ViewProduct/ProductViewPanel';
// import EditProduct from '../EditProduct/EditProduct'; 

// import brakePadsImg from '../../../../assets/images/brakePads.png';
// import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
// import spark from '../../../../assets/images/spark.png';
// import battery from '../../../../assets/images/battery.png';
// import belt from '../../../../assets/images/timingBelt.png';

// interface Product {
//   id: string;
//   productName: string;
//   category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
//   subcategory: string;
//   description: string;
//   price: string;
//   rating: number;
//   reviewCount: number;
//   availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
//   image: string;
//   stock: number;
//   compatibility: string;
//   position: string;
//   brand: string;
//   finish: string;
//   material: string;
//   surfaceUse: string;
//   type: string;
//   color: string;
//   volume: string;
// }

// // Define the interface that EditProduct expects
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

// const products: Product[] = [
//   {
//     id: 'PD001',
//     productName: 'Castrol GTX Magnatec 10W-30',
//     category: 'Electrical Components',
//     subcategory: 'Engine Oil',
//     description: 'High-performance ceramic brake pads.',
//     price: 'LKR 15,500',
//     rating: 4.5,
//     reviewCount: 128,
//     availability: 'In Stock',
//     image: brakePadsImg,
//     stock: 45,
//     compatibility: "Petrol Engines (Toyota, Honda)",
//     position: '',
//     brand: 'Castrol',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '4 Litres'
//   },
//   {
//     id: 'PD002',
//     productName: 'Bosch ESI6 DOT 4 Brake Fluid',
//     category: 'Engine & Fluids',
//     subcategory: 'Brake Fluid',
//     description: 'Full synthetic motor oil providing superior engine protection and performance.',
//     price: 'LKR 8,200',
//     rating: 4.8,
//     reviewCount: 256,
//     availability: 'In Stock',
//     image: engineOilImg,
//     stock: 120,
//     compatibility: "Universal (ABS Compatible)",
//     position: '',
//     brand: 'Bosch',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '500 ml'
//   },
//   {
//     id: 'PD003',
//     productName: 'Prestone All Vehicle Coolant',
//     category: 'Engine & Fluids',
//     subcategory: 'Coolant',
//     description: 'High-efficiency air filter ensuring optimal engine performance and fuel economy.',
//     price: 'LKR 3,750',
//     rating: 4.2,
//     reviewCount: 89,
//     availability: 'Low Stock',
//     image: spark,
//     stock: 8,
//     compatibility: "All Makes and Models",
//     position: '',
//     brand: 'Prestone',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '3.78 Litres'
//   },
//   {
//     id: 'PD004',
//     productName: 'STP Power Steering Fluid',
//     category: 'Engine & Fluids',
//     subcategory: 'Power Steering Fluid',
//     description: 'Iridium spark plugs for enhanced ignition performance and longevity.',
//     price: 'LKR 12,000',
//     rating: 4.6,
//     reviewCount: 164,
//     availability: 'In Stock',
//     image: spark,
//     stock: 32,
//     compatibility: "Honda, Nissan, Kia, Hyundai",
//     position: '',
//     brand: 'STP',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '946 ml'
//   },
//   {
//     id: 'PD005',
//     productName: 'Mobil ATF 3309',
//     category: 'Engine & Fluids',
//     subcategory: 'Transmission Fluid',
//     description: 'Complete timing belt kit with tensioner and idler pulleys for reliable operation.',
//     price: 'LKR 28,500',
//     rating: 4.4,
//     reviewCount: 76,
//     availability: 'Out of Stock',
//     image: belt,
//     stock: 0,
//     compatibility: "Toyota, Volvo (automatic gearboxes)",
//     position: '',
//     brand: 'Mobil',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '1 Litre'
//   },
//   {
//     id: 'PD006',
//     productName: 'Radiator Assembly',
//     category: 'Engine & Fluids',
//     subcategory: 'Cooling',
//     description: 'Aluminum radiator with enhanced cooling capacity for optimal temperature control.',
//     price: 'LKR 45,000',
//     rating: 4.3,
//     reviewCount: 45,
//     availability: 'In Stock',
//     image: belt,
//     stock: 15,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   },
//   {
//     id: 'PD007',
//     productName: 'Battery 12V 70Ah',
//     category: 'Engine & Fluids',
//     subcategory: 'Electrical',
//     description: 'Maintenance-free lead-acid battery with excellent cold cranking performance.',
//     price: 'LKR 18,750',
//     rating: 4.7,
//     reviewCount: 203,
//     availability: 'In Stock',
//     image: battery,
//     stock: 28,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   },
//   {
//     id: 'PD008',
//     productName: 'Alternator',
//     category: 'Wear & Tear Parts',
//     subcategory: 'Electrical',
//     description: 'High-output alternator ensuring reliable electrical system performance.',
//     price: 'LKR 35,200',
//     rating: 4.1,
//     reviewCount: 67,
//     availability: 'In Stock',
//     image: battery,
//     stock: 12,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   }
// ];

// const ITEMS_PER_PAGE = 5;

// const ProductDetails: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>("Engine & Fluids");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
//   // New state for edit functionality
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [productToEdit, setProductToEdit] = useState<Product | null>(null);

//   const currentColumns = categoryConfigs[selectedCategory] || [];
//   const filteredProducts = products.filter(
//     (product) => product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
//   );

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//   const handleAddProduct = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSaveProduct = () => {
//     // Add your save logic here
//     console.log('Product saved!');
//     // You can add the new product to your products array here
//   };

//   const handleViewProduct = (product: Product) => {
//     setSelectedProduct(product);
//     setIsViewPanelOpen(true);
//   };

//   const handleCloseViewPanel = () => {
//     setIsViewPanelOpen(false);
//     setSelectedProduct(null);
//   };

//   // Updated edit handler to open edit modal
//   const handleEditProduct = (product: Product) => {
//     setProductToEdit(product);
//     setIsEditModalOpen(true);
//     // Close view panel if it's open
//     setIsViewPanelOpen(false);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setProductToEdit(null);
//   };

//   // Conversion for Engine & Fluids (already present)
//   const convertToEngineFluidProduct = (product: Product): EngineFluidProduct => ({
//     productName: product.productName,
//     fluidType: product.subcategory,
//     specification: '',
//     brand: product.brand,
//     volume: product.volume,
//     compatibility: product.compatibility,
//     replacementCycle: '',
//     boilingPoint: '',
//     description: product.description,
//     stock: product.stock,
//     lowStockThreshold: 10,
//     price: product.price,
//     discountType: '',
//     discountValue: 0,
//     image: product.image,
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//   });

//   // Conversion for Wear & Tear Parts
//   const convertToWearTearProduct = (product: Product) => ({
//     productName: product.productName,
//     partType: product.subcategory,
//     material: product.material,
//     position: product.position,
//     brand: product.brand,
//     size: '',
//     compatibility: product.compatibility,
//     replacementCycle: '',
//     description: product.description,
//     quantity: product.stock,
//     price: product.price,
//     minimumQuantity: 1,
//     discountType: '',
//     discountValue: 0,
//     image: product.image,
//     warranty: '',
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//   });

//   // Conversion for Exterior & Body Parts
//   const convertToExteriorBodyPartProduct = (product: Product) => ({
//     productName: product.productName,
//     partType: product.subcategory,
//     material: product.material,
//     position: product.position,
//     finish: product.finish,
//     mountingFeatures: '',
//     electronicFeatures: '',
//     colorCode: product.color,
//     brand: product.brand,
//     compatibility: product.compatibility,
//     notes: product.description,
//     quantity: product.stock,
//     price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
//     minQuantity: 1,
//     discountType: '',
//     discountValue: 0,
//     warranty: '',
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//     image: product.image,
//   });

//   const handleSaveEditedProduct = (updatedData: EngineFluidProduct) => {
//     // Here you would update your products array or make an API call
//     console.log('Updated product data:', updatedData);
    
//     // Example: Update the products array (you'll need to implement proper state management)
//     // const updatedProducts = products.map(product => 
//     //   product.id === productToEdit?.id 
//     //     ? { ...product, ...updatedData } 
//     //     : product
//     // );
    
//     // Close the edit modal
//     setIsEditModalOpen(false);
//     setProductToEdit(null);
    
//     // Show success message or refresh the data
//     alert('Product updated successfully!');
//   };

//   const handleDeleteProduct = (productId: string) => {
//     // Implement delete logic
//     console.log('Deleting product:', productId);
//     // Show confirmation dialog, then delete
//     setIsViewPanelOpen(false);
//   };

//   const handleDuplicateProduct = (product: Product) => {
//     // Implement duplicate logic
//     console.log('Duplicating product:', product);
//     // Create a new product based on the current one
//     setIsViewPanelOpen(false);
//   };

//   return (
//     <div className="product-details">
//       <div className="product-details__header">
//         <h2 className="product-details__title">Product List</h2>
//         <div className="product-details__actions">
//           <button className="btn pdf">PDF</button>
//           <button className="btn refresh">⟳</button>
//           <button className="btn sort">⇅</button>
//           <button className="btn add" onClick={handleAddProduct}>
//             + Add Product
//           </button>
//         </div>
//       </div>

//       <div className="product-details__filters">
//         <input className="filter-input" placeholder="Search..." />
//         <select
//           className="filter-select"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value as keyof typeof categoryConfigs)}
//         >
//           {Object.keys(categoryConfigs).map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>

//         <select className="filter-select">
//           <option value="">All Sub-Categories</option>
//         </select>

//         <select className="filter-select">
//           <option value="">All Statuses</option>
//           <option value="In Stock">In Stock</option>
//           <option value="Low Stock">Low Stock</option>
//           <option value="Out of Stock">Out of Stock</option>
//         </select>
//       </div>

//       <div className="product-details__table">        
//         <div className="product-details__table-header">
//           {currentColumns.map((col) => (
//             <div key={col.key} className="product-details__header-cell">{col.label}</div>
//           ))}
//           <div className="product-details__header-cell">Price</div>
//           <div className="product-details__header-cell">Stock</div>
//           <div className="product-details__header-cell">Availability</div>
//           <div className="product-details__header-cell">Actions</div>
//         </div>
//         <div className="product-details__table-body">
//           {paginatedProducts.map((product) => (
//             <div key={product.id} className="product-details__row">
//               {currentColumns.map((col) => (
//                 <div key={col.key} className="product-details__cell">
//                   {product[col.key as keyof Product] ?? '—'}
//                 </div>
//               ))}
//               <div className="product-details__cell">{product.price}</div>
//               <div className="product-details__cell">{product.stock}</div>
//               <div className="product-details__cell">
//                 <span className={`product-details__status product-details__status--${product.availability.toLowerCase().replace(/\s+/g, '-')}`}>
//                   {product.availability}
//                 </span>
//               </div>
//               <div className="product-details__cell product-details__actions-group">
//                 <button className="product-details__action-btn product-details__action-btn--view" onClick={() => handleViewProduct(product)}>
//                   {/* <Eye size={16} /> */}👁️
//                 </button>
//                 <button className="product-details__action-btn product-details__action-btn--edit" onClick={() => handleEditProduct(product)}>
//                   {/* <Pencil size={16} /> */}✏️
//                 </button>
//                 <button className="product-details__action-btn product-details__action-btn--delete" onClick={() => handleDeleteProduct(product.id)}>
//                   {/* <Trash2 size={16} /> */}🗑️
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="product-details__pagination">
//         <button
//           className="product-details__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="product-details__pagination-info">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="product-details__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Add Product Modal */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSave={handleSaveProduct}
//       />

//       {/* Edit Product Modal */}
//       {isEditModalOpen && productToEdit && (
//         <div className="modal-overlay" onClick={handleCloseEditModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <button className="modal-close" onClick={handleCloseEditModal}>×</button>
//             </div>
//             <EditProduct
//               category={productToEdit.category}
//               existingData={
//                 productToEdit.category === 'Engine & Fluids'
//                   ? convertToEngineFluidProduct(productToEdit)
//                   : productToEdit.category === 'Wear & Tear Parts'
//                   ? convertToWearTearProduct(productToEdit)
//                   : productToEdit.category === 'Exterior & Body Parts'
//                   ? convertToExteriorBodyPartProduct(productToEdit)
//                   : productToEdit
//               }
//               onSave={handleSaveEditedProduct}
//             />
//           </div>
//         </div>
//       )}

//       {/* Product View Panel */}
//       <ProductViewPanel
//         isOpen={isViewPanelOpen}
//         onClose={handleCloseViewPanel}
//         product={selectedProduct}
//         onDelete={handleDeleteProduct}
//       />
//     </div>
//   );
// };

// export default ProductDetails;

// import React, { useState } from 'react';
// import './ProductDetails.scss';
// import { Pencil, Trash2, Eye } from 'lucide-react';
// import { categoryConfigs } from './categoryConfigs';
// import ProductModal from '../AddProducts/ProductModal';
// import ProductViewPanel from '../ViewProduct/ProductViewPanel';
// import EditProduct from '../EditProduct/EditProduct'; 

// import brakePadsImg from '../../../../assets/images/brakePads.png';
// import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
// import spark from '../../../../assets/images/spark.png';
// import battery from '../../../../assets/images/battery.png';
// import belt from '../../../../assets/images/timingBelt.png';

// interface Product {
//   id: string;
//   productName: string;
//   category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
//   subcategory: string;
//   description: string;
//   price: string;
//   rating: number;
//   reviewCount: number;
//   availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
//   image: string;
//   stock: number;
//   compatibility: string;
//   position: string;
//   brand: string;
//   finish: string;
//   material: string;
//   surfaceUse: string;
//   type: string;
//   color: string;
//   volume: string;
// }

// // Define the interface that EditProduct expects
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

// // Delete Confirmation Popup Component
// const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, productName }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleConfirm = async () => {
//     setIsDeleting(true);
//     // Add a small delay for better UX
//     await new Promise(resolve => setTimeout(resolve, 800));
//     onConfirm();
//     setIsDeleting(false);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="delete-modal-overlay" onClick={onClose}>
//       <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
//         <div className="delete-modal-header">
//           <div className="delete-icon">
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M3 6h18"></path>
//               <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
//               <path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 1 2v2"></path>
//               <line x1="10" y1="11" x2="10" y2="17"></line>
//               <line x1="14" y1="11" x2="14" y2="17"></line>
//             </svg>
//           </div>
//           <h3 className="delete-modal-title">Delete Product</h3>
//           <p className="delete-modal-message">
//             Are you sure you want to delete <strong>"{productName}"</strong>? 
//             This action cannot be undone and will permanently remove the product from your inventory.
//           </p>
//         </div>
        
//         <div className="delete-modal-actions">
//           <button 
//             className="delete-modal-btn delete-modal-btn--cancel" 
//             onClick={onClose}
//             disabled={isDeleting}
//           >
//             Cancel
//           </button>
//           <button 
//             className="delete-modal-btn delete-modal-btn--delete" 
//             onClick={handleConfirm}
//             disabled={isDeleting}
//           >
//             {isDeleting ? (
//               <>
//                 <div className="delete-spinner"></div>
//                 Deleting...
//               </>
//             ) : (
//               'Delete Product'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const products: Product[] = [
//   {
//     id: 'PD001',
//     productName: 'Castrol GTX Magnatec 10W-30',
//     category: 'Accessories & Add-ons',
//     subcategory: 'Engine Oil',
//     description: 'High-performance ceramic brake pads.',
//     price: 'LKR 15,500',
//     rating: 4.5,
//     reviewCount: 128,
//     availability: 'In Stock',
//     image: brakePadsImg,
//     stock: 45,
//     compatibility: "Petrol Engines (Toyota, Honda)",
//     position: '',
//     brand: 'Castrol',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '4 Litres'
//   },
//   {
//     id: 'PD002',
//     productName: 'Bosch ESI6 DOT 4 Brake Fluid',
//     category: 'Engine & Fluids',
//     subcategory: 'Brake Fluid',
//     description: 'Full synthetic motor oil providing superior engine protection and performance.',
//     price: 'LKR 8,200',
//     rating: 4.8,
//     reviewCount: 256,
//     availability: 'In Stock',
//     image: engineOilImg,
//     stock: 120,
//     compatibility: "Universal (ABS Compatible)",
//     position: '',
//     brand: 'Bosch',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '500 ml'
//   },
//   {
//     id: 'PD003',
//     productName: 'Prestone All Vehicle Coolant',
//     category: 'Engine & Fluids',
//     subcategory: 'Coolant',
//     description: 'High-efficiency air filter ensuring optimal engine performance and fuel economy.',
//     price: 'LKR 3,750',
//     rating: 4.2,
//     reviewCount: 89,
//     availability: 'Low Stock',
//     image: spark,
//     stock: 8,
//     compatibility: "All Makes and Models",
//     position: '',
//     brand: 'Prestone',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '3.78 Litres'
//   },
//   {
//     id: 'PD004',
//     productName: 'STP Power Steering Fluid',
//     category: 'Engine & Fluids',
//     subcategory: 'Power Steering Fluid',
//     description: 'Iridium spark plugs for enhanced ignition performance and longevity.',
//     price: 'LKR 12,000',
//     rating: 4.6,
//     reviewCount: 164,
//     availability: 'In Stock',
//     image: spark,
//     stock: 32,
//     compatibility: "Honda, Nissan, Kia, Hyundai",
//     position: '',
//     brand: 'STP',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '946 ml'
//   },
//   {
//     id: 'PD005',
//     productName: 'Mobil ATF 3309',
//     category: 'Engine & Fluids',
//     subcategory: 'Transmission Fluid',
//     description: 'Complete timing belt kit with tensioner and idler pulleys for reliable operation.',
//     price: 'LKR 28,500',
//     rating: 4.4,
//     reviewCount: 76,
//     availability: 'Out of Stock',
//     image: belt,
//     stock: 0,
//     compatibility: "Toyota, Volvo (automatic gearboxes)",
//     position: '',
//     brand: 'Mobil',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: '1 Litre'
//   },
//   {
//     id: 'PD006',
//     productName: 'Radiator Assembly',
//     category: 'Engine & Fluids',
//     subcategory: 'Cooling',
//     description: 'Aluminum radiator with enhanced cooling capacity for optimal temperature control.',
//     price: 'LKR 45,000',
//     rating: 4.3,
//     reviewCount: 45,
//     availability: 'In Stock',
//     image: belt,
//     stock: 15,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   },
//   {
//     id: 'PD007',
//     productName: 'Battery 12V 70Ah',
//     category: 'Engine & Fluids',
//     subcategory: 'Electrical',
//     description: 'Maintenance-free lead-acid battery with excellent cold cranking performance.',
//     price: 'LKR 18,750',
//     rating: 4.7,
//     reviewCount: 203,
//     availability: 'In Stock',
//     image: battery,
//     stock: 28,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   },
//   {
//     id: 'PD008',
//     productName: 'Alternator',
//     category: 'Wear & Tear Parts',
//     subcategory: 'Electrical',
//     description: 'High-output alternator ensuring reliable electrical system performance.',
//     price: 'LKR 35,200',
//     rating: 4.1,
//     reviewCount: 67,
//     availability: 'In Stock',
//     image: battery,
//     stock: 12,
//     compatibility: "",
//     position: '',
//     brand: '',
//     finish: '',
//     material: '',
//     surfaceUse: '',
//     type: '',
//     color: '',
//     volume: ''
//   }
// ];

// const ITEMS_PER_PAGE = 5;

// const ProductDetails: React.FC = () => {
//   const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>("Engine & Fluids");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
//   // Edit functionality state
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [productToEdit, setProductToEdit] = useState<Product | null>(null);

//   // Delete confirmation state
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

//   const currentColumns = categoryConfigs[selectedCategory] || [];
//   const filteredProducts = products.filter(
//     (product) => product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
//   );

//   const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//   const handleAddProduct = () => {
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleSaveProduct = () => {
//     // Add your save logic here
//     console.log('Product saved!');
//     // You can add the new product to your products array here
//   };

//   const handleViewProduct = (product: Product) => {
//     setSelectedProduct(product);
//     setIsViewPanelOpen(true);
//   };

//   const handleCloseViewPanel = () => {
//     setIsViewPanelOpen(false);
//     setSelectedProduct(null);
//   };

//   // Updated edit handler to open edit modal
//   const handleEditProduct = (product: Product) => {
//     setProductToEdit(product);
//     setIsEditModalOpen(true);
//     // Close view panel if it's open
//     setIsViewPanelOpen(false);
//   };

//   const handleCloseEditModal = () => {
//     setIsEditModalOpen(false);
//     setProductToEdit(null);
//   };

//   // Delete handlers
//   const handleDeleteProduct = (product: Product) => {
//     setProductToDelete(product);
//     setIsDeleteModalOpen(true);
//     // Close view panel if it's open
//     setIsViewPanelOpen(false);
//   };

//   const handleDeleteConfirm = () => {
//     if (productToDelete) {
//       // Implement your actual delete logic here
//       console.log('Deleting product:', productToDelete.id);
      
//       // Example: Remove from products array (you'll need proper state management)
//       // const updatedProducts = products.filter(p => p.id !== productToDelete.id);
//       // setProducts(updatedProducts);
      
//       // Close modal
//       setIsDeleteModalOpen(false);
//       setProductToDelete(null);
      
//       // Show success message
//       alert('Product deleted successfully!');
//     }
//   };

//   const handleDeleteCancel = () => {
//     setIsDeleteModalOpen(false);
//     setProductToDelete(null);
//   };

//   // Conversion for Engine & Fluids (already present)
//   const convertToEngineFluidProduct = (product: Product): EngineFluidProduct => ({
//     productName: product.productName,
//     fluidType: product.subcategory,
//     specification: '',
//     brand: product.brand,
//     volume: product.volume,
//     compatibility: product.compatibility,
//     replacementCycle: '',
//     boilingPoint: '',
//     description: product.description,
//     stock: product.stock,
//     lowStockThreshold: 10,
//     price: product.price,
//     discountType: '',
//     discountValue: 0,
//     image: product.image,
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//   });

//   // Conversion for Wear & Tear Parts
//   const convertToWearTearProduct = (product: Product) => ({
//     productName: product.productName,
//     partType: product.subcategory,
//     material: product.material,
//     position: product.position,
//     brand: product.brand,
//     size: '',
//     compatibility: product.compatibility,
//     replacementCycle: '',
//     description: product.description,
//     quantity: product.stock,
//     price: product.price,
//     minimumQuantity: 1,
//     discountType: '',
//     discountValue: 0,
//     image: product.image,
//     warranty: '',
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//   });

//   // Conversion for Exterior & Body Parts
//   const convertToExteriorBodyPartProduct = (product: Product) => ({
//     productName: product.productName,
//     partType: product.subcategory,
//     material: product.material,
//     position: product.position,
//     finish: product.finish,
//     mountingFeatures: '',
//     electronicFeatures: '',
//     colorCode: product.color,
//     brand: product.brand,
//     compatibility: product.compatibility,
//     notes: product.description,
//     quantity: product.stock,
//     price: parseFloat(product.price.replace(/[^0-9.]/g, '')),
//     minQuantity: 1,
//     discountType: '',
//     discountValue: 0,
//     warranty: '',
//     manufacturer: '',
//     manufacturedDate: '',
//     expiryDate: '',
//     image: product.image,
//   });

//   const handleSaveEditedProduct = (updatedData: EngineFluidProduct) => {
//     // Here you would update your products array or make an API call
//     console.log('Updated product data:', updatedData);
    
//     // Example: Update the products array (you'll need to implement proper state management)
//     // const updatedProducts = products.map(product => 
//     //   product.id === productToEdit?.id 
//     //     ? { ...product, ...updatedData } 
//     //     : product
//     // );
    
//     // Close the edit modal
//     setIsEditModalOpen(false);
//     setProductToEdit(null);
    
//     // Show success message or refresh the data
//     alert('Product updated successfully!');
//   };

//   const handleDuplicateProduct = (product: Product) => {
//     // Implement duplicate logic
//     console.log('Duplicating product:', product);
//     // Create a new product based on the current one
//     setIsViewPanelOpen(false);
//   };

//   const handleDeleteFromViewPanel = (productId: string) => {
//   // Find the product by ID
//   const product = products.find(p => p.id === productId);
//   if (product) {
//     handleDeleteProduct(product);
//   }
// };

//   return (
//     <div className="product-details">
//       <div className="product-details__header">
//         <h2 className="product-details__title">Product List</h2>
//         <div className="product-details__actions">
//           <button className="btn pdf">PDF</button>
//           <button className="btn refresh">⟳</button>
//           <button className="btn sort">⇅</button>
//           <button className="btn add" onClick={handleAddProduct}>
//             + Add Product
//           </button>
//         </div>
//       </div>

//       <div className="product-details__filters">
//         <input className="filter-input" placeholder="Search..." />
//         <select
//           className="filter-select"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value as keyof typeof categoryConfigs)}
//         >
//           {Object.keys(categoryConfigs).map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>

//         <select className="filter-select">
//           <option value="">All Sub-Categories</option>
//         </select>

//         <select className="filter-select">
//           <option value="">All Statuses</option>
//           <option value="In Stock">In Stock</option>
//           <option value="Low Stock">Low Stock</option>
//           <option value="Out of Stock">Out of Stock</option>
//         </select>
//       </div>

//       <div className="product-details__table">        
//         <div className="product-details__table-header">
//           {currentColumns.map((col) => (
//             <div key={col.key} className="product-details__header-cell">{col.label}</div>
//           ))}
//           <div className="product-details__header-cell">Price</div>
//           <div className="product-details__header-cell">Stock</div>
//           <div className="product-details__header-cell">Availability</div>
//           <div className="product-details__header-cell">Actions</div>
//         </div>
//         <div className="product-details__table-body">
//           {paginatedProducts.map((product) => (
//             <div key={product.id} className="product-details__row">
//               {currentColumns.map((col) => (
//                 <div key={col.key} className="product-details__cell">
//                   {product[col.key as keyof Product] ?? '—'}
//                 </div>
//               ))}
//               <div className="product-details__cell">{product.price}</div>
//               <div className="product-details__cell">{product.stock}</div>
//               <div className="product-details__cell">
//                 <span className={`product-details__status product-details__status--${product.availability.toLowerCase().replace(/\s+/g, '-')}`}>
//                   {product.availability}
//                 </span>
//               </div>
//               <div className="product-details__cell product-details__actions-group">
//                 <button className="product-details__action-btn product-details__action-btn--view" onClick={() => handleViewProduct(product)}>
//                   {/* <Eye size={16} /> */}👁️
//                 </button>
//                 <button className="product-details__action-btn product-details__action-btn--edit" onClick={() => handleEditProduct(product)}>
//                   {/* <Pencil size={16} /> */}✏️
//                 </button>
//                 <button className="product-details__action-btn product-details__action-btn--delete" onClick={() => handleDeleteProduct(product)}>
//                   {/* <Trash2 size={16} /> */}🗑️
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="product-details__pagination">
//         <button
//           className="product-details__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="product-details__pagination-info">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="product-details__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Add Product Modal */}
//       <ProductModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         onSave={handleSaveProduct}
//       />

//       {/* Edit Product Modal */}
//       {isEditModalOpen && productToEdit && (
//         <div className="modal-overlay" onClick={handleCloseEditModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <button className="modal-close" onClick={handleCloseEditModal}>×</button>
//             </div>
//             <EditProduct
//               category={productToEdit.category}
//               existingData={
//                 productToEdit.category === 'Engine & Fluids'
//                   ? convertToEngineFluidProduct(productToEdit)
//                   : productToEdit.category === 'Wear & Tear Parts'
//                   ? convertToWearTearProduct(productToEdit)
//                   : productToEdit.category === 'Exterior & Body Parts'
//                   ? convertToExteriorBodyPartProduct(productToEdit)
//                   : productToEdit
//               }
//               onSave={handleSaveEditedProduct}
//             />
//           </div>
//         </div>
//       )}

//       {/* Product View Panel */}
//       <ProductViewPanel
//         isOpen={isViewPanelOpen}
//         onClose={handleCloseViewPanel}
//         product={selectedProduct}
//         onDelete={handleDeleteFromViewPanel}
//       />

//       {/* Delete Confirmation Popup */}
//       <DeleteConfirmationPopup
//         isOpen={isDeleteModalOpen}
//         onClose={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         productName={productToDelete?.productName || ''}
//       />
//     </div>
//   );
// };

// export default ProductDetails;

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

interface Product {
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

const products: Product[] = [
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
    volume: '4 Litres'
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
    availability: 'In Stock',
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
    volume: '500 ml'
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
    volume: '3.78 Litres'
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
    volume: '946 ml'
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
    volume: '1 Litre'
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
    volume: ''
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
    volume: ''
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
    volume: ''
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
                  {/* <Eye size={16} /> */}👁️
                </button>
                <button className="product-details__action-btn product-details__action-btn--edit" onClick={() => handleEditProduct(product)}>
                  {/* <Pencil size={16} /> */}✏️
                </button>
                <button className="product-details__action-btn product-details__action-btn--delete" onClick={() => handleDeleteProduct(product)}>
                  {/* <Trash2 size={16} /> */}🗑️
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
              <button className="modal-close" onClick={handleCloseEditModal}>×</button>
            </div>
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