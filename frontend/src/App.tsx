import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/shared';
import { 
  HomePage, 
  ShopPage, 
  HowItWorksPage, 
  SupportPage, 
  AboutPage, 
  LoginPage,
  RegisterPage,
  ProductDetailPage,
  OrdersPage,
  UserDashboardPage,
} from './pages';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
