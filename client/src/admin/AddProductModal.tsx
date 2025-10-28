import React, { useState, useEffect } from "react";
import axios from "axios";

const AddProductModal = ({ isOpen, onClose, product, onSave }) => {
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

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category || "",
        subcategory: product.subcategory || "",
        inStock: product.inStock ?? true,
        stockQuantity: product.stockQuantity || "",
        sales: product.sales || "",
        tags: product.tags?.join(", ") || "",
        estimatedDays: product.estimatedDays || "",
        freeDelivery: product.freeDelivery ?? false,
        returnPolicy: product.returnPolicy || "",
        Material: product.Material || "",
        Dimensions: product.Dimensions || "",
        Weight: product.Weight || "",
        Burn_Time: product.Burn_Time || "",
        Scent: product.Scent || "",
        addToSliders: product.addToSliders ?? false,
        bestSellers: product.bestSellers ?? false,
        featured: product.featured ?? false,
        status: product.status || "active",
      });
      setExistingImages(product.images || []);
    } else {
      resetForm();
    }
  }, [product]);

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
    setImages([]);
    setPreviewUrls([]);
    setExistingImages([]);
  };

  // Handle image upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const handleDeleteNewImage = (index: number) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previewUrls];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setPreviewUrls(updatedPreviews);
  };

  const handleDeleteExistingImage = (index: number) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        uploadFormData.append(key, formData[key as keyof typeof formData]);
      });
      uploadFormData.append("tags", formData.tags.split(",").map((tag) => tag.trim()));

      images.forEach((file) => {
        uploadFormData.append("images", file);
      });

      uploadFormData.append("existingImages", JSON.stringify(existingImages));

      let response;
      if (product) {
        // Edit product
        response = await axios.put(`/api/products/${product._id}`, uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add product
        response = await axios.post("/api/products", uploadFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSave(response.data);
      onClose();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full border rounded p-2" />

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="border rounded p-2" />
            <input type="number" name="originalPrice" placeholder="Original Price" value={formData.originalPrice} onChange={handleChange} className="border rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="subcategory" placeholder="Subcategory" value={formData.subcategory} onChange={handleChange} className="border rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="sales" placeholder="Sales" value={formData.sales} onChange={handleChange} className="border rounded p-2" />
          </div>

          <input type="text" name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="w-full border rounded p-2" />

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="estimatedDays" placeholder="Estimated Days" value={formData.estimatedDays} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="returnPolicy" placeholder="Return Policy" value={formData.returnPolicy} onChange={handleChange} className="border rounded p-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input type="text" name="Material" placeholder="Material" value={formData.Material} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="Dimensions" placeholder="Dimensions" value={formData.Dimensions} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="Weight" placeholder="Weight" value={formData.Weight} onChange={handleChange} className="border rounded p-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="Burn_Time" placeholder="Burn Time" value={formData.Burn_Time} onChange={handleChange} className="border rounded p-2" />
            <input type="text" name="Scent" placeholder="Scent" value={formData.Scent} onChange={handleChange} className="border rounded p-2" />
          </div>

          <div className="flex gap-4 flex-wrap">
            {["addToSliders", "bestSellers", "featured", "freeDelivery"].map((key) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} />
                {key}
              </label>
            ))}

            <label className="flex items-center gap-2">
              Status:
              <select name="status" value={formData.status} onChange={handleChange} className="border rounded p-1">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block mb-2 font-semibold">Product Images</label>
            <input type="file" multiple onChange={handleImageChange} />
            <div className="flex flex-wrap gap-3 mt-3">
              {existingImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="product" className="w-24 h-24 object-cover rounded-lg border" />
                  <button type="button" onClick={() => handleDeleteExistingImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                    ✕
                  </button>
                </div>
              ))}
              {previewUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                  <button type="button" onClick={() => handleDeleteNewImage(i)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-5 gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {uploading ? "Saving..." : product ? "Update Product" : "Add Product"}
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
