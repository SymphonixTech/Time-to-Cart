import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
    bestSellers: false,
    featured: false,
    status: "active",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        ...productToEdit,
        tags: Array.isArray(productToEdit.tags)
          ? productToEdit.tags.join(", ")
          : productToEdit.tags || "",
      });
      setExistingImages(productToEdit.images || []);
    } else {
      resetForm();
    }
  }, [productToEdit]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async (category: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/subcategories?category=${category}`
      );
      setSubcategories(res.data.subcategories || []);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

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
      bestSellers: false,
      featured: false,
      status: "active",
    });
    setFiles([]);
    setExistingImages([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "category") {
      fetchSubcategories(value);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDeleteImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setFiles(files.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value as string);
      });
      data.append("tags", formData.tags.split(",").map((tag) => tag.trim()).join(","));
      files.forEach((file) => data.append("images", file));
      existingImages.forEach((img) => data.append("existingImages", img));

      if (productToEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
          data,
          { withCredentials: true }
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, data, {
          withCredentials: true,
        });
        toast.success("Product added successfully");
      }

      onProductAdded();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Failed to save product");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {productToEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Description */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          {/* Price, Original Price */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original Price"
              value={formData.originalPrice}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border px-3 py-2 rounded w-full"
            />

            <div className="flex flex-wrap gap-3 mt-3">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt="product"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx, true)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {files.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx, false)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Misc fields */}
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="Material"
              placeholder="Material"
              value={formData.Material}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="Dimensions"
              placeholder="Dimensions"
              value={formData.Dimensions}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-3 gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="addToSliders"
                checked={formData.addToSliders}
                onChange={handleInputChange}
              />
              Add to Sliders
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="bestSellers"
                checked={formData.bestSellers}
                onChange={handleInputChange}
              />
              Best Sellers
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Featured
            </label>
          </div>

          {/* Status */}
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
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







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";

// interface ProductForm {
//   name: string;
//   description: string;
//   price: string;
//   originalPrice: string;
//   category: string;
//   subcategory: string;
//   inStock: boolean;
//   stockQuantity: string;
//   tags: string[];
//   deliveryInfo: {
//     freeDelivery: boolean;
//     estimatedDays: string;
//     returnPolicy: string;
//   };
//   specifications: {
//     Material: string;
//     Dimensions: string;
//     Weight: string;
//     Burn_Time: string;
//     Scent: string;
//   };
//   featured: boolean;
//   bestSeller: boolean;
//   addToSliders: boolean;
//   addToTopCard: boolean;
//   status: string;
//   images: string[];
// }

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductSaved: () => void;
//   productToEdit?: any;
// }

// const CATEGORIES = ["Candles", "Religious Products", "Kids Stationery", "Gifts"];

// const SUBCATEGORY_MAP: Record<string, string[]> = {
//   Candles: [
//     "Scented Candles",
//     "Soy Wax",
//     "Decor Candles",
//     "Aromatherapy",
//     "Luxury Collection",
//     "Gift Sets",
//   ],
//   "Religious Products": [],
//   "Kids Stationery": [],
//   Gifts: [],
// };

// const STATUS_OPTIONS = ["new", "sale", "discounted", "featured", "bestseller", "trending"];

// const INITIAL_FORM: ProductForm = {
//   name: "",
//   description: "",
//   price: "",
//   originalPrice: "",
//   category: "",
//   subcategory: "",
//   inStock: true,
//   stockQuantity: "",
//   tags: [""],
//   deliveryInfo: {
//     freeDelivery: false,
//     estimatedDays: "",
//     returnPolicy: "",
//   },
//   specifications: {
//     Material: "",
//     Dimensions: "",
//     Weight: "",
//     Burn_Time: "",
//     Scent: "",
//   },
//   featured: false,
//   bestSeller: false,
//   addToSliders: false,
//   addToTopCard: false,
//   status: "new",
//   images: [],
// };

// const AddProductModal: React.FC<AddProductModalProps> = ({
//   isOpen,
//   onClose,
//   onProductSaved,
//   productToEdit,
// }) => {
//   const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
//   const [localImages, setLocalImages] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (productToEdit) {
//       setForm({
//         ...INITIAL_FORM,
//         ...productToEdit,
//         price: productToEdit.price?.toString() || "",
//         originalPrice: productToEdit.originalPrice?.toString() || "",
//         stockQuantity: productToEdit.stockQuantity?.toString() || "",
//         tags: productToEdit.tags && productToEdit.tags.length ? productToEdit.tags : [""],
//         deliveryInfo: {
//           freeDelivery: productToEdit.deliveryInfo?.freeDelivery ?? false,
//           estimatedDays: productToEdit.deliveryInfo?.estimatedDays?.toString() || "",
//           returnPolicy: productToEdit.deliveryInfo?.returnPolicy || "",
//         },
//         specifications: {
//           Material: productToEdit.specifications?.Material || "",
//           Dimensions: productToEdit.specifications?.Dimensions || "",
//           Weight: productToEdit.specifications?.Weight || "",
//           Burn_Time: productToEdit.specifications?.Burn_Time || "",
//           Scent: productToEdit.specifications?.Scent || "",
//         },
//         images: productToEdit.images || [],
//       });
//       setLocalImages([]);
//     } else {
//       setForm(INITIAL_FORM);
//       setLocalImages([]);
//     }
//   }, [productToEdit, isOpen]);

//   if (!isOpen) return null;

//   const handleRemoveExistingImage = (idx: number) => {
//     setForm((prev) => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== idx),
//     }));
//   };

//   const handleRemoveLocalImage = (idx: number) => {
//     setLocalImages((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     const total = localImages.length + form.images.length + selectedFiles.length;
//     if (total > 4) {
//       toast.error("You can upload up to 4 images total.");
//       return;
//     }
//     setLocalImages((prev) => [...prev, ...selectedFiles]);
//   };

//   const handleTagChange = (idx: number, value: string) => {
//     setForm((prev) => ({
//       ...prev,
//       tags: prev.tags.map((tag, i) => (i === idx ? value : tag)),
//     }));
//   };

//   const addTag = () => setForm((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
//   const removeTag = (idx: number) =>
//     setForm((prev) => ({
//       ...prev,
//       tags: prev.tags.length > 1 ? prev.tags.filter((_, i) => i !== idx) : [""],
//     }));

//   const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       deliveryInfo: {
//         ...prev.deliveryInfo,
//         [name]: type === "checkbox" ? checked : value,
//       },
//     }));
//   };

//   const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       specifications: {
//         ...prev.specifications,
//         [name]: value,
//       },
//     }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = new FormData();
//       data.append("name", form.name);
//       data.append("description", form.description);
//       data.append("price", form.price);
//       data.append("originalPrice", form.originalPrice);
//       data.append("category", form.category);
//       data.append("subcategory", form.subcategory);
//       data.append("inStock", String(form.inStock));
//       data.append("stockQuantity", form.stockQuantity);
//       data.append("featured", String(form.featured));
//       data.append("bestSeller", String(form.bestSeller));
//       data.append("addToSliders", String(form.addToSliders));
//       data.append("addToTopCard", String(form.addToTopCard));
//       data.append("status", form.status);

//       form.images.forEach((url) => data.append("images", url));
//       localImages.forEach((file) => data.append("images", file));
//       form.tags.forEach((tag) => data.append("tags", tag));
//       data.append("deliveryInfo", JSON.stringify(form.deliveryInfo));
//       data.append("specifications", JSON.stringify(form.specifications));

//       if (productToEdit) {
//         await axios.put(
//           `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
//           data,
//           { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//         );
//         toast.success("Product updated successfully!");
//       } else {
//         await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         });
//         toast.success("Product added successfully!");
//       }

//       onProductSaved();
//       onClose();
//       setForm(INITIAL_FORM);
//       setLocalImages([]);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error while saving product!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center overflow-y-auto">
//       <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 p-8 my-8 relative">
//         {/* Close button */}
//         {/* <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-600 hover:text-black"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button> */}

//         {/* <button
//           onClick={onClose}
//           className="absolute top-2 right-3 text-3xl font-bold text-gray-700 hover:text-gray-900 z-10"
//           aria-label="Close"
//         >
//           &times;
//         </button> */}

//         <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
//           {productToEdit ? "Edit Product" : "Add Product"}
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Basic Fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <label>
//               <span className="text-sm font-medium text-gray-700">Product Name</span>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter product name"
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 required
//               />
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Price</span>
//               <input
//                 name="price"
//                 value={form.price}
//                 onChange={handleChange}
//                 placeholder="Price"
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 type="number"
//                 min="0"
//                 required
//               />
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Original Price</span>
//               <input
//                 name="originalPrice"
//                 value={form.originalPrice}
//                 onChange={handleChange}
//                 placeholder="Original Price"
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 type="number"
//                 min="0"
//               />
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Category</span>
//               <select
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 {CATEGORIES.map((c) => (
//                   <option key={c} value={c}>
//                     {c}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Subcategory</span>
//               <select
//                 name="subcategory"
//                 value={form.subcategory}
//                 onChange={handleChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 disabled={!SUBCATEGORY_MAP[form.category]?.length}
//               >
//                 <option value="">Select Subcategory</option>
//                 {SUBCATEGORY_MAP[form.category]?.map((sub) => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Status</span>
//               <select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//               >
//                 {STATUS_OPTIONS.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>

//           {/* Description */}
//           <label className="block">
//             <span className="text-sm font-medium text-gray-700">Description</span>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               placeholder="Product description"
//               className="border border-gray-300 rounded-lg w-full p-2 mt-1 h-24"
//               required
//             />
//           </label>

//           {/* Checkboxes */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 name="freeDelivery"
//                 checked={form.deliveryInfo.freeDelivery}
//                 onChange={handleDeliveryChange}
//               />
//               Free Delivery
//             </label>
//             {["inStock", "addToSliders", "addToTopCard", "bestSeller", "featured"].map(
//               (field) => (
//                 <label key={field} className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     name={field}
//                     checked={(form as any)[field]}
//                     onChange={handleChange}
//                   />
//                   {field}
//                 </label>
//               )
//             )}
//           </div>

//           {/* Inventory */}
//           <div className="grid grid-cols-2 gap-4">
//             <label>
//               <span className="text-sm font-medium text-gray-700">Stock Quantity</span>
//               <input
//                 type="number"
//                 name="stockQuantity"
//                 placeholder="Stock Quantity"
//                 value={form.stockQuantity}
//                 onChange={handleChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 min="0"
//               />
//             </label>
//           </div>

//           {/* Delivery Info */}
//           <div className="grid grid-cols-2 gap-4">
//             <label>
//               <span className="text-sm font-medium text-gray-700">
//                 Estimated Delivery Days
//               </span>
//               <input
//                 type="number"
//                 name="estimatedDays"
//                 value={form.deliveryInfo.estimatedDays}
//                 onChange={handleDeliveryChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 min="1"
//               />
//             </label>
//             <label>
//               <span className="text-sm font-medium text-gray-700">Return Policy</span>
//               <input
//                 name="returnPolicy"
//                 placeholder="Return Policy"
//                 value={form.deliveryInfo.returnPolicy}
//                 onChange={handleDeliveryChange}
//                 className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//               />
//             </label>
//           </div>

//           {/* Specifications */}
//           <div className="grid grid-cols-3 gap-3">
//             {["Material", "Dimensions", "Weight", "Burn_Time", "Scent"].map((field) => (
//               <label key={field}>
//                 <span className="text-sm font-medium text-gray-700">{field}</span>
//                 <input
//                   name={field}
//                   value={(form.specifications as any)[field]}
//                   onChange={handleSpecChange}
//                   placeholder={field}
//                   className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
//                 />
//               </label>
//             ))}
//           </div>

//           {/* Images */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Product Images (Max 4)
//             </label>
//             <div className="flex flex-wrap gap-3 mb-2">
//               {form.images.map((img, idx) => (
//                 <div key={`exist-${idx}`} className="relative group">
//                   <img
//                     src={img}
//                     alt={`Existing ${idx + 1}`}
//                     className="w-24 h-24 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveExistingImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
//                   >
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               {localImages.map((file, idx) => (
//                 <div key={`local-${idx}`} className="relative group">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt={`NewUpload${idx + 1}`}
//                     className="w-24 h-24 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveLocalImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
//                   >
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               {(form.images.length + localImages.length) < 4 && (
//                 <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100">
//                   <PhotoIcon className="w-8 h-8 text-gray-500 mb-1" />
//                   <span className="text-xs text-gray-500">Upload</span>
//                   <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                 </label>
//               )}
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Product Tags
//             </label>
//             {form.tags.map((tag, idx) => (
//               <div key={idx} className="flex items-center gap-2 mb-2">
//                 <input
//                   type="text"
//                   value={tag}
//                   onChange={(e) => handleTagChange(idx, e.target.value)}
//                   placeholder={`Tag ${idx + 1}`}
//                   className="input border border-gray-300 rounded-lg p-2 flex-1"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeTag(idx)}
//                   className="bg-red-500 text-white rounded-full px-2 py-0.5"
//                   disabled={form.tags.length === 1}
//                 >
//                   −
//                 </button>
//                 {idx === form.tags.length - 1 && (
//                   <button
//                     type="button"
//                     onClick={addTag}
//                     className="bg-green-500 text-white rounded-full px-2 py-0.5"
//                   >
//                     +
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
//           >
//             {loading ? "Saving..." : productToEdit ? "Update Product" : "Add Product"}
//           </button>
//           <div className="flex justify-end mt-6">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//             >
//               Close
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;






// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";

// interface ProductForm {
//   name: string;
//   description: string;
//   price: string;
//   originalPrice: string;
//   category: string;
//   subcategory: string;
//   inStock: boolean;
//   stockQuantity: string;
//   sales: string;
//   tags: string[];
//   rating: string;
//   deliveryInfo: {
//     freeDelivery: boolean;
//     estimatedDays: string;
//     returnPolicy: string;
//   };
//   specifications: {
//     Material: string;
//     Dimensions: string;
//     Weight: string;
//     Burn_Time: string;
//     Scent: string;
//   };
//   featured: boolean;
//   bestSeller: boolean;
//   addToSliders: boolean;
//   addToTopCard: boolean;
//   status: string;
//   images: string[]; // URLs of existing images (when editing)
// }

// interface AddProductModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onProductSaved: () => void;
//   productToEdit?: any; // product object for edit, undefined for add
// }

// const CATEGORIES = [
//   "Candles",
//   "Religious Products",
//   "Kids Stationery",
//   "Gifts",
// ];

// const SUBCATEGORY_MAP: Record<string, string[]> = {
//   Candles: [
//     "Scented Candles",
//     "Soy Wax",
//     "Decor Candles",
//     "Aromatherapy",
//     "Luxury Collection",
//     "Gift Sets",
//   ],
//   "Religious Products": [],
//   "Kids Stationery": [],
//   Gifts: [],
// };

// const STATUS_OPTIONS = [
//   "new",
//   "sale",
//   "discounted",
//   "featured",
//   "bestseller",
//   "trending",
// ];

// const INITIAL_FORM: ProductForm = {
//   name: "",
//   description: "",
//   price: "",
//   originalPrice: "",
//   category: "",
//   subcategory: "",
//   inStock: true,
//   stockQuantity: "",
//   sales: "",
//   tags: [""],
//   rating: "",
//   deliveryInfo: {
//     freeDelivery: false,
//     estimatedDays: "",
//     returnPolicy: "",
//   },
//   specifications: {
//     Material: "",
//     Dimensions: "",
//     Weight: "",
//     Burn_Time: "",
//     Scent: "",
//   },
//   featured: false,
//   bestSeller: false,
//   addToSliders: false,
//   addToTopCard: false,
//   status: "new",
//   images: [], // For URLs of existing images if editing
// };

// const AddProductModal: React.FC<AddProductModalProps> = ({
//   isOpen,
//   onClose,
//   onProductSaved,
//   productToEdit,
// }) => {
//   const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
//   const [localImages, setLocalImages] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (productToEdit) {
//       setForm({
//         ...INITIAL_FORM,
//         ...productToEdit,
//         price: productToEdit.price?.toString() || "",
//         originalPrice: productToEdit.originalPrice?.toString() || "",
//         stockQuantity: productToEdit.stockQuantity?.toString() || "",
//         sales: productToEdit.sales?.toString() || "",
//         rating: productToEdit.rating?.toString() || "",
//         tags: productToEdit.tags && productToEdit.tags.length ? productToEdit.tags : [""],
//         deliveryInfo: {
//           freeDelivery: productToEdit.deliveryInfo?.freeDelivery ?? false,
//           estimatedDays: productToEdit.deliveryInfo?.estimatedDays?.toString() || "",
//           returnPolicy: productToEdit.deliveryInfo?.returnPolicy || "",
//         },
//         specifications: {
//           Material: productToEdit.specifications?.Material || "",
//           Dimensions: productToEdit.specifications?.Dimensions || "",
//           Weight: productToEdit.specifications?.Weight || "",
//           Burn_Time: productToEdit.specifications?.Burn_Time || "",
//           Scent: productToEdit.specifications?.Scent || "",
//         },
//         images: productToEdit.images || [],
//       });
//       setLocalImages([]); // Clear local images on edit start
//     } else {
//       setForm(INITIAL_FORM);
//       setLocalImages([]);
//     }
//   }, [productToEdit, isOpen]);

//   if (!isOpen) return null;

//   // Helper: delete url-based (already uploaded) image
//   const handleRemoveExistingImage = (idx: number) => {
//     setForm(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== idx)
//     }));
//   };

//   // Helper: delete file-based (new) image
//   const handleRemoveLocalImage = (idx: number) => {
//     setLocalImages(prev => prev.filter((_, i) => i !== idx));
//   };

//   // Helper: local file change
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = Array.from(e.target.files || []);
//     const total = localImages.length + form.images.length + selectedFiles.length;
//     if (total > 4) {
//       toast.error("You can upload up to 4 images total.");
//       return;
//     }
//     setLocalImages(prev => [...prev, ...selectedFiles]);
//   };

//   // Tags management
//   const handleTagChange = (idx: number, value: string) => {
//     setForm(prev => ({
//       ...prev,
//       tags: prev.tags.map((tag, i) => (i === idx ? value : tag)),
//     }));
//   };
//   const addTag = () => setForm(prev => ({ ...prev, tags: [...prev.tags, ""] }));
//   const removeTag = (idx: number) => setForm(prev => ({
//     ...prev,
//     tags: prev.tags.length > 1 ? prev.tags.filter((_, i) => i !== idx) : [""],
//   }));

//   // Nested field handlers:
//   const handleDeliveryChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       deliveryInfo: {
//         ...prev.deliveryInfo,
//         [name]: type === "checkbox" ? checked : value,
//       }
//     }));
//   };

//   const handleSpecChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       specifications: {
//         ...prev.specifications,
//         [name]: value,
//       }
//     }));
//   };

//   // General field handler for non-nested fields:
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type, checked } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const data = new FormData();
//       // Flat fields
//       data.append("name", form.name);
//       data.append("description", form.description);
//       data.append("price", form.price);
//       data.append("originalPrice", form.originalPrice);
//       data.append("category", form.category);
//       data.append("subcategory", form.subcategory);
//       data.append("inStock", String(form.inStock));
//       data.append("stockQuantity", form.stockQuantity);
//       data.append("sales", form.sales);
//       data.append("featured", String(form.featured));
//       data.append("bestSeller", String(form.bestSeller));
//       data.append("addToSliders", String(form.addToSliders));
//       data.append("addToTopCard", String(form.addToTopCard));
//       data.append("status", form.status);
//       data.append("rating", form.rating);
//       // Images: always send current URLs; backend should keep as is unless changed
//       form.images.forEach(url => data.append("images", url));
//       // Images: also send any new files
//       localImages.forEach(file => data.append("images", file));
//       // Tags
//       form.tags.forEach(tag => data.append("tags", tag));
//       // Delivery info and specs as JSON
//       data.append("deliveryInfo", JSON.stringify(form.deliveryInfo));
//       data.append("specifications", JSON.stringify(form.specifications));

//       // Request
//       if (productToEdit) {
//         await axios.put(
//           `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
//           data,
//           { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//         );
//         toast.success("Product updated successfully!");
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_URL}/admin/products`,
//           data,
//           { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
//         );
//         toast.success("Product added successfully!");
//       }
//       onProductSaved();
//       onClose();
//       setForm(INITIAL_FORM);
//       setLocalImages([]);
//     } catch (err) {
//       console.error(err);
//       toast.error("Error while saving product!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Render
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
//       <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 my-8 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>
//         <h2 className="text-2xl font-bold mb-6 text-gray-900">
//           {productToEdit ? "Edit Product" : "Add Product"}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Basic */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <input name="name" value={form.name}
//               onChange={handleChange} placeholder="Product Name" className="input" required />
//             <input name="price" value={form.price}
//               onChange={handleChange} placeholder="Price" className="input" required type="number" min="0" />
//             <input name="originalPrice" value={form.originalPrice}
//               onChange={handleChange} placeholder="Original Price" className="input" type="number" min="0" />
//             <select name="category" value={form.category}
//               onChange={handleChange} className="input" required>
//               <option value="">Select Category</option>
//               {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
//             </select>
//             <select name="subcategory" value={form.subcategory}
//               onChange={handleChange} className="input"
//               disabled={!SUBCATEGORY_MAP[form.category]?.length}>
//               <option value="">Select Subcategory</option>
//               {SUBCATEGORY_MAP[form.category]?.map((sub) => (
//                 <option key={sub} value={sub}>{sub}</option>
//               ))}
//             </select>
//             <select name="status" value={form.status} onChange={handleChange} className="input">
//               {STATUS_OPTIONS.map((s) => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//           <textarea name="description"
//             value={form.description}
//             onChange={handleChange}
//             placeholder="Description"
//             className="input h-24"
//             required />

//           {/* Boolean Switches */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" name="freeDelivery"
//                 checked={form.deliveryInfo.freeDelivery}
//                 onChange={handleDeliveryChange} />
//               Free Delivery
//             </label>
//             {["inStock", "addToSliders", "addToTopCard", "bestSeller", "featured"].map((field) => (
//               <label key={field} className="flex items-center gap-2 text-sm">
//                 <input type="checkbox" name={field}
//                   checked={(form as any)[field]} onChange={handleChange} />
//                 {field}
//               </label>
//             ))}
//           </div>

//           {/* Inventory */}
//           <div className="grid grid-cols-2 gap-4">
//             <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={form.stockQuantity}
//               onChange={handleChange} className="input" min="0" />
//             <input type="number" name="sales" placeholder="Sales" value={form.sales}
//               onChange={handleChange} className="input" min="0" />
//           </div>

//           {/* Rating */}
//           <input type="number" name="rating" placeholder="Rating" value={form.rating}
//             onChange={handleChange} className="input" min="0" max="5" step="0.1" />

//           {/* Delivery Info */}
//           <div className="grid grid-cols-2 gap-4">
//             <input type="number" name="estimatedDays" placeholder="Estimated Delivery Days"
//               value={form.deliveryInfo.estimatedDays}
//               onChange={handleDeliveryChange} className="input" min="1" />
//             <input name="returnPolicy" placeholder="Return Policy"
//               value={form.deliveryInfo.returnPolicy}
//               onChange={handleDeliveryChange} className="input" />
//           </div>

//           {/* Specifications */}
//           <div className="grid grid-cols-3 gap-3">
//             {["Material", "Dimensions", "Weight", "Burn_Time", "Scent"].map(field => (
//               <input key={field} name={field}
//                 value={(form.specifications as any)[field]}
//                 onChange={handleSpecChange} placeholder={field}
//                 className="input" />
//             ))}
//           </div>

//           {/* Images (Uploaded & New) */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 4)</label>
//             <div className="flex flex-wrap gap-3 mb-2">
//               {/* Show existing image urls for edit */}
//               {form.images.map((img, idx) => (
//                 <div key={`exist-${idx}`} className="relative group">
//                   <img src={img} alt={`Existing ${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
//                   <button type="button"
//                     onClick={() => handleRemoveExistingImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10">
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               {/* Show local images being uploaded */}
//               {localImages.map((file, idx) => (
//                 <div key={`local-${idx}`} className="relative group">
//                   <img src={URL.createObjectURL(file)} alt={`NewUpload${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
//                   <button type="button"
//                     onClick={() => handleRemoveLocalImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10">
//                     <XMarkIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               {(form.images.length + localImages.length) < 4 && (
//                 <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100">
//                   <PhotoIcon className="w-8 h-8 text-gray-500 mb-1" />
//                   <span className="text-xs text-gray-500">Upload</span>
//                   <input type="file" multiple accept="image/*"
//                     onChange={handleFileChange} className="hidden" />
//                 </label>
//               )}
//             </div>
//           </div>

//           {/* Tags */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
//             {form.tags.map((tag, idx) => (
//               <div key={idx} className="flex items-center gap-2 mb-2">
//                 <input type="text" value={tag} onChange={(e) => handleTagChange(idx, e.target.value)}
//                   placeholder={`Tag ${idx + 1}`} className="input flex-1" />
//                 <button type="button" onClick={() => removeTag(idx)}
//                   className="bg-red-500 text-white rounded-full px-2 py-0.5" disabled={form.tags.length === 1}>−</button>
//                 {idx === (form.tags.length - 1) && (
//                   <button type="button" onClick={addTag}
//                     className="bg-green-500 text-white rounded-full px-2 py-0.5">+</button>
//                 )}
//               </div>
//             ))}
//           </div>

//           <button type="submit"
//             disabled={loading}
//             className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
//             {loading ? "Saving..." : productToEdit ? "Update Product" : "Add Product"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;








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
