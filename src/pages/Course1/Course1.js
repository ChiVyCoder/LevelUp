import { useState, useEffect } from 'react'; // Import useState và useEffect
import { Link, useParams } from 'react-router-dom'; // Import useParams
import classNames from 'classnames/bind';
import styles from './Course1.module.scss';

const cx = classNames.bind(styles);

function Course1() {
  const { userId } = useParams();
  const courseId = '1'
  // Trạng thái để kiểm soát việc hiển thị nội dung tab và trạng thái hoàn thành khóa học
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Hàm để chuyển đổi tab
  const showContent = (index) => {
    setActiveTabIndex(index);
  };

  // Hàm gọi API để đánh dấu khóa học hoàn thành
  const handleFinishCourse = async () => {
    if (!userId || !courseId) {
      setError("Không tìm thấy User ID hoặc Course ID trong URL.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(''); 

    try {
      const response = await fetch(`https://localhost:7208/api/users/${userId}/courses/${courseId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIsCourseCompleted(true);
        setMessage(data.message || 'Khóa học đã được đánh dấu hoàn thành!');
        // Cập nhật giao diện người dùng nếu cần, ví dụ: vô hiệu hóa nút "Hoàn thành"
      } else {
        setError(data.message || 'Đã có lỗi xảy ra khi hoàn thành khóa học.');
        console.error('Lỗi API:', data.error || data.message);
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường dẫn API.');
      console.error('Lỗi network hoặc server:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để kiểm tra trạng thái hoàn thành khóa học khi component được load
  useEffect(() => {
    const checkCourseStatus = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await fetch(`https://localhost:7208/api/users/${userId}/courses/completed`);
        const data = await response.json();

        if (response.ok && data && Array.isArray(data)) {
          const completed = data.some(uc => uc.courseId === parseInt(courseId));
          setIsCourseCompleted(completed);
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra trạng thái khóa học:', err);
      }
    };

    checkCourseStatus();
  }, [userId, courseId]); 

  return (
    <div className={cx('wrapper')}>
      <div className={cx('back-button')}>
        <Link to="/course">← Trở về trang chính</Link>
      </div>
      <div className={cx('container')}>
        <h1 className={cx('course-title')}>Kỹ năng giao tiếp</h1>

        <div className={cx('tabs')}>
          {['Hiểu giao tiếp', 'Dạng giao tiếp', 'Giao tiếp hiệu quả', 'Lỗi thường gặp', 'Thực hành'].map((tabName, index) => (
            <button
              key={index}
              className={cx('tab', { active: activeTabIndex === index })}
              onClick={() => showContent(index)}
            >
              {tabName}
            </button>
          ))}
        </div>
        {[
          // Nội dung của tab 0
          <div key={0} className={cx('content', { active: activeTabIndex === 0 })}>
            <p>
              <strong> Giao tiếp là gì?</strong> Giao tiếp là quá trình trao đổi thông tin, ý tưởng hoặc cảm xúc giữa người với người qua lời nói, cử chỉ, văn bản hay hình ảnh. Nó giúp chúng ta hiểu nhau, hợp tác hiệu quả trong học tập, công việc và cuộc sống. Giao tiếp có thể bằng lời, phi ngôn ngữ, văn bản hoặc hình ảnh. Kỹ năng giao tiếp tốt giúp xây dựng mối quan hệ và phát triển bản thân.
            </p>
            <div className={cx('image-row')}>
              <img src="https://www.pace.edu.vn/uploads/news/2023/04/ky-nang-giao-tiep-ket-hop-ngon-ngu-co-the.jpg" alt="Hiểu giao tiếp" style={{ borderRadius: '20px' }} />
              <img src="https://olivierguez.com/wp-content/uploads/2022/08/dcb2e953-1975-4597-b6e5-3b47b73e104e.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
              <img src="https://khoahocdoanhnghiep.edu.vn/uploads/khoa-hoc-ky-nang-giao-tiep-tot_1667669720.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
            </div>
          </div>,
          // Nội dung của tab 1
          <div key={1} className={cx('content', { active: activeTabIndex === 1 })}>
            <p><strong>Các dạng giao tiếp:</strong></p>
            <ul>
              <p>
                <strong>1. Lời nói:</strong> Là hình thức phổ biến nhất, sử dụng ngôn ngữ để truyền đạt suy nghĩ và cảm xúc, lời nói giúp chúng ta chia sẻ và thấu hiểu nhau dễ dàng hơn.
              </p>
              <p>
                <strong>2. Phi ngôn ngữ:</strong> Đôi khi, ánh mắt, nét mặt hay cái gật đầu cũng có thể "nói" nhiều hơn cả lời nói. Đây là dạng giao tiếp không dùng lời nói.
              </p>
              <p>
                <strong>3. Bằng văn bản:</strong> Thông qua chữ viết – như email, tin nhắn hay thư tay – chúng ta có thể gửi gắm suy nghĩ một cách rõ ràng.
              </p>
              <p>
                <strong>4.Bằng hình ảnh:</strong> Hình ảnh, biểu đồ, màu sắc hay các biểu tượng trực quan có thể giúp thông điệp trở nên sinh động, dễ nhớ và thu hút hơn.
              </p>
            </ul>
            <div className={cx('image-row')}>
              <img src="https://toplist.vn/images/800px/mo-rong-moi-quan-he-631410.jpg" alt="Dạng giao tiếp" style={{ borderRadius: '20px' }} />
              <img src="https://glints.com/vn/blog/wp-content/uploads/2023/08/giao-tiep-bang-mat.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
              <img src="https://png.pngtree.com/background/20230313/original/pngtree-concept-of-communication-with-businessmen-handshaking-vector-picture-image_2128726.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
            </div>
          </div>,
          // Nội dung của tab 2
          <div key={2} className={cx('content', { active: activeTabIndex === 2 })}>
            <p><strong>Giao tiếp hiệu quả bao gồm:</strong></p>
            <ul>
              <p>
                <strong>1. Lắng nghe chủ động:</strong> Không chỉ "nghe để trả lời" mà là "nghe để hiểu".
              </p>
              <p>
                <strong>2. Diễn đạt rõ ràng và súc tích:</strong>Dùng từ dễ hiểu, nói đúng trọng tâm, tránh vòng vo.
              </p>
              <p>
                <strong>3. Giữ ánh mắt và ngôn ngữ cơ thể tích cực:</strong> Giao tiếp bằng ánh mắt, nụ cười, tư thế mở….
              </p>
              <p>
                <strong>4. Biết kiểm soát cảm xúc:</strong> Đừng để cảm xúc bốc đồng ảnh hưởng lời nói.
              </p>
              <p>
                <strong>5. Biết đặt câu hỏi và lắng nghe phản hồi:</strong> Giao tiếp không chỉ là nói mà còn là hỏi và thấu hiểu người khác.
              </p>
            </ul>
            <div className={cx('image-row')}>
              <img src="https://blogcdn.muaban.net/wp-content/uploads/2022/03/24134717/ky-nang-lang-nghe-trong-giao-tiep-2.jpg" alt="Giao tiếp hiệu quả" style={{ borderRadius: '20px' }} />
              <img src="https://media.kenhtuyensinh.vn/images/2015/nhung-ky-nang-giao-tiep-ung-xu-va-tao-lap-quan-he-can-co.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
              <img src="https://khoahocdoanhnghiep.edu.vn/uploads/ky-nang-giao-tiep-voi-khach-hang_1675005076.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
            </div>
          </div>,
          // Nội dung của tab 3
          <div key={3} className={cx('content', { active: activeTabIndex === 3 })}>
            <p><strong>Lỗi thường gặp trong giao tiếp:</strong></p>
            <ul>
              <p>
                <strong>1. Nói quá nhiều, không lắng nghe:</strong> Mãi mê nói mà quên để người khác chia sẻ.
              </p>
              <p>
                <strong>2. Dùng từ ngữ không phù hợp:</strong> Dùng từ gây khó hiểu, sáo rỗng, hoặc không đúng hoàn cảnh.
              </p>
              <p>
                <strong>3. Giao tiếp thiếu tự tin:</strong> Ngập ngừng, nói nhỏ, né tránh ánh mắt làm giảm hiệu quả giao tiếp.
              </p>
              <p>
                <strong>4. Không để ý ngôn ngữ cơ thể:</strong> Gương mặt cau có, khoanh tay, nhìn xuống đất... làm người đối diện mất thiện cảm.
              </p>
              <p>
                <strong>5. Không để ý đến cảm xúc người nghe:</strong> Nói chuyện vô tâm, làm tổn thương người khác mà không hay biết.
              </p>
            </ul>
            <div className={cx('image-row')}>
              <img src="https://media.kenhtuyensinh.vn/images/2014/12/Nhung-loi-thuong-gap-khi-giao-tiep.jpg" alt="Lỗi giao tiếp" style={{ borderRadius: '20px' }} />
              <img src="https://www.mindalife.vn/wp-content/uploads/2020/07/hoi-nhung-khong-qua-to-mo-va-lang-nghe-chan-thanh-cung-la-cach-the-hien-ban-quan-tam-den-nguoi-doi-dien-e1595060908580.jpg" alt="Icon 1" style={{ borderRadius: '20px' }} />
              <img src="https://cce.com.vn/wp-content/uploads/2020/07/ky-nang-giao-tiep-qua-dien-thoai-hieu-qua.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
            </div>
          </div>,
          // Nội dung của tab 4
          <div key={4} className={cx('content', { active: activeTabIndex === 4 })}>
            <p><strong>Tình huống thực hành:</strong></p>
            <ul>
              <p>
                <strong> 1. Giới thiệu bản thân trước đám đông:</strong> Trình bày rõ ràng, mạch lạc, tự tin (đừng quên nụ cười nha!).
              </p>
              <p>
                <strong> 2. Phản hồi ý kiến người khác:</strong> Nghe – hiểu – phản hồi tích cực, tránh cãi vã hay phản ứng gắt.
              </p>
              <p>
                <strong> 3. Giao tiếp qua điện thoại hoặc tin nhắn:</strong> Dùng từ lịch sự, giọng nói rõ ràng, dễ hiểu.
              </p>
              <p>
                <strong> 4. Xin lỗi và giải thích:</strong> Nhận lỗi chân thành, không đổ lỗi, kèm hướng khắc phục.
              </p>
              <p>
                <strong> 5. Góp ý hoặc từ chối khéo léo:</strong> Tế nhị, tôn trọng – ví dụ: “Mình nghĩ có thể thử cách khác...”
              </p>
            </ul>
            <div className={cx('image-row')}>
              <img src="https://vinahi.com/wp-content/uploads/2021/08/3-2.png" alt="Thực hành" style={{ borderRadius: '20px' }} />
              <img src="https://jobsgo.vn/blog/wp-content/uploads/2021/06/giao-tiep-hieu-qua.png" alt="Icon 1" style={{ borderRadius: '20px' }} />
              <img src="https://timviec365.vn/pictures/images/cac-tinh-huong-trong-quan-tri-hanh-chinh-van-phong-5.jpg" alt="Icon 2" style={{ borderRadius: '20px' }} />
            </div>
            {/* Nút hoàn thành khóa học */}
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
        ].filter((_, index) => activeTabIndex === index)} 
      </div>
    </div>
  );
}

export default Course1;