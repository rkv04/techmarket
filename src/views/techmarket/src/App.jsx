import './App.css';
import './pages/Home.jsx';
import Layout from './pages/Layout.jsx';
import BackgroundGrid from './components/BackgroundGrid.jsx';
import Home from './pages/Home.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Auth.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/products"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
