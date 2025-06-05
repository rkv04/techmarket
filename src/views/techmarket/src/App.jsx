import './App.css';
import Layout from './pages/Layout.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Auth.jsx';
import RegisterForm from './pages/Register.jsx';
import ForgotPasswordForm from './pages/forgotPassword.jsx';
import ResetPasswordForm from './pages/resetPssowrd.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/password-forgot" element={<ForgotPasswordForm />} />
        <Route path='/password-reset' element={<ResetPasswordForm />} />
        <Route
          path="/products"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;