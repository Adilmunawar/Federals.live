import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import BreakingTicker from './components/BreakingTicker';
import AdminPanel from './components/AdminPanel';
import ArticleView from './components/ArticleView';
import AuthGuard from './components/AuthGuard';

function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <MainContent />
          <Sidebar />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Routes>
          {/* Admin Panel Route - Protected */}
          <Route path="/admin" element={
            <AuthGuard>
              <AdminPanel />
            </AuthGuard>
          } />
          
          {/* Article View Route */}
          <Route path="/article/:slug" element={
            <>
              <ArticleView />
              <Footer />
            </>
          } />
          
          {/* Main Site Routes */}
          <Route path="/*" element={
            <>
              <Header />
              <BreakingTicker />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<HomePage />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;