import { Link } from 'react-router-dom'
import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import images from '../../assets/images';
import { useState, useRef, useEffect } from 'react';
import {FaQuoteLeft} from 'react-icons/fa'
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel';
const cx = classNames.bind(styles);

function Home () {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);

  const target1 = 500;
  const target2 = 20;
  const target3 = 30;

  const statBox1Ref = useRef(null);
  const statBox2Ref = useRef(null);
  const statBox3Ref = useRef(null);

  const hasAnimated1 = useRef(false);
  const hasAnimated2 = useRef(false);
  const hasAnimated3 = useRef(false);

  const banners = [images.banner1, images.banner2, images.banner3]

  const animateCounter = (setCount, target, hasAnimatedRef, entry) => {
    if (entry.isIntersecting && !hasAnimatedRef.current) {
      let start = 0;
      const duration = 2000; 
      const increment = target / (duration / 10); 

      const timer = setInterval(() => {
        start += increment;
        if (start < target) {
          setCount(Math.ceil(start));
        } else {
          setCount(target);
          clearInterval(timer);
          hasAnimatedRef.current = true;
        }
      }, 10);
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.7, 
    };

    const observer1 = new IntersectionObserver((entries) => {
      entries.forEach(entry => animateCounter(setCount1, target1, hasAnimated1, entry));
    }, observerOptions);

    const observer2 = new IntersectionObserver((entries) => {
      entries.forEach(entry => animateCounter(setCount2, target2, hasAnimated2, entry));
    }, observerOptions);

    const observer3 = new IntersectionObserver((entries) => {
      entries.forEach(entry => animateCounter(setCount3, target3, hasAnimated3, entry));
    }, observerOptions);

    if (statBox1Ref.current) observer1.observe(statBox1Ref.current);
    if (statBox2Ref.current) observer2.observe(statBox2Ref.current);
    if (statBox3Ref.current) observer3.observe(statBox3Ref.current);

    return () => {
      if (statBox1Ref.current) observer1.unobserve(statBox1Ref.current);
      if (statBox2Ref.current) observer2.unobserve(statBox2Ref.current);
      if (statBox3Ref.current) observer3.unobserve(statBox3Ref.current);
    };
  }, []); 

    return (
        <div>
            <section className={cx('hero')}>
            <div className={cx('hero-background')}></div>
            <h1>LEVELUP YOUR SKILLS<br/>LEVELUP YOUR LIFE !</h1>
            <button className={cx('start-btn')}><Link to="/register">START NOW!</Link></button>
            </section>

            <section className={cx('mission-section')}>
            <img
                src={images.tangHQLVN}
                alt="Team Mission"
            />
            <div className={cx('mission-box')}>
                <h2>SỨ MỆNH CỦA LEVELUP</h2>
                <p className={cx('ta-justify')}>
                LevelUp là nền tảng học tập kỹ năng thực tế dành cho các sinh viên,
                thanh thiếu niên, học sinh và mọi người trẻ. Với sứ mệnh nâng cao năng
                lực cho thế hệ tương lai, chúng tôi mang đến các khóa học, hoạt động
                thực tế và cơ hội để phát triển bản thân, làm việc nhóm và sẵn sàng
                bước vào môi trường làm việc chuyên nghiệp hoặc dự án cộng đồng.
                </p>
            </div>
            </section>

            <section className={cx('skills-section')}>
            <h2>BẠN CÓ THỂ HỌC NHỮNG GÌ TẠI LEVELUP?</h2>
            <div className={cx('skills-grid')}>
                <a className={cx('skill-box')}>
                <img
                    src={images.knThuyetTrinh}
                    alt="Kỹ năng thuyết trình"
                />
                <p>Kỹ năng thuyết trình</p>
                </a>
                <a className={cx('skill-box')}>
                <img
                    src={images.tinHoc}
                    alt="Tin học văn phòng"
                />
                <p>Kỹ năng tin học văn phòng</p>
                </a>
                <a className={cx('skill-box')}>
                <img
                    src={images.knToChucChucSuKien}
                    alt="Tổ chức sự kiện"
                />
                <p>Kỹ năng tổ chức sự kiện</p>
                </a>
                <a className={cx('skill-box')}>
                <img
                    src={images.knSangTaoNoiDung}
                    alt="Sáng tạo nội dung"
                />
                <p>Kỹ năng sáng tạo nội dung</p>
                </a>
            </div>
            </section>

            <section className={cx('journey-section')}>
            <h2>HÀNH TRÌNH SAU MỖI BÀI HỌC</h2>
            <div className={cx('banner-container')}>
                <BannerCarousel images={banners}/>
            </div>

            <div className={cx('stats')}>
                <div className={cx('stat-box')} ref={statBox1Ref}>
                <h3 className={cx('counter-container')}>
                    <div id="counter1">{count1}</div>
                    +
                </h3>
                <img src={images.iconUsers} alt="icon-users" />
                <p>Học viên</p>
                </div>
                <div className={cx('stat-box')} ref={statBox2Ref}>
                <h3 className={cx('counter-container')}>
                    <div id="counter2">{count2}</div>
                    +
                </h3>
                <img src={images.handshakeIcon} alt="handshake-icon" />
                <p>Doanh nghiệp đối tác</p>
                </div>
                <div className={cx('stat-box')} ref={statBox3Ref}>
                <h3 className={cx('counter-container')}>
                    <div id="counter3">{count3}</div>
                    +
                </h3>
                <img src={images.valiIcon} alt="vali-icon" />
                <p>Cơ hội tình nguyện/ thực tập mỗi tháng</p>
                </div>
            </div>
            </section>

            <section className={cx('testimonial-section')}>
            <h2 className={cx('ta-center')}>Chia sẻ của học viên LevelUp</h2>
            <div className={cx('testimonial-group')}>
                <div className={cx('testimonial')}>
                <FaQuoteLeft size={30} color="#fff"/>
                “Tham gia LevelUp giúp em được học kỹ năng thực tế, tự tin hơn khi làm
                việc nhóm và thuyết trình.”
                <div className={cx('name')}>– Minh Anh, sinh viên năm 3</div>
                </div>
                <div className={cx('testimonial')}>
                <FaQuoteLeft size={30} color="#fff"/>
                “LevelUp là môi trường rất tích cực, giảng viên hỗ trợ rất nhiệt tình
                và khóa học rất thú vị!”
                <div className={cx('name')}>– Huy Nam, sinh viên năm 2</div>
                </div>
                <div className={cx('testimonial')}>
                <FaQuoteLeft size={30} color="#fff"/>
                “Nhờ LevelUp, em đã được nhận thực tập ở một công ty đối tác rất tốt!”
                <div className={cx('name')}>– Minh Ánh, sinh viên năm 4</div>
                </div>
            </div>
            </section>

            <section className={cx('register-cta')}>
            <img
                className={cx('register-cta-background')}
                src={images.handsWave}
                alt="anh-bia-body"
            />
            <div className={cx('register-box')}>
                <h3>Bạn đã sẵn sàng học cùng LevelUp?</h3>
                <button>
                    <Link to="/register">Đăng ký ngay</Link>
                </button>
            </div>
            </section>
                </div>
    )
}

export default Home;