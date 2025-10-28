import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/mongodb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { verifyAdmin, verifyToken } from './middleware/auth.js';
import { toDataURL } from 'qrcode';
import { sendEmail } from './lib/mail.js';
import multer from 'multer';
import uploadToCloudinary, { deleteFromCloudinary } from './lib/uploadCloudinary.js';
import Order from './models/Order.js';

const upload = multer({ storage: multer.memoryStorage() });

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", process.env.FRONTEND_URL, "https:"],
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(mongoSanitize());
app.use(xss());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send("Hello from backend!");
});

app.post('/api/admin/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if(
            [name, email, password].some((field) => field?.trim() === "")
        ) {
            throw new Error("All fields are required");
        }
        const existedUser = await User.findOne({
            $or: [ { name }, { email } ]
        });
        if(existedUser) {
            throw new Error("user already exists");
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            // address: { street, city, state, zipCode },
            isVerified: true,
            role: 'admin'
        });
        const createdUser = await User.findById(user._id).select("-password");
        return res.status(201).json({
            message: 'User created successfully, verify your email',
            success: true,
            user: createdUser,
        });
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
})

app.post('/api/admin/login', async (req, res) => {
  try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        if(user.role !== "admin") return res.status(400).json({error: "Invalid credentials"});
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(404).json({error: "Invalid password"});
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        };
        return res.status(200).cookie('admin', token, options).json({user, message: "User logged in successfully"});
    }
    catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

app.get('/api/admin/logout', async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        };
        return res.status(200).clearCookie('admin', options).json({message: 'User logged out successfully'});
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
})

app.get('/api/admin/isLoggedin', async (req, res) => {
    try {
        const token = req.cookies.admin;
        if(!token) return res.status(400).json({error: 'User not logged in'});
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.status(200).json({ user });
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
});

app.put('/api/admin/update-profile', verifyAdmin, async (req, res) => {
  try {
    const { email, name } = req.body;
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ error: 'User not found' });
    user.email = email || user.email;
    user.name = name || user.name;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/change-password', verifyAdmin, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if(!user) return res.status(400).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if(!validPassword) return res.status(400).json({ error: 'Invalid old password' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.lastUpdate = Date.now();
    await user.save();
    await sendEmail({ email: user.email , emailType: 'PASSWORD CHANGED', userId: user._id});
    res.status(200).json({ message: 'Password changed successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({
                error: "User does not exists"
            });
        }
        if(user.role !== "user") return res.status(400).json({error: "Invalid credentials"});
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(404).json({error: "Invalid password"});
        }
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
        };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        };
        return res.status(200).cookie('zxcsdasd', token, options).json({user: tokenData, message: "User logged in successfully"});
    }
    catch(error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

app.post('/api/register', async (req, res) => {
      try {
          const { email, name, password, phone, street, city, state, zipCode } = req.body;
          if(
              [name, email, password].some((field) => field?.trim() === "")
          ) {
              throw new Error("All fields are required");
          }

          const existedUser = await User.findOne({
              $or: [ { name }, { email } ]
          });

          if(existedUser) {
              throw new Error("user already exists");
          }
          const salt = await bcrypt.genSalt(12);
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await User.create({
              name,
              email,
              phone,
              password: hashedPassword,
              address: { street, city, state, zipCode },
              isVerified: false,
              lastUpdate: Date.now(),
              role: "user"
          });
          const createdUser = await User.findById(user._id).select("-password");
          await sendEmail({ email, emailType: 'VERIFY', userId: createdUser._id  });
          return res.status(201).json({
              message: 'User created successfully, verify your email',
              success: true,
              user: createdUser,
          });
      }
      catch(error) {
          return res.status(500).json({error: error.message});
      }
});

app.get('/api/logout', async (req, res) => {
  try {
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        };
        return res.status(200).clearCookie('zxcsdasd', options).json({message: 'User logged out successfully'});
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
})

app.get('/api/isLoggedin', async (req, res) => {
  try {
        const token = req.cookies.zxcsdasd;
        if(!token) return res.status(400).json({error: 'User not logged in'});
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        return res.status(200).json({ user });
    }
    catch(error) {
        return res.status(500).json({error: error.message});
    }
});

app.post('/api/forgot-password', async (req, res) => {
  try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({error: 'User not found'});
        await sendEmail({ email, emailType: 'RESET', userId: user._id });
        return res.status(200).json({message: 'Reset password email sent'});
    }
    catch(error) {
        return res.status(500).json(error.message);
    }
});

