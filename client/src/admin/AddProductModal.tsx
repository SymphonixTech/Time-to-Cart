import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  originalPrice: number | string;
  category: string;
  subcategory: string;
  inStock: boolean;
  stockQuantity: number | string;
  sales: number | string;
  tags: string;
  estimatedDays: number | string;
  freeDelivery: boolean;
  returnPolicy: string;
  Material: string;
  Dimensions: string;
  Weight: string;
  Burn_Time: string;
  Scent: string;
  addToSliders: boolean;
  bestSeller: boolean;
  featured: boolean;
  status: string;
}

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: () => void;
  productToEdit?: any | null;
}

const categories = ["Candles", "Religious Products", "Kids Stationery", "Gifts"];

const subCategories: Record<string, string[]> = {
  Candles: [
    "Scented Candles",
    "Soy Wax",
    "Decor Candles",
    "Aromatherapy",
    "Luxury Collection",
    "Gift Sets",
  ],
  "Religious Products": [],
  "Kids Stationery": [],
  Gifts: [],
};

const statusOptions = [
  "new",
  "sale",
  "discounted",
  "featured",
  "bestseller",
  "trending",
];

const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  onProductSaved,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    inStock: true,
    stockQuantity: "",
    sales: "",
    tags: "",
    estimatedDays: "",
    freeDelivery: false,
    returnPolicy: "",
    Material: "",
    Dimensions: "",
    Weight: "",
    Burn_Time: "",
    Scent: "",
    addToSliders: false,
    bestSeller: false,
    featured: false,
    status: "new",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData(prev => ({
        ...prev,
        ...productToEdit,
        tags: productToEdit.tags?.join(", ") || "",
        estimatedDays: productToEdit.deliveryInfo?.estimatedDays || "",
        freeDelivery: productToEdit.deliveryInfo?.freeDelivery || false,
        returnPolicy: productToEdit.deliveryInfo?.returnPolicy || "",
        Material: productToEdit.specifications?.Material || "",
        Dimensions: productToEdit.specifications?.Dimensions || "",
        Weight: productToEdit.specifications?.Weight || "",
        Burn_Time: productToEdit.specifications?.Burn_Time || "",
        Scent: productToEdit.specifications?.Scent || "",
      }));
    } else {
      resetForm();
    }
  }, [productToEdit]);

  if (!isOpen) return null;

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
      tags: "",
      estimatedDays: "",
      freeDelivery: false,
      returnPolicy: "",
      Material: "",
      Dimensions: "",
      Weight: "",
      Burn_Time: "",
      Scent: "",
      addToSliders: false,
      bestSeller: false,
      featured: false,
      status: "new",
    });
    setFiles([]);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });

      // Handle complex nested fields
      data.append(
        "tags",
        JSON.stringify(formData.tags.split(",").map((t) => t.trim()))
      );
      data.append(
        "deliveryInfo",
        JSON.stringify({
          freeDelivery: formData.freeDelivery,
          estimatedDays: formData.estimatedDays,
          returnPolicy: formData.returnPolicy,
        })
      );
      data.append(
        "specifications",
        JSON.stringify({
          Material: formData.Material,
          Dimensions: formData.Dimensions,
          Weight: formData.Weight,
          Burn_Time: formData.Burn_Time,
          Scent: formData.Scent,
        })
      );

      files.forEach((file) => data.append("images", file));

      if (productToEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
          data,
          { withCredentials: true }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, data, {
          withCredentials: true,
        });
        toast.success("Product added successfully!");
      }

      onProductSaved();
      onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Error while saving product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {productToEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Description */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={3}
          />

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {subCategories[formData.category]?.length > 0 && (
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Subcategory</option>
                {subCategories[formData.category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Stock & Sales */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="number"
              name="sales"
              placeholder="Sales Count"
              value={formData.sales}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* Tags */}
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="estimatedDays"
              placeholder="Estimated Delivery Days"
              value={formData.estimatedDays}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              name="returnPolicy"
              placeholder="Return Policy"
              value={formData.returnPolicy}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="freeDelivery"
              checked={formData.freeDelivery}
              onChange={handleChange}
            />
            Free Delivery
          </label>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-4">
            {["Material", "Dimensions", "Weight", "Burn_Time", "Scent"].map(
              (field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field}
                  value={(formData as any)[field]}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />
              )
            )}
          </div>

          {/* Status + Checkboxes */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-4">
            {["featured", "bestSeller", "addToSliders"].map((field) => (
              <label key={field} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field}
                  checked={(formData as any)[field]}
                  onChange={handleChange}
                />
                {field}
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition"
          >
            {loading
              ? "Saving..."
              : productToEdit
              ? "Update Product"
              : "Add Product"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEditProductModal;







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
