import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContentGenerator from './components/ContentGenerator';
import ArticlePreview from './components/ArticlePreview';
import Header from './components/Header';
import Footer from './components/Footer';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<ContentGenerator />} />
          <Route path="/preview/:id" element={<ArticlePreview />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;