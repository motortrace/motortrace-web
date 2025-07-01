// App.tsx
import './App.css';
import LandingPage from './Pages/LandingPage';
import LoginPage from './components/LoginPageComponents/Login';
import ProductPage from './Pages/ProductPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './Pages/CartPage/CartPage';
import StorePage from './Pages/StorePage/StorePage';
import RegisterPage from './components/RegisterComponent/Register';
import ProductCatalogue from './Pages/ProductCataloguePage';
import ProfilePage from './Pages/ProfilePages/ProfilePage';



function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/productCatalogue" element={<ProductCatalogue/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/store" element={<StorePage/>} />
          <Route path="/Register" element={<RegisterPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
    </Router>
  );
}

export default App;
