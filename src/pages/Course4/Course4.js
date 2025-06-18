import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import classNames from 'classnames/bind';
import styles from './Course4.module.scss';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { AuthContext } from '../../context/AuthContext';
import { finishCourse } from '../../services/userCourseService';
import images from '../../assets/images.js';

const cx = classNames.bind(styles);

function Course4() {
  const { userId: urlUserId } = useParams(); // Lấy userId từ URL
  const { currentUser } = useContext(AuthContext); // Lấy currentUser từ AuthContext

  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCoursePaid, setIsCoursePaid] = useState(false);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const courseId = 4; // Hardcode courseId cho Course4
  const currentUserId = currentUser ? currentUser.id : urlUserId || 'guest_user'; // Ưu tiên currentUser.id, sau đó đến userId từ URL, cuối cùng là guest_user

  useEffect(() => {
    // Kiểm tra trạng thái thanh toán từ localStorage
    const paidStatus = localStorage.getItem(`course_${courseId}_paid_for_user_${currentUserId}`);
    setIsCoursePaid(paidStatus === 'true');
  }, [currentUserId, courseId]);

  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paidCourseId) => {
    setIsCoursePaid(true);
    localStorage.setItem(`course_${paidCourseId}_paid_for_user_${currentUserId}`, 'true');
    setShowPaymentModal(false);
  };

  const handleShowContent = (index) => {
    setActiveTab(index);
  };

  const handleFinishCourse = async () => {
    if (!currentUserId) {
      setError('Bạn cần đăng nhập để hoàn thành khóa học này.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    try {
      // Sử dụng service finishCourse đã có sẵn
      const response = await finishCourse(currentUserId, courseId);
      if (response.success) {
        setIsCourseCompleted(true);
        setMessage(response.message || 'Khóa học đã được đánh dấu hoàn thành!');
      } else {
        setError(response.message || 'Đã có lỗi xảy ra khi hoàn thành khóa học.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ hoặc có lỗi xảy ra. Vui lòng thử lại.');
      console.error("Lỗi khi hoàn thành khóa học:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUserId || !courseId) return;

    const checkCourseStatus = async () => {
      try {
        const response = await fetch(`https://localhost:7208/api/users/${currentUserId}/courses/completed`);
        const data = await response.json();

        if (response.ok && data && Array.isArray(data)) {
          const completed = data.some(uc => uc.courseId === courseId);
          setIsCourseCompleted(completed);
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái khóa học:', err);
      }
    };

    checkCourseStatus();
  }, [currentUserId, courseId]);


  return (
    <div className={cx('wrapper')}>
      <div className={cx('back-button')}>
        <Link to="/course">← Trở về trang chính</Link>
      </div>
      <div className={cx('container')}>
        <h1 className={cx('course-title')}>Kỹ năng chuyên ngành</h1>
        {
          isCoursePaid ? (
            <>
              <div className={cx('tabs')}>
                <button
                  className={cx('tab', { active: activeTab === 0 })}
                  onClick={() => handleShowContent(0)}
                >
                  Tổng quan
                </button>
                <button
                  className={cx('tab', { active: activeTab === 1 })}
                  onClick={() => handleShowContent(1)}
                >
                  Công cụ cần thiết
                </button>
                <button
                  className={cx('tab', { active: activeTab === 2 })}
                  onClick={() => handleShowContent(2)}
                >
                  Nguyên tắc thiết kế
                </button>
                <button
                  className={cx('tab', { active: activeTab === 3 })}
                  onClick={() => handleShowContent(3)}
                >
                  Lỗi thường gặp
                </button>
                <button
                  className={cx('tab', { active: activeTab === 4 })}
                  onClick={() => handleShowContent(4)}
                >
                  Thực hành
                </button>
              </div>

              <div className={cx('content', { active: activeTab === 0 })}>
                <p>
                  <strong>Kỹ năng thiết kế là gì?</strong> Là khả năng sáng tạo, trình bày nội dung và hình ảnh một cách thẩm mỹ, hiệu quả và dễ hiểu. Thiết kế không chỉ đẹp mắt mà còn phải truyền tải đúng thông điệp, phù hợp với đối tượng người dùng.
                </p>
                <div className={cx('image-row')}>
                  <img src="https://vtc.edu.vn/wp-content/uploads/2022/06/nghanh-thiet-ke-do-hoa-la-gi.jpg" alt="Giới thiệu thiết kế" style={{ borderRadius: '20px' }} />
                  <img src="https://idc.edu.vn/images/t%E1%BB%91_ch%E1%BA%A5t_h%E1%BB%8Dc_thi%E1%BA%BFt_k%E1%BA%BF/t%E1%BB%91_ch%E1%BA%A5t_%C4%91%E1%BB%83_h%E1%BB%8Dc_thi%E1%BA%BFt_k%E1%BA%BF_%C4%91%E1%BB%93_h%E1%BB%8Da_2.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
                  <img src="https://bachkhoasaigon.edu.vn/wp-content/uploads/2021/12/10-ky-nang-can-nang-cao-khi-hoc-nganh-thiet-ke-do-hoa.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
                </div>
              </div>

              <div className={cx('content', { active: activeTab === 1 })}>
                <p><strong>Các công cụ thiết kế phổ biến:</strong></p>
                <ul>
                  <p><strong>1. Canva:</strong> Thiết kế đơn giản, phù hợp người mới, có nhiều template.</p>
                  <p><strong>2. Adobe Photoshop:</strong> Chỉnh sửa ảnh mạnh mẽ, chuyên nghiệp.</p>
                  <p><strong>3. Adobe Illustrator:</strong> Thiết kế logo, vector, minh họa sắc nét.</p>
                  <p><strong>4. Figma:</strong> Thiết kế giao diện website, app – hỗ trợ làm nhóm tốt.</p>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://www.makemoney.ng/wp-content/uploads/2022/09/Canva.jpg" alt="Canva" style={{ borderRadius: '20px' }} />
                  <img src="https://ngerank.com/product/wp-content/uploads/2024/06/Adobe-Photoshop-CC.webp" alt="Photoshop" style={{ borderRadius: '20px' }} />
                  <img src="https://images.ctfassets.net/vx2fw5lk485m/32EjrlyBYflHkiT5jrqfZh/9b6a5f743352fbaa37a1976f22fb2d37/______-6.Figma-______.jpg" alt="Figma" style={{ borderRadius: '20px' }} />
                </div>
              </div>

              <div className={cx('content', { active: activeTab === 2 })}>
                <p><strong>Nguyên tắc thiết kế cơ bản:</strong></p>
                <ul>
                  <p><strong> 1. Cân đối và bố cục:</strong> Sắp xếp nội dung hợp lý, dễ nhìn.</p>
                  <p><strong> 2. Màu sắc hài hòa:</strong> Không dùng quá nhiều màu – ưu tiên 2–3 tone chủ đạo.</p>
                  <p><strong> 3. Font chữ rõ ràng:</strong> Dễ đọc, nhất quán. Tránh font “lạ” gây rối mắt.</p>
                  <p><strong> 4. Tối giản:</strong> Không nhồi nhét – “ít mà chất”.</p>
                  <p><strong> 5. Hiểu người dùng:</strong> Thiết kế phù hợp với mục tiêu và đối tượng sử dụng.</p>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://d1j8r0kxyu9tj8.cloudfront.net/images/1494058406uWEXUvIiQGAkiHN.jpg" alt="Nguyên tắc thiết kế" style={{ borderRadius: '20px' }} />
                  <img src="https://dichvuseohot.com/wp-content/uploads/2024/03/thiet-ke-do-hoa.jpg" alt="Thẩm mỹ" style={{ borderRadius: '20px' }} />
                  <img src="https://cdn.gumac.vn/image/01/2020/bang-phoi-mau/bang-phoi-mau090320201631384555.jpg" alt="Typography" style={{ borderRadius: '20px' }} />
                </div>
              </div>

              <div className={cx('content', { active: activeTab === 3 })}>
                <p><strong>Những lỗi thường gặp trong thiết kế:</strong></p>
                <ul>
                  <p><strong> 1. Dùng quá nhiều font / màu:</strong> Làm rối mắt, thiếu chuyên nghiệp.</p>
                  <p><strong> 2. Không căn chỉnh:</strong> Lệch lạc, không đều làm giảm thẩm mỹ.</p>
                  <p><strong> 3. Thiếu khoảng trắng:</strong> Nhồi nội dung gây bí bách, khó chịu.</p>
                  <p><strong> 4. Sử dụng ảnh mờ:</strong> Làm giảm chất lượng thiết kế.</p>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://tse2.mm.bing.net/th?id=OIP.Zp16h5Npb7151O1biTiiBgHaEo&pid=Api&P=0&h=220" alt="Lỗi 1" style={{ borderRadius: '20px' }} />
                  <img src="https://www.slidefactory.vn/wp-content/uploads/2021/10/loidungmau2-1024x1024.jpeg" alt="Lỗi 2" style={{ borderRadius: '20px' }} />
                  <img src="https://thietkewebso.com/upload/blog/2023/03/17/mot-so-loi-thuong-gap-khi-thiet-ke-web-879126.jpg" alt="Lỗi 3" style={{ borderRadius: '20px' }} />
                </div>
              </div>
              <div className={cx('content', { active: activeTab === 4 })}>
                <p><strong>Tình huống thực hành kỹ năng thiết kế:</strong></p>
                <ul>
                  <p><strong> 1. Thiết kế slide thuyết trình nhóm:</strong> Cần rõ ràng, có điểm nhấn, dùng icon minh họa.</p>
                  <p><strong> 2. Thiết kế bài đăng mạng xã hội:</strong> Truyền tải nhanh, gọn, bắt mắt.</p>
                  <p><strong> 3. Thiết kế CV cá nhân:</strong> Sáng tạo nhưng vẫn chuyên nghiệp.</p>
                  <p><strong> 4. Thiết kế banner / poster cho CLB / dự án:</strong> Gây ấn tượng ngay từ cái nhìn đầu tiên.</p>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://img.pikbest.com/01/79/86/95HpIkbEsTP7D.jpg-0.jpg!bw700" alt="Thực hành 1" style={{ borderRadius: '20px' }} />
                  <img src="https://proskills.vn/wp-content/uploads/2025/02/image9-mau-powerpoint-thuyet-trinh-nhom.jpg" alt="Thực hành 2" style={{ borderRadius: '20px' }} />
                  <img src="https://aedigi.com/wp-content/uploads/2022/11/Beige-and-Green-Minimalist-Digital-Marketing-CV-Resume.png" alt="Thực hành 3" style={{ borderRadius: '20px' }} />
                </div>
                {error && <p className={cx('error-message')}>{error}</p>}
                {message && <p className={cx('success-message')}>{message}</p>}
                <button
                  className={cx('finish-btn')}
                  onClick={handleFinishCourse}
                  disabled={isCourseCompleted || loading}
                >
                  {loading ? 'Đang hoàn thành...' : (isCourseCompleted ? 'Đã hoàn thành' : 'Ấn vào đây để hoàn thành')}
                </button>
              </div>
            </>
          ) : (
            <div className={cx('payment-prompt')}>
              <div>
                  <p className={cx('payment-message')}>
                Khóa học này có tính phí. Vui lòng thanh toán để truy cập nội dung đầy đủ.
              </p>
              <button className={cx('payment-button')} onClick={handleOpenPayment}>
                Đăng ký khóa học ngay
              </button>
              </div>
              <img className={cx('payment-img')} src={images.thanhToan} alt='Thanh toán'/>
            </div>
          )
        }
      </div>
      {showPaymentModal && (
        <PaymentModal
          course={{ id: courseId, title: 'KNCN: Thiết kế', price: 325000 }}
          userId={currentUserId}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default Course4;