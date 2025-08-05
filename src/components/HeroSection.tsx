import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { getFeaturedArticles } = useArticles();
  const featuredArticles = getFeaturedArticles().slice(0, 3);
  useEffect(() => {
    if (featuredArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [featuredArticles.length]);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  }; 
  const nextsSLi
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };
  if (featuredArticles.length === 0) {
    return (
      <section className="relative h-[70vh] overflow-hidden bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Welcome to Federals<span className="text-red-600">.live</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your authoritative source for breaking news and political analysis
          </p>
          <Link
            to="/admin"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Your First Article
          </Link>
        </div>
      </section>
    );
  }

  const currentArticle = featuredArticles[currentSlide];

  return (
    <section className="relative h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        {featuredArticles.map((article, index) => (
          <div
            key={article.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
          </div>
        ))}
      </div>
      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 pb-16 w-full">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold uppercase">
                {currentArticle.category}
              </span>
              <div className="flex items-center space-x-4 text-gray-300 text-sm">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{currentArticle.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{currentArticle.readTime}</span>
                </div>
                <span>{new Date(currentArticle.publishDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {currentArticle.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {currentArticle.summary}
            </p>
            
            <Link
              to={`/article/${currentArticle.slug}`}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Read Full Story
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredArticles.length > 1 && (
        <>
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-red-600' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;
