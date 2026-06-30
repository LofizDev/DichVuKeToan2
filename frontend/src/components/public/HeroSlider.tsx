import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SliderItem } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeroSliderProps {
  sliders: SliderItem[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ sliders }) => {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [sliders]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  };

  if (!sliders || sliders.length === 0) return null;

  return (
    <div className="relative w-full h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden group">
      {/* Slides */}
      {sliders.map((slide, index) => {
        const altText = (lang === 'vi' ? slide.altText : slide.altTextZh) || slide.altText;

        return (
          <div
            key={slide._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={altText}
              className="w-full h-full object-cover md:object-fill"
              onError={(e) => {
                // fallback if copy failed
                (e.target as HTMLImageElement).src = '/assets/images/slider3.webp';
              }}
            />
            {slide.link && (
              <a href={slide.link} className="absolute inset-0 cursor-pointer" aria-label={altText} />
            )}
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Indicator Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default HeroSlider;