app.post('/api/reset-password', async (req, res) => {
  try {
          const { email, password, otp } = await req.body;
          const user = await User.findOne({ email });
          if(!user) return res.status(400).json({error: 'User not found'});
          if(otp === user.verifyOTP) {
              user.isVerified = true;
              user.verifyOTP = null;
              user.verifyOTPExpiry = null;
              user.verifyToken = null;
              user.verifyTokenExpiry = null;
              user.lastUpdate = Date.now();
              const salt = await bcrypt.genSalt(12);
              const hashedPassword = await bcrypt.hash(password, salt);
              user.password = hashedPassword;
              await user.save();
              await sendEmail({ email: user.email , emailType: 'PASSWORD CHANGED', userId: user._id});
              return res.status(200).json({message: 'Password reset successfully', user: user});
          }
          return res.status(400).json({message: 'Invalid OTP'});
      }
      catch(error) {
          return res.status(500).json(error.message);
      }
});

app.post('/api/verify-email', async (req, res) => {
  try {
          const { email, otp } = req.body;
          const user = await User.findOne(
              { email, verifyOTP: otp, verifyOTPExpiry: { $gt: Date.now() }
          });
          if(!user) return res.status(400).json({error: 'User not found'});
          if(otp === user.verifyOTP) {
              user.isVerified = true,
              user.verifyOTP = null,
              user.verifyOTPExpiry = null,
              user.verifyToken = null,
              user.verifyTokenExpiry = null,
              await user.save();
              return res.status(200).json({message: 'Email verified successfully', user: user});
          }
          return res.status(200).json({message: 'Invalid OTP'});
      }
      catch(error) {
          return res.status(500).json(error.message);
      }
});

app.put('/api/update-profile', verifyToken, async (req, res) => {
  try {
    const { email, name, phone, street, city, state, zipCode, country, dateOfBirth, gender } = req.body;
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ error: 'User not found' });
    user.email = email || user.email;
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = {
      street: street || user.address.street,
      city: city || user.address.city,
      state: state || user.address.state,
      zipCode: zipCode || user.address.zipCode,
      country: country || user.address.country
    };
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/change-password', verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if(!user) return res.status(400).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if(!validPassword) return res.status(400).json({ error: 'Invalid old password' });
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.lastUpdate = Date.now();
    await user.save();
    await sendEmail({ email: user.email , emailType: 'PASSWORD CHANGED', userId: user._id});
    res.status(200).json({ message: 'Password changed successfully' });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/subscribe', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ error: 'User not found' });
    user.subscription = true;
    await user.save();
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-subscription', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if(!user) return res.status(400).json({ error: "User not found" });
    res.status(200).json({ subscription: user.subscription });
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
})

app.get('/api/contact', verifyAdmin, async (req, res) => {
  try {
    const { default: Contact } = await import('./models/Contact.js');
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contact', verifyToken, upload.array('files', 5), async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message, orderId } = req.body;
    if(!subject || !message || !orderId) return res.status(400).json({ message: 'Enter all details' });
    const { default: User } = await import('./models/User.js');
    const { default: Contact } = await import('./models/Contact.js');
    const user = await User.findById(req.user._id)
    if(!user) return res.status(404).json({ message: 'Login first' });
    const urls = await Promise.all(
      req.files.map(async (f) => {
        const buffer = f.buffer;
        return await uploadToCloudinary(buffer, 'contact');
      })
    );
    // "ORD-" + order._id.toString().slice(-6).toUpperCase()
    const { default: Order } = await import('./models/Order.js');
    let ord;
    const order = await Order.find();
    for(let i = 0; i < order.length; i++) {
      if("ORD-" + order[i]._id.toString().slice(-6).toUpperCase() === orderId && order[i].userId.toString() === req.user._id.toString()){
        ord = order[i]._id;
        break;
      }
    }
    if(!ord) return res.status(400).json({ message: 'Order not found' });
    const contact = new Contact({
      userId: req.user._id,
      firstName: firstName || user.name,
      lastName: lastName || user.name,
      email: email || user.email,
      phone: phone || user.phone,
      subject,
      message,
      orderId: ord
    });
    contact.images = urls.filter(Boolean);
    await contact.save();
    sendEmail({ email: user.email, emailType: 'QUERY', userId: req.user._id, message });
    const admin = await User.find({ role: "admin" });
    admin.forEach(async (a) => {
      await sendEmail({
        email: a.email,
        emailType: "NEW QUERY",
        userId: req.user._id,
        message
      });
    });
    res.status(200).json({ message: 'Your query reached us. We will respond you soon.' });
  }
  catch(error) {
    res.status(500).json({ message: error.message });
  }
})

