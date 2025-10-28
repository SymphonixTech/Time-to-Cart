import React, { useState, useEffect } from "react";
import axios from "axios";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  stockQuantity: string;
  sales: string;
  tags: string[];
  estimatedDays: string;
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

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
  productToEdit?: any;
}

const categoryOptions = [
  "Candles",
  "Religious Products",
  "Kids Stationery",
  "Gifts",
];

const subcategoryMap: Record<string, string[]> = {
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

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    inStock: true,
    stockQuantity: "",
    sales: "",
    tags: [""],
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

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...formData,
        ...productToEdit,
        price: productToEdit.price?.toString() || "",
        originalPrice: productToEdit.originalPrice?.toString() || "",
        stockQuantity: productToEdit.stockQuantity?.toString() || "",
        sales: productToEdit.sales?.toString() || "",
        tags: productToEdit.tags?.length ? productToEdit.tags : [""],
      });
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

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
      tags: [""],
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
    setUploadedImages([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = uploadedImages.length + selectedFiles.length;

    if (totalFiles > 5) {
      toast.error("You can upload up to 5 images only.");
      return;
    }

    setUploadedImages((prev) => [...prev, ...selectedFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTagChange = (index: number, value: string) => {
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({ ...formData, tags: updatedTags });
  };

  const addTagField = () => setFormData({ ...formData, tags: [...formData.tags, ""] });
  const removeTagField = (index: number) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else {
          data.append(key, value.toString());
        }
      });
      uploadedImages.forEach((file) => data.append("images", file));

      if (productToEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Product added successfully!");
      }

      onProductAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {productToEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="input" required />
            <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="input" required />
            <input name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="Original Price" className="input" />
            <select name="category" value={formData.category} onChange={handleChange} className="input" required>
              <option value="">Select Category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="input"
              disabled={!subcategoryMap[formData.category]?.length}
            >
              <option value="">Select Subcategory</option>
              {subcategoryMap[formData.category]?.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="input">
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="input h-24"
          />

          {/* Boolean Fields */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {["freeDelivery", "inStock", "addToSliders", "bestSeller", "featured"].map((field) => (
              <label key={field} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={field} checked={(formData as any)[field]} onChange={handleChange} />
                {field}
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images (Max: 5)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">Click to upload or drag files</p>
                </div>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder={`Tag ${index + 1}`}
                  className="input flex-1"
                />
                <button type="button" onClick={() => removeTagField(index)} className="bg-red-500 text-white px-2 rounded-md" disabled={formData.tags.length === 1}>−</button>
                <button type="button" onClick={addTagField} className="bg-green-500 text-white px-2 rounded-md">+</button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : productToEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductAdded: () => void;
//   productToEdit?: any;
// }

// const AddProductModal: React.FC<AddProductModalProps> = ({
//   isOpen,
//   onClose,
//   onProductAdded,
//   productToEdit,
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     originalPrice: "",
//     category: "",
//     subcategory: "",
//     inStock: true,
//     stockQuantity: "",
//     sales: "",
//     featured: false,
//     bestSeller: false,
//     addToSliders: false,
//     addToTopCard: false,
//     tags: "",
//     estimatedDays: "",
//     freeDelivery: false,
//     returnPolicy: "",
//     Material: "",
//     Dimensions: "",
//     Weight: "",
//     Burn_Time: "",
//     Scent: "",
//     status: "new",
//   });

//   const [files, setFiles] = useState<File[]>([]);

//   const categories = [
//     "Candles",
//     "Religious Products",
//     "Kids Stationery",
//     "Gifts",
//   ];

//   const subcategories = [
//     "Scented Candles",
//     "Soy Wax",
//     "Gift Sets",
//     "Decor Candles",
//     "Aromatherapy",
//   ];

//   // Reset form
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       description: "",
//       price: "",
//       originalPrice: "",
//       category: "",
//       subcategory: "",
//       inStock: true,
//       stockQuantity: "",
//       sales: "",
//       featured: false,
//       bestSeller: false,
//       addToSliders: false,
//       addToTopCard: false,
//       tags: "",
//       estimatedDays: "",
//       freeDelivery: false,
//       returnPolicy: "",
//       Material: "",
//       Dimensions: "",
//       Weight: "",
//       Burn_Time: "",
//       Scent: "",
//       status: "new",
//     });
//     setFiles([]);
//   };

//   // Preload product data for edit mode
//   useEffect(() => {
//     if (productToEdit) {
//       setFormData({
//         ...formData,
//         ...productToEdit,
//         tags: productToEdit.tags
//           ? Array.isArray(productToEdit.tags)
//             ? productToEdit.tags.join(", ")
//             : productToEdit.tags
//           : "",
//       });
//     } else {
//       resetForm();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [productToEdit]);

//   if (!isOpen) return null;

//   // Handle input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Handle file uploads
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   // Submit handler (Add / Edit)
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       Object.entries(formData).forEach(([key, value]) =>
//         data.append(key, value as any)
//       );
//       files.forEach((file) => data.append("files", file));

//       if (productToEdit) {
//         await axios.put(`/api/admin/products/${productToEdit._id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("✅ Product updated successfully");
//       } else {
//         await axios.post("/api/admin/products", data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         toast.success("✅ Product added successfully");
//       }

//       onProductAdded();
//       onClose();
//       resetForm();
//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Failed to save product");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
//         <h2 className="text-2xl font-semibold mb-4">
//           {productToEdit ? "Edit Product" : "Add New Product"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Basic Info */}
//           <input
//             name="name"
//             value={formData.name}
//             onChange={handleInputChange}
//             placeholder="Product Name"
//             required
//             className="w-full p-3 border rounded-lg"
//           />
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Product Description"
//             required
//             className="w-full p-3 border rounded-lg"
//           />

//           {/* Pricing */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//               placeholder="Price"
//               required
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="originalPrice"
//               value={formData.originalPrice}
//               onChange={handleInputChange}
//               placeholder="Original Price"
//               className="p-3 border rounded-lg"
//             />
//           </div>

//           {/* Category */}
//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleInputChange}
//             className="w-full p-3 border rounded-lg"
//           >
//             <option value="">Select Category</option>
//             {categories.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           {formData.category === "Candles" && (
//             <select
//               name="subcategory"
//               value={formData.subcategory}
//               onChange={handleInputChange}
//               className="w-full p-3 border rounded-lg"
//             >
//               <option value="">Select Subcategory</option>
//               {subcategories.map((sc) => (
//                 <option key={sc} value={sc}>
//                   {sc}
//                 </option>
//               ))}
//             </select>
//           )}

//           {/* Stock */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="stockQuantity"
//               value={formData.stockQuantity}
//               onChange={handleInputChange}
//               placeholder="Stock Quantity"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="sales"
//               value={formData.sales}
//               onChange={handleInputChange}
//               placeholder="Sales"
//               className="p-3 border rounded-lg"
//             />
//           </div>

//           {/* Tags */}
//           <input
//             name="tags"
//             value={formData.tags}
//             onChange={handleInputChange}
//             placeholder="Tags (comma-separated)"
//             className="w-full p-3 border rounded-lg"
//           />

//           {/* Checkboxes */}
//           <div className="flex flex-wrap gap-4">
//             {[
//               { name: "featured", label: "Featured" },
//               { name: "bestSeller", label: "Best Seller" },
//               { name: "addToSliders", label: "Add to Sliders" },
//               { name: "addToTopCard", label: "Add to Top Card" },
//               { name: "freeDelivery", label: "Free Delivery" },
//               { name: "inStock", label: "In Stock" },
//             ].map((item) => (
//               <label key={item.name} className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   name={item.name}
//                   checked={
//                     formData[item.name as keyof typeof formData] as boolean
//                   }
//                   onChange={handleInputChange}
//                 />
//                 {item.label}
//               </label>
//             ))}
//           </div>

//           {/* Status */}
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleInputChange}
//             className="w-full p-3 border rounded-lg"
//           >
//             {["new", "sale", "discounted", "featured", "bestseller", "trending"].map(
//               (s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               )
//             )}
//           </select>

//           {/* Extra Info */}
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               name="estimatedDays"
//               value={formData.estimatedDays}
//               onChange={handleInputChange}
//               placeholder="Estimated Delivery Days"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="returnPolicy"
//               value={formData.returnPolicy}
//               onChange={handleInputChange}
//               placeholder="Return Policy"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="Material"
//               value={formData.Material}
//               onChange={handleInputChange}
//               placeholder="Material"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="Dimensions"
//               value={formData.Dimensions}
//               onChange={handleInputChange}
//               placeholder="Dimensions"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="Weight"
//               value={formData.Weight}
//               onChange={handleInputChange}
//               placeholder="Weight"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="Burn_Time"
//               value={formData.Burn_Time}
//               onChange={handleInputChange}
//               placeholder="Burn Time"
//               className="p-3 border rounded-lg"
//             />
//             <input
//               name="Scent"
//               value={formData.Scent}
//               onChange={handleInputChange}
//               placeholder="Scent"
//               className="p-3 border rounded-lg"
//             />
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block font-medium mb-2">Upload Images</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full p-2 border rounded-lg"
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//             >
//               {productToEdit ? "Update Product" : "Add Product"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;
