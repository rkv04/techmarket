import './App.css';
import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Auth.jsx';
import RegisterForm from './pages/Register.jsx';
import ForgotPasswordForm from './pages/forgotPassword.jsx';
import ResetPasswordForm from './pages/resetPssowrd.jsx';
import Kitchen from './pages/Kitchen.jsx';
import House from './pages/House.jsx';
import Beauty from './pages/Beauty.jsx';
import Health from './pages/Health.jsx';
import Discounts from './pages/Discounts.jsx';
import New from './pages/New.jsx';
import Admin from './pages/Admin.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/password-forgot" element={<ForgotPasswordForm />} />
        <Route path="/password-reset" element={<ResetPasswordForm />} />
        <Route path="/" element={<Layout />}>
          <Route path="products" element={<Home />} />
          <Route path="products/kitchen" element={<Kitchen />} />
          <Route path="products/house" element={<House />} />
          <Route path="products/beauty" element={<Beauty />} />
          <Route path="products/health" element={<Health />} />
          <Route path="products/discounts" element={<Discounts />} />
          <Route path="products/new" element={<New />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;