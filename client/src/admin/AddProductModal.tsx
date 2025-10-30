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
  tags: string[];
  deliveryInfo: {
    freeDelivery: boolean;
    estimatedDays: string;
    returnPolicy: string;
  };
  specifications: {
    Material: string;
    Dimensions: string;
    Weight: string;
    Burn_Time: string;
    Scent: string;
  };
  featured: boolean;
  bestSeller: boolean;
  addToSliders: boolean;
  addToTopCard: boolean;
  addToTopCardLink: string;
  status: string;
  images: string[];
  slidersMainTitle: string;
  slidersSubTitle: string;
  slidersDescription: string;
  slidersDiscount: string;
  slidersButtonName: string;
  slidersLink: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded?: any;
  productToEdit?: any;
}

const CATEGORIES = ["Candles", "Religious Products", "Kids Stationery", "Gifts"];

const SUBCATEGORY_MAP: Record<string, string[]> = {
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
  "Gifts": [],
};

const STATUS_OPTIONS = ["new", "sale", "discounted", "featured", "bestseller", "trending"];

const INITIAL_FORM: ProductForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "",
  subcategory: "",
  inStock: true,
  stockQuantity: "",
  tags: [""],
  deliveryInfo: {
    freeDelivery: false,
    estimatedDays: "",
    returnPolicy: "",
  },
  specifications: {
    Material: "",
    Dimensions: "",
    Weight: "",
    Burn_Time: "",
    Scent: "",
  },
  featured: false,
  bestSeller: false,
  addToSliders: false,
  addToTopCard: false,
  addToTopCardLink: "",
  status: "new",
  images: [],
  slidersMainTitle: "",
  slidersSubTitle: "",
  slidersDescription: "",
  slidersDiscount: "",
  slidersButtonName: "",
  slidersLink: "",
};

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  productToEdit,
}) => {
  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setForm({
        ...INITIAL_FORM,
        ...productToEdit,
        price: productToEdit.price?.toString() || "",
        originalPrice: productToEdit.originalPrice?.toString() || "",
        stockQuantity: productToEdit.stockQuantity?.toString() || "",
        tags: productToEdit.tags && productToEdit.tags.length ? productToEdit.tags : [""],
        deliveryInfo: {
          freeDelivery: productToEdit.deliveryInfo?.freeDelivery ?? false,
          estimatedDays: productToEdit.deliveryInfo?.estimatedDays?.toString() || "",
          returnPolicy: productToEdit.deliveryInfo?.returnPolicy || "",
        },
        specifications: {
          Material: productToEdit.specifications?.Material || "",
          Dimensions: productToEdit.specifications?.Dimensions || "",
          Weight: productToEdit.specifications?.Weight || "",
          Burn_Time: productToEdit.specifications?.Burn_Time || "",
          Scent: productToEdit.specifications?.Scent || "",
        },
        images: productToEdit.images || [],
        addToTopCardLink: productToEdit.addToTopCardLink || "",
        slidersMainTitle: productToEdit.slidersMainTitle || "",
        slidersSubTitle: productToEdit.slidersSubTitle || "",
        slidersDescription: productToEdit.slidersDescription || "",
        slidersDiscount: productToEdit.slidersDiscount || "",
        slidersButtonName: productToEdit.slidersButtonName || "",
        slidersLink: productToEdit.slidersLink || "",
      });
      setLocalImages([]);
    } else {
      setForm(INITIAL_FORM);
      setLocalImages([]);
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRemoveExistingImage = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleRemoveLocalImage = (idx: number) => {
    setLocalImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const total = localImages.length + form.images.length + selectedFiles.length;
    if (total > 4) {
      toast.error("You can upload up to 4 images total.");
      return;
    }
    setLocalImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleTagChange = (idx: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.map((tag, i) => (i === idx ? value : tag)),
    }));
  };

  const addTag = () => setForm((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  const removeTag = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.length > 1 ? prev.tags.filter((_, i) => i !== idx) : [""],
    }));

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryInfo: {
        ...prev.deliveryInfo,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("originalPrice", form.originalPrice);
      data.append("category", form.category);
      data.append("subcategory", form.subcategory);
      data.append("inStock", String(form.inStock));
      data.append("stockQuantity", form.stockQuantity);
      data.append("featured", String(form.featured));
      data.append("bestSeller", String(form.bestSeller));
      data.append("addToSliders", String(form.addToSliders));
      data.append("addToTopCard", String(form.addToTopCard));
      data.append("status", form.status);
      data.append("slidersMainTitle", form.slidersMainTitle);
      data.append("slidersSubTitle", form.slidersSubTitle);
      data.append("slidersDescription", form.slidersDescription);
      data.append("slidersDiscount", form.slidersDiscount);
      data.append("slidersButtonName", form.slidersButtonName);
      data.append("slidersLink", form.slidersLink);
      data.append("addToTopCardLink", form.addToTopCardLink);

      form.images.forEach((url) => data.append("images", url));
      localImages.forEach((file) => data.append("images", file));
      form.tags.forEach((tag) => data.append("tags", tag));
      data.append("deliveryInfo", JSON.stringify(form.deliveryInfo));
      data.append("specifications", JSON.stringify(form.specifications));
      let res;
      if (productToEdit) {
        res = await axios.put(
          `${import.meta.env.VITE_API_URL}/admin/products/${productToEdit._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
        );
        toast.success("Product updated successfully!");
        onProductAdded((prev: any[]) =>
          prev.map((p) => (p._id === res.data._id ? res.data : p))
        );
      } else {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/products`, data, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        toast.success("Product added successfully!");
        onProductAdded((prev: any[]) => [...prev, res.data]);
      }
      onClose();
      setForm(INITIAL_FORM);
      setLocalImages([]);
    } catch (err) {
      console.error(err);
      toast.error("Error while saving product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 p-8 my-8 relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
          {productToEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ----- All your form fields stay the same ----- */}

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className="text-sm font-medium text-gray-700">Product Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Price</span>
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                type="number"
                min="0"
                required
              />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Original Price</span>
              <input
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                placeholder="Original Price"
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                type="number"
                min="0"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Category</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                required
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Subcategory</span>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                disabled={!SUBCATEGORY_MAP[form.category]?.length}
              >
                <option value="">Select Subcategory</option>
                {SUBCATEGORY_MAP[form.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Description */}
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              className="border border-gray-300 rounded-lg w-full p-2 mt-1 h-24"
              required
            />
          </label>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="freeDelivery"
                checked={form.deliveryInfo.freeDelivery}
                onChange={handleDeliveryChange}
              />
              Free Delivery
            </label>
            {["inStock", "addToSliders", "addToTopCard", "bestSeller", "featured"].map(
              (field) => (
                <label key={field} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={field}
                    checked={(form as any)[field]}
                    onChange={handleChange}
                  />
                  {field}
                </label>
              )
            )}
          </div>

          {form.addToTopCard && (
            <div className="mt-3">
              <label
                htmlFor="addToTopCardLink"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Top Card Link
              </label>
              <input
                type="text"
                id="addToTopCardLink"
                placeholder="Enter top card link"
                value={form.addToTopCardLink}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {form.addToSliders && (
            <div className="border border-gray-300 rounded-lg p-4 mt-4 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Slider Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  <span className="text-sm font-medium text-gray-700">Main Title</span>
                  <input
                    type="text"
                    name="slidersMainTitle"
                    value={form.slidersMainTitle}
                    onChange={handleChange}
                    placeholder="Enter main title"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1"
                  />
                </label>
                <label>
                  <span className="text-sm font-medium text-gray-700">Sub Title</span>
                  <input
                    type="text"
                    name="slidersSubTitle"
                    value={form.slidersSubTitle}
                    onChange={handleChange}
                    placeholder="Enter sub title"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700">Description</span>
                  <textarea
                    name="slidersDescription"
                    value={form.slidersDescription}
                    onChange={handleChange}
                    placeholder="Enter slider description"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1 h-20"
                  />
                </label>
                <label>
                  <span className="text-sm font-medium text-gray-700">Discount</span>
                  <input
                    type="text"
                    name="slidersDiscount"
                    value={form.slidersDiscount}
                    onChange={handleChange}
                    placeholder="e.g. 20% OFF"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1"
                  />
                </label>
                <label>
                  <span className="text-sm font-medium text-gray-700">Button Name</span>
                  <input
                    type="text"
                    name="slidersButtonName"
                    value={form.slidersButtonName}
                    onChange={handleChange}
                    placeholder="e.g. Shop Now"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1"
                  />
                </label>
                <label className="sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700">Link</span>
                  <input
                    type="text"
                    name="slidersLink"
                    value={form.slidersLink}
                    onChange={handleChange}
                    placeholder="Enter link URL"
                    className="border border-gray-300 rounded-lg w-full p-2 mt-1"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Inventory */}
          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="text-sm font-medium text-gray-700">Stock Quantity</span>
              <input
                type="number"
                name="stockQuantity"
                placeholder="Stock Quantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                min="0"
              />
            </label>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-2 gap-4">
            <label>
              <span className="text-sm font-medium text-gray-700">
                Estimated Delivery Days
              </span>
              <input
                type="number"
                name="estimatedDays"
                value={form.deliveryInfo.estimatedDays}
                onChange={handleDeliveryChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                min="1"
              />
            </label>
            <label>
              <span className="text-sm font-medium text-gray-700">Return Policy</span>
              <input
                name="returnPolicy"
                placeholder="Return Policy"
                value={form.deliveryInfo.returnPolicy}
                onChange={handleDeliveryChange}
                className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
              />
            </label>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-3 gap-3">
            {["Material", "Dimensions", "Weight", "Burn_Time", "Scent"].map((field) => (
              <label key={field}>
                <span className="text-sm font-medium text-gray-700">{field}</span>
                <input
                  name={field}
                  value={(form.specifications as any)[field]}
                  onChange={handleSpecChange}
                  placeholder={field}
                  className="input border border-gray-300 rounded-lg w-full p-2 mt-1"
                />
              </label>
            ))}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images (Max 4)
            </label>
            <div className="flex flex-wrap gap-3 mb-2">
              {form.images.map((img, idx) => (
                <div key={`exist-${idx}`} className="relative group">
                  <img
                    src={img}
                    alt={`Existing ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {localImages.map((file, idx) => (
                <div key={`local-${idx}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`NewUpload${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLocalImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 z-10"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(form.images.length + localImages.length) < 4 && (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                  <PhotoIcon className="w-8 h-8 text-gray-500 mb-1" />
                  <span className="text-xs text-gray-500">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Tags
            </label>
            {form.tags.map((tag, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(idx, e.target.value)}
                  placeholder={`Tag ${idx + 1}`}
                  className="input border border-gray-300 rounded-lg p-2 flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeTag(idx)}
                  className="bg-red-500 text-white rounded-full px-2 py-0.5"
                  disabled={form.tags.length === 1}
                >
                  −
                </button>
                {idx === form.tags.length - 1 && (
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-green-500 text-white rounded-full px-2 py-0.5"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit and Close Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : productToEdit ? "Update Product" : "Add Product"}
          </button>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
