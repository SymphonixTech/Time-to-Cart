import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Product1 } from './types';

// Props
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  productToEdit: Product1 | null;
}

// Separate type for form data (everything as string or array before submit)
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  subcategory: string;
  stockQuantity: string;
  status: string;
  tags: string[];
  specifications: {
    Material: string;
    Dimensions: string;
    Weight: string;
    Burn_Time: string;
    Scent: string;
  };
  images: File[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Candles',
    subcategory: '',
    stockQuantity: '',
    status: 'new',
    tags: [''],
    specifications: {
      Material: '',
      Dimensions: '',
      Weight: '',
      Burn_Time: '',
      Scent: ''
    },
    images: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // When editing, prefill form
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        description: productToEdit.description || '',
        price: productToEdit.price?.toString() || '',
        originalPrice: productToEdit.originalPrice?.toString() || '',
        category: productToEdit.category || 'Candles',
        subcategory: productToEdit.subcategory || '',
        stockQuantity: productToEdit.stockQuantity?.toString() || '',
        status: productToEdit.status || 'new',
        tags: productToEdit.tags?.length ? productToEdit.tags : [''],
        specifications: {
          Material: productToEdit.specifications?.Material || '',
          Dimensions: productToEdit.specifications?.Dimensions || '',
          Weight: productToEdit.specifications?.Weight || '',
          Burn_Time: productToEdit.specifications?.Burn_Time || '',
          Scent: productToEdit.specifications?.Scent || ''
        },
        images: [] // editing won’t re-upload unless user picks new files
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Candles',
        subcategory: '',
        stockQuantity: '',
        status: 'new',
        tags: [''],
        specifications: {
          Material: '',
          Dimensions: '',
          Weight: '',
          Burn_Time: '',
          Scent: ''
        },
        images: []
      });
    }
  }, [productToEdit, isOpen]);

  // Generic input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // File upload handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      setFormData(prev => ({
        ...prev,
        images: Array.from(files)
      }));
    };

  // Tag handler
  const handleTagChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.map((t, i) => (i === index ? value : t))
    }));
  };

  const addTag = () => setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Specification field change
  const handleSpecChange = (field: keyof ProductFormData['specifications'], value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      if (formData.originalPrice) data.append('originalPrice', formData.originalPrice);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('stockQuantity', formData.stockQuantity);
      data.append('status', formData.status);

      formData.tags.forEach(tag => data.append('tags', tag));
      Object.entries(formData.specifications).forEach(([key, value]) =>
        data.append(key, value)
      );

      formData.images.forEach(file => data.append('files', file));

      const API_URL = (import.meta as any).env.VITE_API_URL;

      if (productToEdit?._id) {
        await axios.put(`${API_URL}/admin/products/${productToEdit._id}`, data, {
          withCredentials: true
        });
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${API_URL}/admin/products`, data, { withCredentials: true });
        toast.success('Product added successfully!');
      }

      onProductAdded();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                >
                  <option value="Candles">Candles</option>
                  <option value="Religious Products">Religious Products</option>
                  <option value="Kids Stationery">Kids Stationery</option>
                  <option value="Gifts">Gifts</option>
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(formData.specifications).map(key => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key}
                  </label>
                  <input
                    type="text"
                    value={formData.specifications[key as keyof typeof formData.specifications]}
                    onChange={e =>
                      handleSpecChange(
                        key as keyof ProductFormData['specifications'],
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                </div>
              ))}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={e => handleTagChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add Tag
              </button>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images *
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Saving...'
                  : productToEdit
                  ? 'Update Product'
                  : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;







// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { mongoService } from './lib/mongoService';
// import { Product } from './types';

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductAdded: () => void;
//   productToEdit?: Product | null;
// }

// const AddProductModal: React.FC<AddProductModalProps> = ({
//   isOpen,
//   onClose,
//   onProductAdded,
//   productToEdit
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     price: '',
//     originalPrice: '',
//     discount: '',
//     images: [],
//     category: 'Candles',
//     subcategory: '',
//     stockQuantity: '',
//     status: 'new',
//     features: [],
//     specifications: {
//       Materials: [],
//       Dimensions: '',
//       Weight: '',
//       Burn_Time: '',
//       Scent: '',
//     },
//     tags: []
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (productToEdit) {
//       setFormData({
//         name: productToEdit.name || '',
//         title: productToEdit.title || productToEdit.name || '',
//         description: productToEdit.description || '',
//         price: productToEdit.price?.toString() || '',
//         originalPrice: productToEdit.originalPrice?.toString() || '',
//         discount: productToEdit.discount?.toString() || '',
//         imageUrl: productToEdit.imageUrl || '',
//         category: productToEdit.category || 'Candles',
//         subcategory: productToEdit.subcategory || '',
//         stock: productToEdit.stock?.toString() || '',
//         status: productToEdit.status || 'new',
//         features: productToEdit.features?.length ? productToEdit.features : [''],
//         specifications.Weight: productToEdit.weight || '',
//         specifications.Dimensions: productToEdit.dimensions || '',
//         specifications.Materials: productToEdit.materials?.length ? productToEdit.materials : [''],
//         tags: productToEdit.tags?.length ? productToEdit.tags : ['']
//       });
//     } else {
//       // Reset form for new product
//       setFormData({
//         name: '',
//         description: '',
//         price: '',
//         originalPrice: '',
//         discount: '',
//         images: [],
//         category: 'Candles',
//         subcategory: '',
//         stockQuantity: '',
//         status: 'new',
//         features: [],
//         specifications: {
//           Materials: [],
//           Dimensions: '',
//           Weight: '',
//           Burn_Time: '',
//           Scent: '',
//         },
//         tags: []
//       });
//     }
//   }, [productToEdit, isOpen]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleArrayChange = (field: 'features' | 'materials' | 'tags', index: number, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].map((item, i) => i === index ? value : item)
//     }));
//   };

//   const addArrayItem = (field: 'features' | 'materials' | 'tags') => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: [...prev[field], '']
//     }));
//   };

//   const removeArrayItem = (field: 'features' | 'materials' | 'tags', index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: prev[field].filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const productData = {
//         ...formData,
//         price: parseFloat(formData.price),
//         originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
//         discount: formData.discount ? parseInt(formData.discount) : 0,
//         stock: parseInt(formData.stock),
//         features: formData.features.filter(f => f.trim() !== ''),
//         materials: formData.materials.filter(m => m.trim() !== ''),
//         tags: formData.tags.filter(t => t.trim() !== '')
//       };

//       if (productToEdit) {
//         await MongoService.updateProduct(productToEdit._id, productData);
//         toast.success('Product updated successfully!');
//       } else {
//         await MongoService.createProduct(productData);
//         toast.success('Product added successfully!');
//       }

//       onProductAdded();
//       onClose();
//     } catch (error) {
//       console.error('Error saving product:', error);
//       toast.error('Failed to save product');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {productToEdit ? 'Edit Product' : 'Add New Product'}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price *
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   step="0.01"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Original Price
//                 </label>
//                 <input
//                   type="number"
//                   name="originalPrice"
//                   value={formData.originalPrice}
//                   onChange={handleInputChange}
//                   step="0.01"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Stock *
//                 </label>
//                 <input
//                   type="number"
//                   name="stock"
//                   value={formData.stock}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//                 >
//                   <option value="Candles">Candles</option>
//                   <option value="Accessories">Accessories</option>
//                   <option value="Gift Sets">Gift Sets</option>
//                   <option value="Home Decor">Home Decor</option>
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description *
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//                 rows={4}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Image URL *
//               </label>
//               <input
//                 type="url"
//                 name="imageUrl"
//                 value={formData.imageUrl}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
//               />
//             </div>

//             <div className="flex justify-end space-x-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
//               >
//                 {isSubmitting ? 'Saving...' : (productToEdit ? 'Update Product' : 'Add Product')}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;
