import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Product1 } from './types';
import AdminLayout from './AdminLayout';
import AddProductModal from './AddProductModal';
import axios from 'axios';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product1[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product1 | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product1 | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to hold errors

  const productStatuses = ['new', 'sale', 'discounted', 'featured', 'bestseller', 'trending'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await axios.get(`${(import.meta as any).env.VITE_API_URL}/products`, { withCredentials: true });
      setProducts(res.data);
      toast.success('Products fetched successfully');
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${(import.meta as any).env.VITE_API_URL}/admin/products/${productId}`, { withCredentials: true });
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product1) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const res = await axios.put(`${(import.meta as any).env.VITE_API_URL}/admin/products/status/${productId}`, { status: newStatus }, { withCredentials: true });
      setProducts(products.map(p => p._id === productId ? res.data : p));
      toast.success('Product status updated successfully');
      setShowStatusModal(false);
      setEditingProduct(null);
      setSelectedProduct(null); // Clear selected product after update
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  // const handleAddProduct = async (productData: Omit<Product1, 'id' | 'createdAt'>) => {
  //   try {
  //     const res = await axios.post(`${(import.meta as any).env.VITE_API_URL}/admin/products`, productData, { withCredentials: true });
  //     toast.success('Product added successfully');
  //     setProducts([...products, res.data]);
  //     setEditingProduct(null);
  //     setShowAddModal(false);
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     setError('Failed to add product');
  //     toast.error('Failed to add product');
  //   }
  // };

  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.category.toLowerCase().includes(searchTerm.toLowerCase());

  //   // Ensure product.status exists before comparing
  //   const matchesStatus = filterStatus === 'all' || (product.status && product.status === filterStatus);
  //   return matchesSearch && matchesStatus;
  // });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Ensure product.status exists before comparing
      const matchesStatus = filterStatus === 'all' || (product.status && product.status === filterStatus);
      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, filterStatus]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-2">Manage your product catalog</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H5a1 1 0 110-2h5V4a1 1 0 011-1-1z" clipRule="evenodd" />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors w-full md:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011 1-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011 1-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011 1-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                Filters
              </button>
            </div>
          </div>

          <div className="mt-4">
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                {['all', ...productStatuses].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-gray-600">Loading Products...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry Fetching Products
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">
                        No products found. Add some products to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.images[0] || 'https://via.placeholder.com/150'} // Fallback image
                                alt={product.name || 'Product Image'}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name || 'Unnamed Product'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {product.description ? product.description.substring(0, 50) + (product.description.length > 50 ? '...' : '') : 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category || 'Uncategorized'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price.toFixed(2)}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-gray-500 line-through ml-2">
                              ₹{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.stockQuantity > 10
                              ? 'bg-green-100 text-green-800'
                              : product.stockQuantity > 0
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stockQuantity} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowStatusModal(true);
                            }}
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                              product.status === 'featured' ? 'bg-purple-100 text-purple-800' :
                              product.status === 'sale' ? 'bg-red-100 text-red-800' :
                              product.status === 'new' ? 'bg-blue-100 text-blue-800' :
                              product.status === 'bestseller' ? 'bg-yellow-100 text-yellow-800' :
                              product.status === 'trending' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {product.status || 'None'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => product._id ? handleDeleteProduct(product._id) : undefined}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showStatusModal && selectedProduct && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowStatusModal(false);
              setSelectedProduct(null);
            }}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Set Product Status</h3>
              <p className="text-gray-600 mb-4">
                Set status for "{selectedProduct.name}"
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {productStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedProduct._id ? selectedProduct._id : '', status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      selectedProduct.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    handleStatusChange(selectedProduct._id ? selectedProduct._id : '', ''); // Assuming empty string clears status
                    setShowStatusModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Status
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <AddProductModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onProductAdded={fetchProducts} // This should ideally handle updates too, or a separate handler is needed
          productToEdit={editingProduct}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
