import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import LoginPage from "@/pages/Login";

// Import Views
import AdminDashboard from "@/views/main/admin-dashboard/Dashboard";
import Chat from "@/views/chat";
import Products from "@/views/inventory/product";
import CreateProduct from "@/views/inventory/create-product";
import FirstCategoryCategory from "@/views/inventory/category/first-category";
import SecondCategoryCategory from "@/views/inventory/category/second-category";
import ThirdCategoryCategory from "@/views/inventory/category/third-category";
import MainCategoryCategory from "@/views/inventory/category/main-category";
import Orders from "@/views/orders";
import Admin from "@/views/people/admin";
import Users from "@/views/people/user";
import Vendors from "@/views/people/vendor";
import PageMeta from "@/views/seo";
import ContactMessage from "@/views/settings/contact/contact-message";
import ContactPageCms from "@/views/settings/contact/contact-page-cms";
import ExchangePolicy from "@/views/settings/policy/exchange-return";
import HeaderFooterCms from "@/views/settings/header-footer-cms";
import HeroSlider from "@/views/settings/home/hero-slider";
import HomePageCms from "@/views/settings/home/page-cms";
import PrivacyPolicy from "@/views/settings/policy/privacy";
import Promotions from "@/views/settings/home/promotion";
import ShopPageCms from "@/views/settings/shop-page-cms";
import SocialLinks from "@/views/settings/social-links";
import TermsConditions from "@/views/settings/policy/terms-condition";

// Public Pages
import AboutPageUI from "@/views/about-page/AboutPageUI";
import AppluPageUI from "@/views/apply-page/AppluPageUI";
import GalleryPageUI from "@/views/gellery-page/GalleryPageUI";
import RecruitPageUI from "@/views/recruit-page/RecruitPageUI";
import ServicesPageUI from "@/views/services-page/ServicesPageUI";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/about" element={<AboutPageUI />} />
        <Route path="/apply" element={<AppluPageUI />} />
        <Route path="/gallery" element={<GalleryPageUI />} />
        <Route path="/recruit" element={<RecruitPageUI />} />
        <Route path="/services" element={<ServicesPageUI />} />

        {/* Dashboard Layout Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/products" element={<Products />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/first-category" element={<FirstCategoryCategory />} />
          <Route path="/second-category" element={<SecondCategoryCategory />} />
          <Route path="/third-category" element={<ThirdCategoryCategory />} />
          <Route path="/main-category" element={<MainCategoryCategory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admins" element={<Admin />} />
          <Route path="/users" element={<Users />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/page-meta" element={<PageMeta />} />
          <Route path="/contact-message" element={<ContactMessage />} />
          <Route path="/contact-page-cms" element={<ContactPageCms />} />
          <Route path="/exchange-policy" element={<ExchangePolicy />} />
          <Route path="/header-footer-cms" element={<HeaderFooterCms />} />
          <Route path="/hero-slider" element={<HeroSlider />} />
          <Route path="/home-page-cms" element={<HomePageCms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/shop-page-cms" element={<ShopPageCms />} />
          <Route path="/social-link" element={<SocialLinks />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
