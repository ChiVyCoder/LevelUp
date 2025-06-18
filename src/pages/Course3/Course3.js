import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Course3.module.scss';
import PaymentModal from '../../components/PaymentModal/PaymentModal';
import { AuthContext } from '../../context/AuthContext';
import images from '../../assets/images.js';

const cx = classNames.bind(styles);

function Course3() {
  const { userId: urlUserId } = useParams(); // Lấy userId từ URL
  const { currentUser } = React.useContext(AuthContext); // Lấy currentUser từ AuthContext

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCoursePaid, setIsCoursePaid] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isCourseCompleted, setIsCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const courseId = 3; // Hardcode courseId cho Course3
  const currentUserId = currentUser ? currentUser.id : urlUserId || 'guest_user'; // Ưu tiên currentUser.id, sau đó đến userId từ URL, cuối cùng là guest_user

  useEffect(() => {
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
        <Link to="/course">
          ← Trở về trang chính</Link>
      </div>
      <div className={cx('container')}>
        <h1 className={cx('course-title')}>HTML - CSS - JAVASCRIPT</h1>
        {
          isCoursePaid ? (
            <>
              <div className={cx('tabs')}>
                <button
                  className={cx('tab', { active: activeTab === 0 })}
                  onClick={() => handleShowContent(0)}
                >
                  HTML
                </button>
                <button
                  className={cx('tab', { active: activeTab === 1 })}
                  onClick={() => handleShowContent(1)}
                >
                  CSS
                </button>
                <button
                  className={cx('tab', { active: activeTab === 2 })}
                  onClick={() => handleShowContent(2)}
                >
                  JavaScript
                </button>
              </div>

              {/* Hiển thị nội dung tương ứng với activeTab */}
              <div className={cx('content', { active: activeTab === 0 })}>
                <p>
                  <strong>HTML (HyperText Markup Language)</strong> là nền tảng của mọi trang web, giúp bạn xây dựng{' '}
                  <strong>cấu trúc và nội dung</strong> cho trang web. Nó không chỉ là các dòng chữ mà còn là bộ khung xương để mọi thứ khác được đặt vào.
                </p>
                <ul>
                  <li>
                    <strong>1. Hiểu và sử dụng các thẻ cơ bản:</strong>
                    <ul>
                      <li>`&lt;html&gt;`, `&lt;head&gt;`, `&lt;body&gt;`: Cấu trúc chính của tài liệu HTML.</li>
                      <li>`&lt;div&gt;`, `&lt;span&gt;`: Dùng để nhóm các phần tử, tạo khối nội dung.</li>
                      <li>`&lt;p&gt;`, `&lt;h1&gt;` đến `&lt;h6&gt;`: Tạo đoạn văn bản và các tiêu đề với cấp độ khác nhau.</li>
                      <li>`&lt;a&gt;`: Tạo liên kết đến trang khác hoặc phần tử khác trên cùng trang. Ví dụ: `&lt;a href="https://levelup.com.vn"&gt;LevelUp Website&lt;/a&gt;`.</li>
                      <li>`&lt;img&gt;`: Nhúng hình ảnh vào trang web. Ví dụ: `&lt;img src="logo.png" alt="LevelUp Logo"&gt;`.</li>
                      <li>`&lt;form&gt;`, `&lt;input&gt;`, `&lt;button&gt;`: Tạo biểu mẫu nhập liệu và các nút tương tác.</li>
                      <li>`&lt;ul&gt;`, `&lt;ol&gt;`, `&lt;li&gt;`: Tạo danh sách không thứ tự và có thứ tự.</li>
                      <li>`&lt;table&gt;`, `&lt;tr&gt;`, `&lt;td&gt;`: Dựng bảng để hiển thị dữ liệu.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>2. Nắm vững cách tạo form, liên kết, nhúng hình ảnh và video:</strong>
                    <ul>
                      <li><strong>Form (biểu mẫu):</strong> Cho phép người dùng nhập dữ liệu (đăng ký, đăng nhập, gửi phản hồi).</li>
                      <li><strong>Liên kết:</strong> Kết nối các trang web lại với nhau, tạo ra một mạng lưới thông tin.</li>
                      <li><strong>Nhúng đa phương tiện:</strong> Đưa hình ảnh, video (sử dụng thẻ `&lt;video&gt;`), âm thanh (thẻ `&lt;audio&gt;`) trực tiếp vào trang, làm cho nội dung phong phú hơn.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Biết cách sử dụng các thuộc tính quan trọng:</strong>
                    <ul>
                      <li>`href`: Chỉ định địa chỉ URL cho thẻ `&lt;a&gt;` (liên kết).</li>
                      <li>`src`: Xác định nguồn của hình ảnh (`&lt;img&gt;`) hoặc video (`&lt;video&gt;`).</li>
                      <li>`alt`: Cung cấp văn bản thay thế cho hình ảnh khi không thể tải hoặc cho người dùng khiếm thị (quan trọng cho SEO và khả năng tiếp cận).</li>
                      <li>`placeholder`: Gợi ý nội dung trong các trường nhập liệu của form.</li>
                      <li>`id`, `class`: Dùng để định danh và phân loại các phần tử, giúp CSS và JavaScript dễ dàng tương tác.</li>
                    </ul>
                  </li>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://mooood.fr/wp-content/uploads/2022/05/html.jpg" alt="HTML Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://newsandstory.com/stories/21062184742201828485/21062184742201828485.png" alt="HTML Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://hocban.vn/wp-content/uploads/2017/03/huong-danh-cach-chen-link-lien-ket-trong-html.jpg" alt="HTML Icon" style={{ borderRadius: '20px' }} />
                </div>
              </div>

              <div className={cx('content', { active: activeTab === 1 })}>
                <p>
                  <strong>CSS (Cascading Style Sheets)</strong> giúp tạo giao diện đẹp mắt và điều chỉnh bố cục cho trang web, biến những cấu trúc HTML khô khan trở nên sinh động và đẹp mắt.
                </p>
                <ul>
                  <li>
                    <strong>1. Thành thạo các thuộc tính CSS cơ bản:</strong>
                    <ul>
                      <li>`color`, `font-size`, `font-family`: Định dạng văn bản.</li>
                      <li>`margin`, `padding`, `border`: Điều chỉnh khoảng cách và đường viền của các phần tử.</li>
                      <li>`width`, `height`: Kiểm soát kích thước của các hộp nội dung.</li>
                      <li>`background-color`, `background-image`: Đặt màu hoặc hình ảnh nền.</li>
                      <li>`display`: Kiểm soát cách hiển thị của một phần tử (ví dụ: `block`, `inline`, `flex`, `grid`).</li>
                      <li>`box-shadow`, `text-shadow`: Tạo hiệu ứng đổ bóng cho hộp và văn bản.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>2. Sử dụng linh hoạt các bộ chọn (selectors):</strong>
                    <ul>
                      <li><strong>`element` selector:</strong> Áp dụng style cho tất cả các thẻ HTML nhất định (ví dụ: `p  color: blue; `).</li>
                      <li><strong>`class` selector:</strong> Áp dụng style cho các phần tử có cùng `class` (ví dụ: `.button  background-color: green; `).</li>
                      <li><strong>`id` selector:</strong> Áp dụng style cho một phần tử duy nhất được xác định bằng `id` (ví dụ: `#main-header  font-size: 3em; `).</li>
                      <li><strong>`pseudo-class` (ví dụ: `:hover`, `:active`, `:focus`):</strong> Áp dụng style khi phần tử ở trạng thái đặc biệt (ví dụ: `a:hover  text-decoration: underline; `).</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Tạo hiệu ứng và khả năng responsive với:</strong>
                    <ul>
                      <li><strong>`transition`:`</strong> Tạo hiệu ứng chuyển đổi mượt mà khi các thuộc tính CSS thay đổi (ví dụ: `transition: all 0.3s ease;`).</li>
                      <li><strong>`animation`:`</strong> Tạo các hoạt ảnh phức tạp hơn, tự động chạy hoặc lặp lại.</li>
                      <li><strong>`media query`:`</strong> Giúp trang web hiển thị tốt trên các thiết bị có kích thước màn hình khác nhau (responsive design).</li>
                      <li><strong>Flexbox và Grid:</strong> Các module CSS mạnh mẽ để xây dựng bố cục trang web phức tạp và linh hoạt.</li>
                    </ul>
                  </li>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://img.uxcel.com/tags/cascading-style-sheets-css-1691390990160-2x.jpg" alt="CSS Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://cdn.mos.cms.futurecdn.net/Vp9WvV7YKdH4k8sKRePcE8-1200-80.jpg" alt="CSS Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://tse4.mm.bing.net/th?id=OIP.QboECllqvXHIMp6F04FO4gAAAA&pid=Api&P=0&h=220" alt="CSS Icon" style={{ borderRadius: '20px' }} />
                </div>
              </div>

              <div className={cx('content', { active: activeTab === 2 })}>
                <p>
                  <strong>JavaScript</strong> là ngôn ngữ lập trình giúp trang web có thể tương tác và động hơn. Nó là "bộ não" của trang web, cho phép người dùng tương tác với nội dung và nhận phản hồi.
                </p>
                <ul>
                  <li>
                    <strong>1. Nắm vững các khái niệm cơ bản về lập trình:</strong>
                    <ul>
                      <li><strong>Biến (`var`, `let`, `const`):</strong> Dùng để lưu trữ dữ liệu.</li>
                      <li><strong>Kiểu dữ liệu:</strong> Số, chuỗi, boolean, mảng, đối tượng.</li>
                      <li><strong>Hàm (`function`):</strong> Tập hợp các câu lệnh thực hiện một nhiệm vụ cụ thể, có thể tái sử dụng.</li>
                      <li><strong>Vòng lặp (`for`, `while`):</strong> Lặp lại một khối mã nhiều lần.</li>
                      <li><strong>Câu lệnh điều kiện (`if`, `else if`, `else`, `switch`):</strong> Thực thi mã dựa trên các điều kiện khác nhau.</li>
                      <li><strong>Toán tử:</strong> Toán học, so sánh, logic.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>2. Biết cách thao tác với DOM (Document Object Model):</strong>
                    <ul>
                      <li>`document.getElementById()`, `document.querySelector()`, `document.querySelectorAll()`: Chọn các phần tử HTML trên trang.</li>
                      <li>`element.addEventListener()`: Lắng nghe và phản ứng với các sự kiện của người dùng (click, hover, submit form).</li>
                      <li>`element.innerHTML`, `element.textContent`: Thay đổi nội dung của các phần tử.</li>
                      <li>`element.classList.add()`, `element.classList.remove()`, `element.classList.toggle()`: Thêm/xóa/chuyển đổi các class CSS.</li>
                      <li>`element.style.propertyName`: Thay đổi trực tiếp các thuộc tính CSS của phần tử.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>3. Triển khai các tính năng tương tác và xử lý dữ liệu:</strong>
                    <ul>
                      <li><strong>Tạo hiệu ứng động:</strong> Hiển thị/ẩn phần tử, cuộn trang mượt mà, tạo slideshow ảnh.</li>
                      <li><strong>Kiểm tra dữ liệu form (form validation):</strong> Đảm bảo dữ liệu người dùng nhập vào là hợp lệ trước khi gửi đi.</li>
                      <li><strong>Tương tác với dữ liệu:</strong>
                        <ul>
                          <li><strong>`localStorage` / `sessionStorage`:`</strong> Lưu trữ dữ liệu cục bộ trên trình duyệt của người dùng.</li>
                          <li><strong>API (Application Programming Interface):</strong> Gửi yêu cầu và nhận dữ liệu từ các máy chủ bên ngoài (ví dụ: tải tin tức, thông tin thời tiết).</li>
                          <li><strong>JSON:</strong> Định dạng dữ liệu phổ biến để trao đổi thông tin qua API.</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
                <div className={cx('image-row')}>
                  <img src="https://codedamn-blog.s3.amazonaws.com/wp-content/uploads/2022/09/08131005/Make-Games-with-javascript.png" alt="JS Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://s3-ap-southeast-1.amazonaws.com/storage.virtualspirit.me/post/cover/151/10.jpg" alt="JS Icon" style={{ borderRadius: '20px' }} />
                  <img src="https://tse1.mm.bing.net/th?id=OIP.HBOdFWt8WONUs_9rhoKwSQHaEK&pid=Api&P=0&h=220" alt="JS Icon" style={{ borderRadius: '20px' }} />
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
          course={{ id: courseId, title: 'KNCN: HTML, CSS, JAVASCRIPT', price: 299000 }}
          userId={currentUserId}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}

export default Course3;