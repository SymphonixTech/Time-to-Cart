import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI;

const mockDatabase = {
  products: [],
  users: [],
  orders: []
};

export const connectDB = async () => {
  console.log("Connected to mock database");
  return true;
};

export const getProducts = async () => {
  return mockDatabase.products;
};

export const addProduct = async (product) => {
  const newProduct = { ...product, id: Date.now().toString() };
  mockDatabase.products.push(newProduct);
  return newProduct;
};

export const getUsers = async () => {
  return mockDatabase.users;
};

export const addUser = async (user) => {
  const newUser = { ...user, id: Date.now().toString() };
  mockDatabase.users.push(newUser);
  return newUser;
};

const connectToDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { connectToDatabase };

export default {
  connectDB,
  getProducts,
  addProduct,
  getUsers,
  addUser
};






// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// const MONGO_URI = process.env.MONGODB_URI;

// console.log(MONGO_URI);
// console.log("CWD:", process.cwd());

// // Mock MongoDB service for development
// const mockDatabase = {
//   products: [],
//   users: [],
//   orders: []
// };

// export const connectDB = async () => {
//   console.log('Connected to mock database');
//   return true;
// };

// export const getProducts = async () => {
//   return mockDatabase.products;
// };

// export const addProduct = async (product) => {
//   const newProduct = { ...product, id: Date.now().toString() };
//   mockDatabase.products.push(newProduct);
//   return newProduct;
// };

// export const getUsers = async () => {
//   return mockDatabase.users;
// };

// export const addUser = async (user) => {
//   const newUser = { ...user, id: Date.now().toString() };
//   mockDatabase.users.push(newUser);
//   return newUser;
// };

// const connectToDatabase = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(MONGO_URI);
//     console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//   }
//   catch(error) {
//     console.log(error);
//     process.exit(1);
//   }
// };

// export { connectToDatabase };

// export default {
//   connectDB,
//   getProducts,
//   addProduct,
//   getUsers,
//   addUser
// };
