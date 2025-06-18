import { useEffect, useRef } from 'react';
import styles from './BannerCarousel.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function BannerCarousel({ images = [] }) { 
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    const totalItems = images.length;

    // Đảm bảo các ref tồn tại trước khi thao tác DOM
    if (!track || !container || totalItems === 0) {
        return; 
    }

    const updateCarousel = () => {
      const width = container.offsetWidth;
      track.style.transform = `translateX(-${indexRef.current * width}px)`;
    };

    const startAutoSlide = () => {
      stopAutoSlide(); 
      intervalRef.current = setInterval(() => {
        indexRef.current = (indexRef.current + 1) % totalItems;
        updateCarousel();
      }, 3000); 
    };

    const stopAutoSlide = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null; 
      }
    };

    // Event listeners
    window.addEventListener('resize', updateCarousel);
    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);

    // Khởi tạo
    updateCarousel();
    startAutoSlide();

    return () => {
      window.removeEventListener('resize', updateCarousel);
      if (container) { 
          container.removeEventListener('mouseenter', stopAutoSlide);
          container.removeEventListener('mouseleave', startAutoSlide);
      }
      stopAutoSlide();
    };
  }, [images]); 

  return (
    <div className={cx('banner-container')} ref={containerRef}>
      <div className={cx('carousel-track')} ref={trackRef}>
        {images.map((imgSrc, index) => (
          <div key={index} className={cx('banner-item')}>
            <img className={cx('banner-img')} src={imgSrc} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;