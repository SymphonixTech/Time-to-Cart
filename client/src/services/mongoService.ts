
import { sampleProducts } from '../lib/sampleData';

const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || '/api';

export class MongoService {
  // Products
  static async getProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('API not available, using sample data');
        // Transform sample products to include missing fields
        return sampleProducts.map((product, index) => ({
          ...product,
          id: (index + 1).toString(),
          createdAt: new Date(),
          status: 'featured'
        }));
      }
      return response.json();
    } catch (error) {
      console.log('API error, falling back to sample data:', error);
      // Transform sample products to include missing fields
      return sampleProducts.map((product, index) => ({
        ...product,
        id: (index + 1).toString(),
        createdAt: new Date(),
        status: 'featured'
      }));
    }
  }

  static async getProductById(productId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        }
      }
      // Fallback to sample data
      const sampleProduct = sampleProducts.find((p, index) => (index + 1).toString() === productId);
      if (sampleProduct) {
        return {
          ...sampleProduct,
          id: productId,
          createdAt: new Date(),
          status: 'featured'
        };
      }
      return null;
    } catch (error) {
      console.log('API error, searching sample data:', error);
      const sampleProduct = sampleProducts.find((p, index) => (index + 1).toString() === productId);
      if (sampleProduct) {
        return {
          ...sampleProduct,
          id: productId,
          createdAt: new Date(),
          status: 'featured'
        };
      }
      return null;
    }
  }

  static async createProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  }

  static async updateProduct(productId: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  }

  static async deleteProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Orders
  static async getOrders() {
    const response = await fetch(`${API_BASE_URL}/orders`);
    return response.json();
  }

  static async createOrder(orderData: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  }

  static async updateOrderStatus(orderId: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // Users
  static async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  }

  static async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  }
}
