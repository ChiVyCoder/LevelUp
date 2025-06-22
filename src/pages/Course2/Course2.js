import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Course2.module.scss';
import PaymentModal from '../../components/PaymentModal/PaymentModal.js';
import { AuthContext } from '../../context/AuthContext.js'; 
import images from '../../assets/images.js';

const cx = classNames.bind(styles);

function Course2() {
  const { userId: urlUserId } = useParams();
  const { currentUser } = React.useContext(AuthContext); 

  const [activeTab, setActiveTab] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCoursePaid, setIsCoursePaid] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const courseId = 2; 
  const currentUserId = currentUser ? currentUser.id : urlUserId || 'guest_user';

  useEffect(() => {
    // Kiểm tra trạng thái thanh toán từ localStorage
    const paidStatus = localStorage.getItem(`course_${courseId}_paid_for_user_${currentUserId}`);
    setIsCoursePaid(paidStatus === 'true');
  }, [currentUserId, courseId]);

  const handleShowContent = (index) => {
    setActiveTab(index);
  };

  const handleOpenPayment = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paidCourseId) => {
    setIsCoursePaid(true);
    localStorage.setItem(`course_${paidCourseId}_paid_for_user_${currentUserId}`, 'true');
    setShowPaymentModal(false);
  };

  const handleFinishCourse = async () => {
    if (!currentUserId || !courseId) {
      setError("Không tìm thấy User ID hoặc Course ID.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const response = await fetch(`https://localhost:7208/api/users/${currentUserId}/courses/${courseId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsCourseCompleted(true);
        setMessage(data.message || 'Khóa học đã được đánh dấu hoàn thành!');
      } else {
        setError(data.message || 'Đã có lỗi xảy ra khi hoàn thành khóa học.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn API.');
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
        <h1 className={cx('course-title')}>Kỹ năng thuyết trình</h1>

        {isCoursePaid ? (
          <>
            <div className={cx('tabs')}>
              <button
                className={cx('tab', { active: activeTab === 0 })}
                onClick={() => handleShowContent(0)}
              >
                Giới thiệu
              </button>
              <button
                className={cx('tab', { active: activeTab === 1 })}
                onClick={() => handleShowContent(1)}
              >
                Các bước chuẩn bị
              </button>
              <button
                className={cx('tab', { active: activeTab === 2 })}
                onClick={() => handleShowContent(2)}
              >
                Mẹo khi trình bày
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
                Tình huống thực hành
              </button>
            </div>

            <div className={cx('content', { active: activeTab === 0 })}>
              <p>
                <strong>Kỹ năng thuyết trình là gì?</strong> Là khả năng trình bày ý tưởng, thông tin hoặc quan điểm một cách mạch lạc, hấp dẫn trước đám đông. Thuyết trình tốt giúp bạn ghi điểm trong học tập, công việc và tạo ấn tượng mạnh mẽ.
              </p>
              <div className={cx('image-row')}>
                <img src="https://cdn.luatminhkhue.vn/lmk/articles/95/478331/thuyet-trinh-la-gi-478331.jpg" alt="Giới thiệu" style={{ borderRadius: '20px' }} />
                <img src="https://www.pace.edu.vn/uploads/news/2023/06/1-khai-niem-ky-nang-thuyet-trinh.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
                <img src="https://tuyendung.kfcvietnam.com.vn/Data/Sites/1/media/blog/thuyet-trinh.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
              </div>
            </div>

            <div className={cx('content', { active: activeTab === 1 })}>
              <p><strong>Các bước chuẩn bị thuyết trình:</strong></p>
              <ul>
                <p><strong>1. Xác định mục tiêu:</strong> Bạn muốn người nghe hiểu gì, cảm thấy gì, làm gì?</p>
                <p><strong>2. Tìm hiểu khán giả:</strong> Họ là ai? Trình độ? Sở thích?</p>
                <p><strong>3. Lên dàn ý:</strong> Mở bài – Thân bài – Kết luận rõ ràng.</p>
                <p><strong>4. Chuẩn bị slide và tư liệu:</strong> Hình ảnh, biểu đồ hỗ trợ.</p>
                <p><strong>5. Tập luyện nhiều lần:</strong> Trước gương, trước bạn bè hoặc ghi hình lại.</p>
                <p><strong>6. Chuẩn bị tinh thần:</strong> Tâm lý vững vàng, làm chủ sân khấu!</p>
              </ul>
              <div className={cx('image-row')}>
                <img src="https://www.pace.edu.vn/uploads/news/2023/06/4-cac-buoc-de-thuyet-trinh-hieu-qua.jpg" alt="Chuẩn bị thuyết trình" style={{ borderRadius: '20px' }} />
                <img src="https://www.surehcs.com/wp-content/uploads/2022/11/chuan-bi-noi-dung-thuyet-trinh.png" alt="Icon 1" style={{ borderRadius: '20px' }} />
                <img src="https://www.pace.edu.vn/uploads/news/2023/06/2-tam-quan-trong-cua-ky-nang-thuyet-trinh.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
              </div>
            </div>

            <div className={cx('content', { active: activeTab === 2 })}>
              <p><strong>Mẹo để thuyết trình ấn tượng:</strong></p>
              <ul>
                <p><strong> 1. Giọng nói:</strong> Rõ ràng, lên xuống hợp lý, có nhấn nhá cảm xúc.</p>
                <p><strong> 2. Giao tiếp mắt:</strong> Nhìn khán giả, đừng chỉ nhìn slide!</p>
                <p><strong> 3. Ngôn ngữ cơ thể:</strong> Tư thế tự tin, cử chỉ minh họa nội dung.</p>
                <p><strong> 4. Ví dụ thực tế:</strong> Dễ hiểu, gần gũi, gợi cảm xúc.</p>
                <p><strong> 5. Tương tác:</strong> Đặt câu hỏi, đố vui, yêu cầu phản hồi từ người nghe.</p>
              </ul>
              <div className={cx('image-row')}>
                <img src="http://www.kynang.edu.vn/wp-content/uploads/cach-mo-dau-thuyet-trinh-an-tuong.jpg" alt="Mẹo thuyết trình" style={{ borderRadius: '20px' }} />
                <img src="https://i.ytimg.com/vi/AOPS3IzZ0Ao/maxresdefault.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
                <img src="https://static.ybox.vn/2015/11/thuyet-trinh-hay.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
              </div>
            </div>

            <div className={cx('content', { active: activeTab === 3 })}>
              <p><strong>Lỗi thường gặp khi thuyết trình:</strong></p>
              <ul>
                <p><strong>1. Đọc slide như đọc văn:</strong> Người nghe sẽ ngủ mất đấy!</p>
                <p><strong>2. Không tập luyện trước:</strong> Gây ấp úng, quên nội dung.</p>
                <p><strong>3. Nói quá nhanh/quá nhỏ:</strong> Người nghe không theo kịp.</p>
                <p><strong>4. Thiếu sự tương tác:</strong> Biến thuyết trình thành "độc thoại".</p>
                <p><strong>5. Slide quá rối:</strong> Chữ nhỏ, quá nhiều chữ, màu sắc chói mắt.</p>
              </ul>
              <div className={cx('image-row')}>
                <img src="https://trinhducduong.com/wp-content/uploads/2018/09/K%E1%BB%B7-n%C4%83ng-thuy%E1%BA%BFt-tr%C3%ACnh-kh%C3%B4ng-b%E1%BB%8B-run-2.jpg" alt="Lỗi thuyết trình" style={{ borderRadius: '20px' }} />
                <img src="https://thedeweyschools.edu.vn/wp-content/uploads/2023/06/loi-ich-cua-ky-nang-thuyet-trinh-5.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
                <img src="https://www.slidefactory.vn/wp-content/uploads/2021/10/loidungmau2-1024x1024.jpeg" alt="Icon 2" style={{ borderRadius: '20px' }} />
              </div>
            </div>

            <div className={cx('content', { active: activeTab === 4 })}>
              <p><strong>Tình huống thực hành:</strong></p>
              <ul>
                <p>1. Giới thiệu bản thân trong buổi định hướng sinh viên mới.</p>
                <p>2. Thuyết trình về đề tài nhóm trong lớp học kỹ năng mềm.</p>
                <p>3. Trình bày ý tưởng trong cuộc thi ý tưởng sáng tạo.</p>
                <p>4. Thuyết trình học bổng hoặc gọi vốn startup.</p>
                <p>5. Trình bày báo cáo trước giáo viên hoặc sếp.</p>
              </ul>
              <div className={cx('image-row')}>
                <img src="https://khoinguonsangtao.vn/wp-content/uploads/2022/08/hinh-nen-powerpoint-xin-chao-cute-nen-tim.jpg" alt="Thực hành thuyết trình" style={{ borderRadius: '20px' }} />
                <img src="http://thptluunhanchu.thainguyen.edu.vn/upload/51227/fck/files/05128096bfc9419718d8.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
                <img src="http://edubit.vn/data/blog/photo_thiet-ke-bai-thuyet-trinh.png_1600417325.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
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
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal
          course={{ id: courseId, title: 'Kỹ năng thuyết trình', price: 499000 }}
          userId={currentUserId}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default Course2;