app.post('/api/contact/read', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const { default: Contact } = await import('./models/Contact.js');
    const contact = await Contact.findById(id);
    if(!contact) return res.status(404).json({ message: 'Contact not found' });

    contact.read = true;
    await contact.save();
    res.status(200).json({ message: 'Contact marked as read' });
  }
  catch(error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/contact/response', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const { default: Contact } = await import('./models/Contact.js');
    const contact = await Contact.findById(id);
    if(!contact) return res.status(404).json({ message: 'Contact not found' });
    if(!contact.read) return res.status(400).json({ message: 'Contact not marked as read' });
    contact.response = true;
    await contact.save();
    res.status(200).json({ message: 'Contact marked as responded' });
  }
  catch(error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/contact/delete', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const { default: Contact } = await import('./models/Contact.js');
    const contact = await Contact.findById(id);
    if(!contact) return res.status(404).json({ message: 'Contact not found' });
    if(!contact.read || !contact.response) return res.status(400).json({ message: 'Contact not marked as read' });
    const imageIds = contact.images.map((url) => {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      const folderAndFile = parts.slice(uploadIndex + 1).join('/');
      const publicIdWithExtension = folderAndFile.split('/').slice(1).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      return publicId;
    });

    for (const id of imageIds) {
      await deleteFromCloudinary(id);
    }
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact deleted successfully' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query required" });
    }

    const { default: Product } = await import('./models/Product.js');
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { subcategory: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const { search, category, minPrice, maxPrice, sortBy } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let query = Product.find(filter).populate('reviews.userId');
    if (sortBy === 'price-low') query = query.sort({ price: 1 });
    else if (sortBy === 'price-high') query = query.sort({ price: -1 });
    else if (sortBy === 'name') query = query.sort({ name: 1 });
    else query = query.sort({ createdAt: -1 });
    const products = await query.exec();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findById(req.params.id).populate('reviews.userId');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
})

