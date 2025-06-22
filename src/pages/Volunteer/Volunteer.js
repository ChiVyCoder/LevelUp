import React, { useEffect, useState } from 'react';
import styles from './Volunteer.module.scss';
import classNames from 'classnames/bind';
import images from '../../assets/images.js';
import { getAllVolunteers } from '../../services/volunteerService.js';
import BannerCarousel from '../../components/BannerCarousel/BannerCarousel.js';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react'; 
import { AuthContext } from '../../context/AuthContext.js'; 

const cx = classNames.bind(styles);

function Volunteer() {
    const [allVolunteers, setAllVolunteers] = useState([]);
    const [currentVolunteers, setCurrentVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredVolunteerId, setHoveredVolunteerId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const [locationFilter, setLocationFilter] = useState('');
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [typeFilter, setTypeFilter] = useState('');
    const [industryFilter, setIndustryFilter] = useState('');
    const banners = [
      'https://langmaster.edu.vn/storage/editor-upload/images/Web-01.jpg',
      'https://tuhocdohoa.vn/wp-content/uploads/2018/08/TT076-chi-hang-nga-vui-vui-tet-trung-thu.jpg',
      'https://fbm.neu.edu.vn/wp-content/uploads/2024/12/cover-tn.png'
    ];

    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(AuthContext); 

    useEffect(() => {
        const fetchVolunteersData = async () => {
            try {
                const data = await getAllVolunteers();
                setAllVolunteers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteersData();
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setCurrentVolunteers(filteredVolunteers.slice(startIndex, endIndex));
    }, [currentPage, filteredVolunteers, itemsPerPage]);

    const totalPages = Math.ceil(filteredVolunteers.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        let tempVolunteers = [...allVolunteers];

        if (locationFilter) {
            tempVolunteers = tempVolunteers.filter(
                (volunteer) => volunteer.location === locationFilter
            );
        }

        if (typeFilter) {
            tempVolunteers = tempVolunteers.filter(
                (volunteer) => volunteer.type === typeFilter
            );
        }

        if (industryFilter) {
            tempVolunteers = tempVolunteers.filter(
                (volunteer) => volunteer.industry === industryFilter
            );
        }

        setFilteredVolunteers(tempVolunteers);
        setCurrentPage(1);
    }, [locationFilter, typeFilter, industryFilter, allVolunteers]);

    const handleLocationChange = (e) => setLocationFilter(e.target.value);
    const handleTypeChange = (e) => setTypeFilter(e.target.value);
    const handleIndustryChange = (e) => setIndustryFilter(e.target.value);

    const handleResetFilters = () => {
        setLocationFilter('');
        setTypeFilter('');
        setIndustryFilter('');
        setCurrentPage(1);
    };

    const handleMouseEnter = (id) => setHoveredVolunteerId(id);
    const handleMouseLeave = () => setHoveredVolunteerId(null);

    const handleSave = (id) => alert(`Lưu tình nguyện viên ID: ${id}`);

    const handleApply = (volunteerId) => {
        if (!isLoggedIn || !user || !user.id) {
            alert('Bạn cần đăng nhập để ứng tuyển. Vui lòng đăng nhập trước.');
            return;
        }
        const userId = user.id; 

        navigate(`/volunteer-register/${userId}/${volunteerId}`);
    };

    if (loading) {
        return <div>Đang tải dữ liệu tình nguyện viên...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div>
            <div className={cx('banner-slider')}>
              <div className={cx('slides')}>
                  <BannerCarousel images={banners}/>
              </div>
              <button className={cx('prev')} onClick={() => { /* prevSlide logic */ }}>
                ❮
              </button>
              <button className={cx('next')} onClick={() => { /* nextSlide logic */ }}>
                ❯
              </button>
              <div className={cx('dots')}>
                <span className={cx('dot', 'active')} onClick={() => { /* currentSlide logic */ }}></span>
                <span className={cx('dot')} onClick={() => { /* currentSlide logic */ }}></span>
                <span className={cx('dot')} onClick={() => { /* currentSlide logic */ }}></span>
              </div>
            </div>
            <div className={cx('du-an-container')}>
              <h2 className={cx('du-an-title')}>DỰ ÁN CỘNG ĐỒNG</h2>
              <p className={cx('du-an-text')}>
                Dự án cộng đồng nhằm kết nối và phát huy sức mạnh tập thể để giải quyết
                những vấn đề chung của xã hội. Thông qua việc huy động sự tham gia của các
                cư dân, doanh nghiệp, tổ chức phi lợi nhuận và chính quyền, dự án cộng
                đồng không chỉ mang lại lợi ích thiết thực như cải thiện cảnh quan, nâng
                cao chất lượng giáo dục – y tế – môi trường, mà còn thúc đẩy tinh thần
                đoàn kết, trách nhiệm và sáng tạo trong mỗi thành viên tham gia.
              </p>
              <p className={cx('du-an-text')}>
                Hãy cùng chung tay vì dự án cộng đồng của chúng ta! Dù bạn có kỹ năng, thời
                gian hay chỉ là tấm lòng nhiệt huyết, mỗi hành động nhỏ hôm nay đều góp
                phần tạo nên sự thay đổi tích cực cho ngày mai. Tham gia ngay để lan tỏa
                yêu thương và xây dựng giá trị bền vững cho cộng đồng và chính bạn.
              </p>
            </div>
            <div className={cx('search')}>
              <input type="text" id="searchInput" placeholder="Tìm kiếm..." />
            </div>
            <div className={cx('filter')}>
              <select id="locationFilter" value={locationFilter} onChange={handleLocationChange}>
                <option value="">Địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP.Hồ Chí Minh">TP.Hồ Chí Minh</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="An Giang">An Giang</option>
              </select>
              <select id="typeFilter" value={typeFilter} onChange={handleTypeChange}>
                <option value="">Loại hình</option>
                <option value="Thuộc chính phủ">Thuộc chính phủ</option>
                <option value="Phi chính phủ">Phi chính phủ</option>
              </select>
              <select id="industryFilter" value={industryFilter} onChange={handleIndustryChange}>
                <option value="">Ngành</option>
                <option value="Xây dựng">Xây dựng</option>
                <option value="Giáo dục">Giáo dục</option>
                <option value="Môi trường">Môi trường</option>
                <option value="Y tế">Y tế</option>
              </select>
              <button id="resetBtn" onClick={handleResetFilters}>Reset</button>
            </div>
            <p className={cx('note')}>Gợi ý: Di chuột vào tên dự án để xem mô tả chi tiết.</p>
            <div className={cx('cardContainer')}>
                {currentVolunteers.length > 0 ? (
                    currentVolunteers.map(item => (
                        <div key={item.volunteerID} className={cx('card')}>
                            <img src={item.imageURL} alt={item.title} />

                            <h3
                                onMouseEnter={() => handleMouseEnter(item.volunteerID)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.title}
                                {hoveredVolunteerId === item.volunteerID && (
                                    <div className={cx('tooltip')}>
                                        <p><strong>Mô tả:</strong> {(item.description || 'N/A').replace(/\\n/g, '\n')}</p>
                                        <p><strong>Yêu cầu kỹ năng:</strong> {(item.skillsRequired || 'N/A').replace(/\\n/g, '\n')}</p>
                                        <p><strong>Ngày đăng:</strong> {new Date(item.datePosted).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                )}
                            </h3>

                            <p>Địa điểm: {item.location}</p>
                            <p>Ngành: {item.industry}</p>
                            <p>Loại hình: {item.type}</p>

                            <div className={cx('button-container')}>
                                <button className={cx('save-btn')} onClick={() => handleSave(item.volunteerID)}>Lưu</button>
                                <button className={cx('apply-btn')} onClick={() => handleApply(item.volunteerID)}>Ứng tuyển</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có hoạt động tình nguyện nào.</p>
                )}
            </div>
            <div className={cx('controls')}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1} id="prevBtn">←</button>
              <button id="nextBtn" onClick={handleNextPage}
                disabled={currentPage === totalPages}>→</button>
            </div>
            <h1>Các doanh nghiệp tài trợ</h1>
            <div className={cx('top-companies-logos')}>
              <img
                src="https://inkythuatso.com/uploads/images/2021/10/logo-vinfast-inkythuatso-21-11-08-55.jpg"
                alt="Vinfast"
              />
              <img
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                alt="VNPay"
              />
              <img
                src="https://ibrand.vn/wp-content/uploads/2022/10/NDTH-Vietcombank-3-min.png"
                alt="VCB"
              />
              <img
                src="https://cdn.mos.cms.futurecdn.net/v2/t:0,l:420,cw:1080,ch:1080,q:80,w:1080/WpcTavg99b5XpK6STzSLZ8.jpg"
                alt="Toyota"
              />
              <img
                src="https://static.vecteezy.com/system/resources/previews/019/136/325/non_2x/apple-logo-apple-icon-free-free-vector.jpg"
                alt="Apple"
              />
              <img
                src="https://career.fpt-software.com/wp-content/themes/jobcareer/fpt_landing_page/taste-vietnam/images/user/11125/Logo_fpt_software.png"
                alt="FPT"
              />
            </div>
        </div>
    );
}

export default Volunteer;