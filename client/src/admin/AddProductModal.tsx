import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  productToEdit?: any;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    inStock: true,
    stockQuantity: "",
    sales: "",
    featured: false,
    bestSeller: false,
    addToSliders: false,
    addToTopCard: false,
    tags: "",
    estimatedDays: "",
    freeDelivery: false,
    returnPolicy: "",
    Material: "",
    Dimensions: "",
    Weight: "",
    Burn_Time: "",
    Scent: "",
    status: "new",
  });

  const [files, setFiles] = useState<File[]>([]);

  const categories = [
    "Candles",
    "Religious Products",
    "Kids Stationery",
    "Gifts",
  ];

  const subcategories = [
    "Scented Candles",
    "Soy Wax",
    "Gift Sets",
    "Decor Candles",
    "Aromatherapy",
  ];

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      inStock: true,
      stockQuantity: "",
      sales: "",
      featured: false,
      bestSeller: false,
      addToSliders: false,
      addToTopCard: false,
      tags: "",
      estimatedDays: "",
      freeDelivery: false,
      returnPolicy: "",
      Material: "",
      Dimensions: "",
      Weight: "",
      Burn_Time: "",
      Scent: "",
      status: "new",
    });
    setFiles([]);
  };

  // Preload product data for edit mode
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...formData,
        ...productToEdit,
        tags: productToEdit.tags
          ? Array.isArray(productToEdit.tags)
            ? productToEdit.tags.join(", ")
            : productToEdit.tags
          : "",
      });
    } else {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productToEdit]);

  if (!isOpen) return null;

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Submit handler (Add / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value as any)
      );
      files.forEach((file) => data.append("files", file));

      if (productToEdit) {
        await axios.put(`/api/admin/products/${productToEdit._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product updated successfully");
      } else {
        await axios.post("/api/admin/products", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product added successfully");
      }

      onProductAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {productToEdit ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="w-full p-3 border rounded-lg"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            required
            className="w-full p-3 border rounded-lg"
          />

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              required
              className="p-3 border rounded-lg"
            />
            <input
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              placeholder="Original Price"
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Category */}
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {formData.category === "Candles" && (
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </select>
          )}

          {/* Stock */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              placeholder="Stock Quantity"
              className="p-3 border rounded-lg"
            />
            <input
              name="sales"
              value={formData.sales}
              onChange={handleInputChange}
              placeholder="Sales"
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Tags */}
          <input
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-3 border rounded-lg"
          />

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4">
            {[
              { name: "featured", label: "Featured" },
              { name: "bestSeller", label: "Best Seller" },
              { name: "addToSliders", label: "Add to Sliders" },
              { name: "addToTopCard", label: "Add to Top Card" },
              { name: "freeDelivery", label: "Free Delivery" },
              { name: "inStock", label: "In Stock" },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={
                    formData[item.name as keyof typeof formData] as boolean
                  }
                  onChange={handleInputChange}
                />
                {item.label}
              </label>
            ))}
          </div>

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
          >
            {["new", "sale", "discounted", "featured", "bestseller", "trending"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>

          {/* Extra Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="estimatedDays"
              value={formData.estimatedDays}
              onChange={handleInputChange}
              placeholder="Estimated Delivery Days"
              className="p-3 border rounded-lg"
            />
            <input
              name="returnPolicy"
              value={formData.returnPolicy}
              onChange={handleInputChange}
              placeholder="Return Policy"
              className="p-3 border rounded-lg"
            />
            <input
              name="Material"
              value={formData.Material}
              onChange={handleInputChange}
              placeholder="Material"
              className="p-3 border rounded-lg"
            />
            <input
              name="Dimensions"
              value={formData.Dimensions}
              onChange={handleInputChange}
              placeholder="Dimensions"
              className="p-3 border rounded-lg"
            />
            <input
              name="Weight"
              value={formData.Weight}
              onChange={handleInputChange}
              placeholder="Weight"
              className="p-3 border rounded-lg"
            />
            <input
              name="Burn_Time"
              value={formData.Burn_Time}
              onChange={handleInputChange}
              placeholder="Burn Time"
              className="p-3 border rounded-lg"
            />
            <input
              name="Scent"
              value={formData.Scent}
              onChange={handleInputChange}
              placeholder="Scent"
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-2">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {productToEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;








// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '../lib/firebase';
// import toast from 'react-hot-toast';
// import BagLoader from '../components/BagLoader';
// import { Product } from '../types';

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductAdded: () => void;
//   productToEdit?: Product | null;
// }

// const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded, productToEdit }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     title: '',
//     description: '',
//     price: '',
//     originalPrice: '',
//     discount: '',
//     stock: '',
//     category: '',
//     imageUrl: '',
//     features: [] as string[]
//   });

//   const categories = [
//     'Scented Candles',
//     'Soy Wax',
//     'Gift Sets',
//     'Decor Candles',
//     'Aromatherapy',
//     'Kids Stationaries'
//   ];

//   const sampleImages = [
//     'https://images.unsplash.com/photo-1602874801006-2bd9b9157e8d?w=400&h=400&fit=crop&auto=format',
//     'https://images.unsplash.com/photo-1571842893175-3ed4539c4226?w=400&h=400&fit=crop&auto=format',
//     'https://images.unsplash.com/photo-1544306094-7ad5b7e71c75?w=400&h=400&fit=crop&auto=format',
//     'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop&auto=format',
//     'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=400&h=400&fit=crop&auto=format',
//     'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop&auto=format'
//   ];

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const productData = {
//         name: formData.name,
//         title: formData.title || formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price),
//         originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
//         discount: formData.discount ? parseInt(formData.discount) : 0,
//         stock: parseInt(formData.stock),
//         category: formData.category,
//         imageUrl: formData.imageUrl || sampleImages[Math.floor(Math.random() * sampleImages.length)],
//         features: formData.features.filter(f => f.trim() !== ''),
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       await addDoc(collection(db, 'products'), productData);
      
//       // Immediate success feedback
//       toast.success('Product added successfully!');
      
//       // Refresh products immediately
//       onProductAdded();
      
//       setLoading(false);
//       onClose();
//       resetForm();
//     } catch (error) {
//       console.error('Error adding product:', error);
//       toast.error('Failed to add product');
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       title: '',
//       description: '',
//       price: '',
//       originalPrice: '',
//       discount: '',
//       stock: '',
//       category: '',
//       imageUrl: '',
//       features: []
//     });
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const addFeature = () => {
//     setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
//   };

//   const updateFeature = (index: number, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.map((feature, i) => i === index ? value : feature)
//     }));
//   };

//   const removeFeature = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
//           onClick={onClose}
//         >
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   {productToEdit ? 'Edit Product' : 'Add New Product'}
//                 </h2>
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                 >
//                   <XMarkIcon className="w-6 h-6" />
//                 </button>
//               </div>

//               {loading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <div className="flex items-center space-x-3">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//                     <span className="text-gray-600">Adding Product...</span>
//                   </div>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Product Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         required
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="e.g., Lavender Dreams Candle"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Display Title
//                       </label>
//                       <input
//                         type="text"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="Leave blank to use product name"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Description *
//                     </label>
//                     <textarea
//                       name="description"
//                       required
//                       rows={4}
//                       value={formData.description}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
//                       placeholder="Describe your product..."
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Price (₹) *
//                       </label>
//                       <input
//                         type="number"
//                         name="price"
//                         required
//                         min="0"
//                         step="0.01"
//                         value={formData.price}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="999"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Original Price (₹)
//                       </label>
//                       <input
//                         type="number"
//                         name="originalPrice"
//                         min="0"
//                         step="0.01"
//                         value={formData.originalPrice}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="1299"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Stock Quantity *
//                       </label>
//                       <input
//                         type="number"
//                         name="stock"
//                         required
//                         min="0"
//                         value={formData.stock}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                         placeholder="50"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Category *
//                     </label>
//                     <select
//                       name="category"
//                       required
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                     >
//                       <option value="">Select a category</option>
//                       {categories.map(category => (
//                         <option key={category} value={category}>
//                           {category}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Image URL
//                     </label>
//                     <input
//                       type="url"
//                       name="imageUrl"
//                       value={formData.imageUrl}
//                       onChange={handleInputChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                       placeholder="https://example.com/image.jpg (leave blank for random sample)"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Product Features
//                     </label>
//                     <div className="space-y-2">
//                       {formData.features.map((feature, index) => (
//                         <div key={index} className="flex gap-2">
//                           <input
//                             type="text"
//                             value={feature}
//                             onChange={(e) => updateFeature(index, e.target.value)}
//                             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                             placeholder="Feature description"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => removeFeature(index)}
//                             className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       ))}
//                       <button
//                         type="button"
//                         onClick={addFeature}
//                         className="text-orange-500 hover:text-orange-600 text-sm font-medium"
//                       >
//                         + Add Feature
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//                     <button
//                       type="button"
//                       onClick={onClose}
//                       className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
//                     >
//                       Add Product
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AddProductModal;
