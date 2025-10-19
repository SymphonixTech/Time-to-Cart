import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;







// import { Routes, Route, Navigate } from 'react-router-dom'
// import AdminLogin from './AdminLogin'
// import AdminLayout from './AdminLayout'
// import AdminDashboard from './AdminDashboard'
// import AdminProducts from './AdminProducts'
// import AdminOrders from './AdminOrders'
// import AdminSettings from './AdminSettings'
// import ProtectedRoute from './ProtectedRoute'

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<AdminLogin />} />
//       <Route path="/" element={
//         <ProtectedRoute>
//           <AdminLayout />
//         </ProtectedRoute>
//       }>
//         <Route index element={<Navigate to="/dashboard" replace />} />
//         <Route path="dashboard" element={<AdminDashboard />} />
//         <Route path="products" element={<AdminProducts />} />
//         <Route path="orders" element={<AdminOrders />} />
//         <Route path="settings" element={<AdminSettings />} />
//       </Route>
//     </Routes>
//   )
// }

// export default App