app.post('/api/admin/products', verifyAdmin, upload.array('images', 4), async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');

    // Allowed fields from client (sanitize)
    const allowed = [
      'name', 'description', 'price', 'originalPrice', 'category', 'subcategory',
      'inStock', 'stockQuantity', 'featured', 'addToSliders', 'addToTopCard',
      'bestSeller', 'status'
    ];

    // Basic required checks
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
      return res.status(400).json({ error: 'Missing required fields: name, description, price, category' });
    }

    // Parse tags: client may send multiple tags fields or a JSON/string
    let tags = [];
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      } else {
        try {
          tags = JSON.parse(req.body.tags);
          if (!Array.isArray(tags)) tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        } catch {
          // fallback to comma-separated
          tags = String(req.body.tags).split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    }

    // Parse deliveryInfo & specifications if passed as JSON string
    let deliveryInfo = {};
    if (req.body.deliveryInfo) {
      try { deliveryInfo = typeof req.body.deliveryInfo === 'string' ? JSON.parse(req.body.deliveryInfo) : req.body.deliveryInfo; } catch { deliveryInfo = {}; }
    } else {
      deliveryInfo = {
        freeDelivery: req.body.freeDelivery === 'true' || req.body.freeDelivery === true,
        estimatedDays: req.body.estimatedDays ? Number(req.body.estimatedDays) : undefined,
        returnPolicy: req.body.returnPolicy || undefined
      };
    }

    let specifications = {};
    if (req.body.specifications) {
      try { specifications = typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications; } catch { specifications = {}; }
    } else {
      specifications = {
        Material: req.body.Material || undefined,
        Dimensions: req.body.Dimensions || undefined,
        Weight: req.body.Weight || undefined,
        Burn_Time: req.body.Burn_Time || undefined,
        Scent: req.body.Scent || undefined
      };
    }

    // Upload files if present
    const uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      // upload each file buffer to cloudinary
      const urls = await Promise.all(req.files.map(async (f) => {
        const buffer = f.buffer;
        return await uploadToCloudinary(buffer, 'products'); // assumes returns URL string or null
      }));
      for (const u of urls) if (u) uploadedUrls.push(u);
    }

    // If no images at all, reject
    if (!uploadedUrls.length && (!req.body.images || (Array.isArray(req.body.images) && req.body.images.length === 0))) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    // If client submitted images as strings (rare for create), include them too
    let clientUrls = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) clientUrls = req.body.images.filter(Boolean);
      else clientUrls = [req.body.images].filter(Boolean);
    }

    const finalImages = [...clientUrls, ...uploadedUrls];

    // Build product object from allowed fields only
    const productPayload = {};
    allowed.forEach(k => {
      if (typeof req.body[k] !== 'undefined') {
        // convert booleans and numbers where needed
        if (k === 'inStock' || k === 'featured' || k === 'addToSliders' || k === 'addToTopCard' || k === 'bestSeller') {
          productPayload[k] = req.body[k] === 'true' || req.body[k] === true;
        } else if (k === 'price' || k === 'originalPrice' || k === 'stockQuantity') {
          productPayload[k] = req.body[k] !== '' ? Number(req.body[k]) : undefined;
        } else {
          productPayload[k] = req.body[k];
        }
      }
    });

    productPayload.images = finalImages;
    if (tags.length) productPayload.tags = tags;
    if (deliveryInfo) productPayload.deliveryInfo = deliveryInfo;
    if (specifications) productPayload.specifications = specifications;

    const product = new Product(productPayload);
    await product.save();

    // Notify subscribed users (keep your original logic)
    let getAllSubscribedUser = await User.find().select('-password');
    getAllSubscribedUser = getAllSubscribedUser.filter(user => user.subscription);
    await Promise.all(getAllSubscribedUser.map(async (user) => {
      await sendEmail({ email: user.email, emailType: 'NEW PRODUCT', userId: user._id, product });
    }));

    return res.status(201).json(product);
  } catch (error) {
    console.error('POST /admin/products error:', error);
    return res.status(400).json({ error: 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', verifyAdmin, upload.array('images', 4), async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // parse kept client image urls from req.body.images (strings)
    let keptUrls = [];
    if (req.body.images) {
      if (Array.isArray(req.body.images)) keptUrls = req.body.images.filter(Boolean);
      else {
        // sometimes when only one string is present multer gives string
        // could be JSON too - try parse
        try {
          const maybe = JSON.parse(req.body.images);
          if (Array.isArray(maybe)) keptUrls = maybe.filter(Boolean);
          else keptUrls = [String(req.body.images)];
        } catch {
          keptUrls = [String(req.body.images)];
        }
      }
    }

    // determine which existing product images were removed
    const previousImages = product.images || [];
    const removedImages = previousImages.filter(url => !keptUrls.includes(url));

    // delete removed images from cloudinary (use your helper)
    for (const imgUrl of removedImages) {
      try {
        // derive publicId same as your delete code (or call helper)
        const parts = imgUrl.split('/');
        const uploadIndex = parts.indexOf('upload');
        const folderAndFile = parts.slice(uploadIndex + 1).join('/');
        const publicIdWithExtension = folderAndFile.split('/').slice(1).join('/');
        const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
        if (publicId) await deleteFromCloudinary(publicId);
      } catch (err) {
        console.warn('Failed to delete old image from cloudinary:', err);
      }
    }

    // upload any new files
    const uploadedUrls = [];
    if (req.files && req.files.length > 0) {
      const urls = await Promise.all(req.files.map(async (f) => {
        const buffer = f.buffer;
        return await uploadToCloudinary(buffer, 'products');
      }));
      for (const u of urls) if (u) uploadedUrls.push(u);
    }

    // final images = keptUrls (from client) + newly uploaded
    const finalImages = [...(keptUrls || []), ...uploadedUrls];

    // sanitize allowed update fields
    const allowed = [
      'name', 'description', 'price', 'originalPrice', 'category', 'subcategory',
      'inStock', 'stockQuantity', 'featured', 'addToSliders', 'addToTopCard',
      'bestSeller', 'status'
    ];
    const updatePayload = {};
    allowed.forEach(k => {
      if (typeof req.body[k] !== 'undefined') {
        if (k === 'inStock' || k === 'featured' || k === 'addToSliders' || k === 'addToTopCard' || k === 'bestSeller') {
          updatePayload[k] = req.body[k] === 'true' || req.body[k] === true;
        } else if (k === 'price' || k === 'originalPrice' || k === 'stockQuantity') {
          updatePayload[k] = req.body[k] !== '' ? Number(req.body[k]) : undefined;
        } else {
          updatePayload[k] = req.body[k];
        }
      }
    });

    // parse tags
    let tags = undefined;
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) tags = req.body.tags;
      else {
        try {
          const parsed = JSON.parse(req.body.tags);
          tags = Array.isArray(parsed) ? parsed : String(req.body.tags).split(',').map(t => t.trim()).filter(Boolean);
        } catch {
          tags = String(req.body.tags).split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    }

    // parse deliveryInfo and specifications (JSON or fields)
    let deliveryInfo = product.deliveryInfo || {};
    if (req.body.deliveryInfo) {
      try { deliveryInfo = typeof req.body.deliveryInfo === 'string' ? JSON.parse(req.body.deliveryInfo) : req.body.deliveryInfo; } catch { /* noop */ }
    } else {
      // individual fields fallback
      if (typeof req.body.freeDelivery !== 'undefined' || req.body.estimatedDays || req.body.returnPolicy) {
        deliveryInfo = {
          freeDelivery: req.body.freeDelivery === 'true' || req.body.freeDelivery === true,
          estimatedDays: req.body.estimatedDays ? Number(req.body.estimatedDays) : deliveryInfo.estimatedDays,
          returnPolicy: req.body.returnPolicy || deliveryInfo.returnPolicy
        };
      }
    }

    let specifications = product.specifications || {};
    if (req.body.specifications) {
      try { specifications = typeof req.body.specifications === 'string' ? JSON.parse(req.body.specifications) : req.body.specifications; } catch { /* noop */ }
    } else {
      ['Material', 'Dimensions', 'Weight', 'Burn_Time', 'Scent'].forEach(key => {
        if (typeof req.body[key] !== 'undefined') specifications[key] = req.body[key];
      });
    }

    // apply updates
    Object.assign(product, updatePayload);
    if (typeof tags !== 'undefined') product.tags = tags;
    product.deliveryInfo = deliveryInfo;
    product.specifications = specifications;
    product.images = finalImages;

    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error('PUT /admin/products/:id error:', error);
    return res.status(400).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const imageIds = product.images.map((url) => {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      const folderAndFile = parts.slice(uploadIndex + 1).join('/');
      const publicIdWithExtension = folderAndFile.split('/').slice(1).join('/');
      const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
      return publicId;
    });

    for (const id of imageIds) {
      await deleteFromCloudinary(id);
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/cart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.status(200).json(user.cart); // frontend will use SET_CART
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// ------------------ ADD TO CART ------------------
app.post('/api/cart', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const populatedCart = await user.populate('cart.product');
    res.status(200).json(populatedCart.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// ------------------ UPDATE QUANTITY ------------------
app.put('/api/cart/:productId', verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cart.find(item => item.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not found in cart' });

    item.quantity = quantity;
    await user.save();
    const populatedCart = await user.populate('cart.product');
    res.status(200).json(populatedCart.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// ------------------ REMOVE FROM CART ------------------
app.delete('/api/cart/:productId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    const populatedCart = await user.populate('cart.product');
    res.status(200).json(populatedCart.cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

// ------------------ CLEAR CART ------------------
app.delete('/api/clear-cart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json(user.wishlist); // frontend SET_WISHLIST
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add to Wishlist (POST /api/wishlist)
app.post('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = await User.findById(req.user._id);
    const { productId } = req.body;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populatedUser = await user.populate('wishlist');
    res.status(200).json(populatedUser.wishlist); // returns updated wishlist
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove from Wishlist (DELETE /api/wishlist/:productId)
app.delete('/api/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(item => item.toString() !== req.params.productId);
    await user.save();

    const populatedUser = await user.populate('wishlist');
    res.status(200).json(populatedUser.wishlist); // returns updated wishlist
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

// Clear Wishlist (DELETE /api/clear-wishlist)
app.delete('/api/clear-wishlist', verifyToken, async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    res.status(200).json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear wishlist' });
  }
});

app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const orders = await Order.find({}).populate('items.productId').populate('userId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
    res.status(200).json(orders);
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
})

app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

app.put('/api/orders/:id/delivery', verifyAdmin, async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const { trackingLink, deliveryPhone } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { trackingLink, deliveryPhone },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  }
  catch (error) {
    res.status(400).json({ error: 'Failed to update delivery details' });
  }
});

app.get('/api/reviews/:productId', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const product = await Product.findById(req.params.productId).populate('reviews.userId');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product.reviews);
  }
  catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

app.post('/api/reviews/:productId', verifyToken, async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const { default: User } = await import('./models/User.js');
    const { default: Order } = await import('./models/Order.js');

    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const hasPurchased = await Order.exists({
      userId: userId,
      'items.productId': productId,
      status: { $in: ['delivered', 'shipped'] },
      paymentStatus: 'paid'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        error: 'You can only review products you have purchased and received.'
      });
    }

    const alreadyReviewed = product.reviews.some(
      (r) => r.userId._id.toString() === user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ error: 'You have already reviewed this product.' });
    }

    const nextId = product.reviews.length
      ? product.reviews[product.reviews.length - 1].id + 1
      : 1;

    const newReview = {
      id: nextId,
      userId: user._id,
      rating,
      comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);

    // --- Recalculate average rating ---
    const totalRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRatings / product.reviews.length;

    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const { default: Product } = await import('./models/Product.js');
    const categoryNames = ['Candles', 'Religious Products', 'Kids Stationery', 'Gifts'];

    const categories = {};

    await Promise.all(
      categoryNames.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat });
        categories[cat] = count;
      })
    );

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { default: User } = await import('./models/User.js');
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

app.post('/api/payment', verifyToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (paymentMethod !== 'UPI') {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }

    const upiId = process.env.UPI_ID;
    const name = process.env.PAYEE_NAME || "Miraj Candles";

    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR`;
    const qrImageUrl = await toDataURL(upiLink);

    res.status(200).json({
      success: true,
      qrCode: qrImageUrl,
      upiLink,
      upiId,
      name,
      totalAmount: amount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

app.post("/api/verify-upi-payment", verifyToken, async (req, res) => {
  try {
    const { amount, txnId, items, street, city, state, zipCode } = req.body;

    if (!txnId) {
      return res.status(400).json({ success: false, message: "Transaction ID is required" });
    }

    const { default: Order } = await import('./models/Order.js');

    const order = new Order({
      userId: req.user._id,
      totalAmount: amount,
      paymentMethod: "UPI",
      items,
      paymentStatus: "Payment Submitted",
      transactionId: txnId,
      status: "processing",
      date: Date.now(),
      shippingAddress: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        street: street || req.user.address.street,
        city: city || req.user.address.city,
        state: state || req.user.address.state,
        zipCode: zipCode || req.user.address.zipCode,
      },
    });

    await order.save();

    await sendEmail({
      email: req.user.email,
      emailType: "REQUEST",
      userId: req.user._id,
      orderId: order._id,
      orderTotal: order.totalAmount,
    });

    const admin = await User.find({ role: "admin" });
    admin.forEach(async (a) => {
      await sendEmail({
        email: a.email,
        emailType: "NEW ORDER",
        userId: req.user._id,
        orderId: order._id,
        orderTotal: order.totalAmount,
      });
    });

    res.json({ success: true, message: "Transaction ID received", orderId: order._id });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to verify payment" });
  }
});

app.put('/api/admin/verify-payment/:id', verifyAdmin, async (req, res) => {
  try {
    const { default: Order } = await import('./models/Order.js');
    const { default: Product } = await import('./models/Product.js');
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'shipped', paymentStatus: 'paid', trackingLink: req.body.trackingLink, deliveryPhone: req.body.deliveryPhone },
      { new: true }
    );
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (product && product.stockQuantity > 0) {
        product.stockQuantity = Math.max(product.stockQuantity - item.quantity, 0);
        product.sales = (product.sales || 0) + item.quantity;
        await product.save();
      }
    }
    const user = await User.findById(order.userId);
    await sendEmail({ email: user.email, emailType: 'CONFIRM', userId: order.userId, orderId: req.params.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

connectToDatabase().then(() => { console.log("MongoDB has connected successfully"); }).catch(err => { console.log("Error: ", err); });

export default app;
