import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ClockIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderId: '',
    files: [] as File[]
  });

  const handleFileChange = (e: any) => {
    const selectedFiles: File[] = Array.from(e.target.files);
    const totalFiles = uploadedImages.length + selectedFiles.length;
    if (totalFiles > 5) {
      alert('You can upload up to 5 images only.');
      return;
    }
    setUploadedImages(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('firstName', form.firstName);
    formData.append('lastName', form.lastName);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    formData.append('subject', form.subject);
    formData.append('message', form.message);
    formData.append('orderId', form.orderId);
    uploadedImages.forEach((file) => {
      formData.append('files', file);
    });
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/contact`, formData, { withCredentials: true });
      toast.success(res.data.message);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderId: '',
        files: [] as File[]
      });
      setUploadedImages([]);
    }
    catch (err) {
      toast.error(err.response.data.message);
    }
  }

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(event.target.files || []);
  //   const totalImages = uploadedImages.length + files.length;

  //   if (totalImages > 5) {
  //     alert('You can upload maximum 5 images');
  //     return;
  //   }

  //   setUploadedImages(prev => [...prev, ...files]);
  // };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you. Contact us for any queries, custom orders,
            or just to say hello!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <PhoneIcon className="w-6 h-6 text-orange-500 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+91 8015324928</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp</p>
                    <p className="text-gray-600">+91 8015324928</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <EnvelopeIcon className="w-6 h-6 text-blue-500 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">info@mirajcandles.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPinIcon className="w-6 h-6 text-red-500 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">
                      No: 524/B, Ramanujar Nagar<br />
                      Melpapanapattu, Neyveli-2<br />
                      Vridhachalam (Tk), Cuddalore (Dt)<br />
                      Pincode: 607802, TamilNadu, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <ClockIcon className="w-6 h-6 text-purple-500 mr-4" />
                  <div>
                    <p className="font-semibold text-gray-900">Business Hours</p>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:30 AM - 6:00 PM<br />
                      Sunday: 9:30 AM - 1:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/mirajcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com/mirajcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 .395C7.163.395.004 7.554.004 16.395c0 2.885.756 5.72 2.188 8.197L0 32l7.668-2.147a15.916 15.916 0 008.332 2.348h.001c8.837 0 16-7.163 16-16.001 0-8.84-7.163-16-16-16zm0 29.2a13.18 13.18 0 01-6.72-1.844l-.48-.285-4.55 1.272 1.214-4.675-.312-.48a13.13 13.13 0 01-2.031-7.077c0-7.262 5.905-13.167 13.167-13.167 3.517 0 6.826 1.37 9.307 3.852a13.086 13.086 0 013.86 9.315c0 7.262-5.905 13.167-13.167 13.167zm7.262-9.843c-.398-.199-2.356-1.162-2.724-1.294-.367-.137-.635-.199-.9.199-.267.398-1.033 1.294-1.268 1.562-.233.267-.467.3-.865.1-.398-.199-1.682-.62-3.2-1.977-1.182-1.053-1.98-2.351-2.213-2.749-.232-.398-.025-.612.175-.81.178-.176.398-.457.6-.686.2-.229.266-.382.398-.635.133-.254.067-.477-.033-.676-.1-.199-.9-2.168-1.233-2.963-.324-.777-.655-.673-.9-.686-.233-.012-.5-.014-.767-.014s-.7.1-1.067.477c-.367.398-1.4 1.367-1.4 3.334 0 1.967 1.433 3.872 1.633 4.14.2.267 2.82 4.306 6.84 6.035.956.412 1.7.658 2.28.844.957.305 1.828.262 2.516.159.767-.114 2.356-.962 2.688-1.892.332-.93.332-1.724.232-1.892-.1-.169-.366-.267-.764-.466z" />
                  </svg>
                </a>

                <a
                  href="https://youtube.com/mirajcandles"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your first name"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Your last name"
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="mention your reason (return/ damaged/ any other) like this..."
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Tell us more about your inquiry..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Id
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your order id"
                  value={form.orderId}
                  onChange={e => setForm({ ...form, orderId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Min: 1, Max: 5)
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <PhotoIcon className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB each)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploadedImages.length >= 5}
                      />
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                            {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    {uploadedImages.length}/5 images uploaded
                    {uploadedImages.length === 0 && <span className="text-red-500"> (At least 1 image required)</span>}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploadedImages.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${uploadedImages.length === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
