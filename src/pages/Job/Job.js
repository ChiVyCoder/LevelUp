import React, { useEffect, useState, useCallback, useContext } from 'react';
import styles from './Job.module.scss';
import classNames from 'classnames/bind';
import { getAllJobs } from '../../services/jobService.js';
import images from '../../assets/images.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.js';

const cx = classNames.bind(styles);

function Job() {
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    const [currentPage, setCurrentPage] = useState(0); 
    const [hoveredJobId, setHoveredJobId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterNganh, setFilterNganh] = useState('');
    const [filterLuong, setFilterLuong] = useState('');
    const [filterHocVan, setFilterHocVan] = useState('');
    const [filterHinhThuc, setFilterHinhThuc] = useState('');
    const [filterCapBac, setFilterCapBac] = useState('');
    const [filterKinhNghiem, setFilterKinhNghiem] = useState('');

    const jobsPerPage = 9;
    const navigate = useNavigate();
    const { user, isLoggedIn } = useContext(AuthContext); 
    
    useEffect(() => {
        const fetchJobsData = async () => {
            try {
                setLoading(true); 
                const data = await getAllJobs();
                setAllJobs(data);
                setFilteredJobs(data);
            } catch (err) {
                setError(err.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchJobsData(); 
    }, []); 

    const handleApply = (jobId) => {
        if (!isLoggedIn || !user || !user.id) { 
            alert('Bạn cần đăng nhập để ứng tuyển. Vui lòng đăng nhập trước.');
            navigate('/login'); 
            return;
        }
        const userId = user.id;
        navigate(`/intership-register/${userId}/${jobId}`);
    };
    
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const startIndex = currentPage * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const currentJobs = filteredJobs.slice(startIndex, endIndex);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const prevPage = () => {
        setCurrentPage(prev => Math.max(0, prev - 1));
    };

    const nextPage = () => {
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1)); 
    };

    useEffect(() => {
        if (!allJobs.length && !searchTerm && !filterNganh && !filterLuong && !filterHocVan && !filterHinhThuc && !filterCapBac && !filterKinhNghiem) {
            setFilteredJobs([...allJobs]);
            return; 
        }

        let tempJobs = [...allJobs];

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            tempJobs = tempJobs.filter(job =>
                job.companyName.toLowerCase().includes(lowerCaseSearchTerm) ||
                job.location.toLowerCase().includes(lowerCaseSearchTerm) ||
                (job.industry && job.industry.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (job.salary && job.salary.toLowerCase().includes(lowerCaseSearchTerm)) || 
                (job.jobType && job.jobType.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        if (filterNganh && filterNganh !== 'Ngành') {
            tempJobs = tempJobs.filter(job =>
                job.industry && job.industry.toLowerCase() === filterNganh.toLowerCase()
            );
        }

        if (filterLuong && filterLuong !== 'Lương') {
            tempJobs = tempJobs.filter(job =>
                job.salary && job.salary.toLowerCase().includes(filterLuong.toLowerCase())
            );
        }

        if (filterHocVan && filterHocVan !== 'Học vấn') {
            tempJobs = tempJobs.filter(job =>
                job.educationLevel && job.educationLevel.toLowerCase().includes(filterHocVan.toLowerCase())
            );
        }

        if (filterHinhThuc && filterHinhThuc !== 'Hình thức') {
            tempJobs = tempJobs.filter(job =>
                job.jobType && job.jobType.toLowerCase() === filterHinhThuc.toLowerCase()
            );
        }

        if (filterCapBac && filterCapBac !== 'Cấp bậc') {
            tempJobs = tempJobs.filter(job =>
                job.level && job.level.toLowerCase().includes(filterCapBac.toLowerCase())
            );
        }

        if (filterKinhNghiem && filterKinhNghiem !== 'Kinh nghiệm') {
            tempJobs = tempJobs.filter(job =>
                job.experience && job.experience.toLowerCase().includes(filterKinhNghiem.toLowerCase())
            );
        }

        setFilteredJobs(tempJobs);
        setCurrentPage(0);

    }, [searchTerm, filterNganh, filterLuong, filterHocVan, filterHinhThuc, filterCapBac, filterKinhNghiem, allJobs]);
    
    const handleFilterChange = useCallback((e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'nganh':
                setFilterNganh(value);
                break;
            case 'luong':
                setFilterLuong(value);
                break;
            case 'hocvan':
                setFilterHocVan(value);
                break;
            case 'hinhthuc':
                setFilterHinhThuc(value);
                break;
            case 'capbac':
                setFilterCapBac(value);
                break;
            case 'kinhnghiem':
                setFilterKinhNghiem(value);
                break;
            default:
                break;
        }
    }, []);

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterNganh('');
        setFilterLuong('');
        setFilterHocVan('');
        setFilterHinhThuc('');
        setFilterCapBac('');
        setFilterKinhNghiem('');
        setCurrentPage(0);
        setFilteredJobs([...allJobs]);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleMouseEnter = (jobId) => {
        setHoveredJobId(jobId);
    };

    const handleMouseLeave = () => {
        setHoveredJobId(null);
    };

    if (loading) {
        return <div>Đang tải dữ liệu công việc...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div>
            <div className={cx('banner')}>
                <div className={cx('banner-text')}>CƠ HỘI THỰC TẬP</div>
            </div>

            <div className={cx('search-container')}>
                <input 
                    type="text" 
                    id="search" 
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearchChange} 
                />
            </div>
            
            <div className={cx('filters')}>
                <button className={cx('resetFilters')} onClick={handleResetFilters}>Reset</button>
                <select id="nganh" value={filterNganh} onChange={handleFilterChange}>
                    <option value="" disabled>Ngành</option>
                    <option>CNTT</option>
                    <option>Marketing</option>
                    <option>Thiết kế</option>
                    <option>Kinh tế</option>
                    <option>Sáng tạo nội dung</option>
                </select>

                <select id="luong" value={filterLuong} onChange={handleFilterChange}>
                    <option value="" disabled>Lương</option>
                    <option>10 triệu</option>
                    <option>15 triệu</option>
                    <option>20 triệu</option>
                    <option>25 triệu</option>
                </select>

                <select id="hocvan" value={filterHocVan} onChange={handleFilterChange}>
                    <option value="" disabled>Học vấn</option>
                    <option>Không yêu cầu</option>
                    <option>Cao đẳng</option>
                    <option>Đại học</option>
                </select>

                <select id="hinhthuc" value={filterHinhThuc} onChange={handleFilterChange}>
                    <option value="" disabled>Hình thức</option>
                    <option>Part-time</option>
                    <option>Full-time</option>
                </select>

                <select id="capbac" value={filterCapBac} onChange={handleFilterChange}>
                    <option value="" disabled>Cấp bậc</option>
                    <option>Nhân viên</option>
                    <option>Trưởng phòng</option>
                    <option>Quản lý</option>
                </select>

                <select id="kinhnghiem" value={filterKinhNghiem} onChange={handleFilterChange}>
                    <option value="" disabled>Kinh nghiệm</option>
                    <option>Không yêu cầu</option>
                    <option>6 tháng</option>
                    <option>1-3 năm</option>
                    <option>Trên 3 năm</option>
                </select>
            </div>

            <div className={cx('hint-text')}>
                Gợi ý: di chuột vào tên doanh nghiệp để biết thêm chi tiết
            </div>
            <div className={cx('job-list-title')}>Danh sách việc làm</div>
            <div className={cx('job-section')}>
            </div>

            <div className={cx('main-wrapper')}>
                <button className={cx('nav-button', 'nav-left')}
                        onClick={prevPage}
                        disabled={currentPage === 0} >
                    &#60;         
                </button>
                <button className={cx('nav-button', 'nav-right')}
                        onClick={nextPage}
                        disabled={currentPage === totalPages - 1 || allJobs.length === 0} >
                    &#62;
                </button>

                <div className={cx('card-container')} id="cardContainer">
                    {currentJobs.length > 0 ? (
                        currentJobs.map(job => (
                            <div key={job.jobID} className={cx('job-card')}>
                                <img src={job.logoURL} alt="logo" className={cx('card-logo')} />
                                <div className={cx('job-info')}>
                                    <div
                                        className={cx('company-name')}
                                        onMouseEnter={() => handleMouseEnter(job.jobID)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {job.companyName}
                                        {hoveredJobId === job.jobID && (
                                            <div className={cx('tooltip')}>
                                                {(job.tooltip || 'Không có thông tin chi tiết.').replace(/\\n/g, '\n')}
                                            </div>
                                        )}
                                    </div>
                                    <div>Địa điểm: {job.location}</div>
                                    <div className={cx('salary')}>
                                        <span>Lương: {job.salary}</span>
                                        <button title="Lưu" className={cx('save-button')}>
                                            <FontAwesomeIcon icon={faBookmark} />
                                        </button>
                                    </div>
                                    <div>Ngành: {job.industry}</div>
                                    <div>Hình thức: {job.jobType}</div>
                                    <button 
                                        onClick={() => handleApply(job.jobID)} 
                                        className={cx('apply-button')}
                                    >
                                        Ứng tuyển
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={cx('no-jobs-message')}>Không có công việc nào để hiển thị.</p>
                    )}     
                </div>
            </div>

            <div className={cx('top-companies-section')}>
                <h2 className={cx('section-title')}>Các doanh nghiệp hàng đầu</h2>
                <div className={cx('top-companies-logos')}>
                    <img
                        src="https://inkythuatso.com/uploads/images/2021/10/logo-vinfast-inkythuatso-21-11-08-55.jpg"
                        alt="Vinfast"
                    />
                    <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzCZn-leAnYIeMivjXCm2bPuFhwEaJKl5VyQ&s"
                        alt="P/S"
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
                        src="https://gigamall.com.vn/data/2021/03/26/15385835_LOGO-VIETTIEN-900X900_thumbnail.png"
                        alt="VietTien"
                    />
                    <img
                        src="https://career.fpt-software.com/wp-content/themes/jobcareer/fpt_landing_page/taste-vietnam/images/user/11125/Logo_fpt_software.png"
                        alt="FPT"
                    />
                </div>
            </div>

            <h3 className={cx('job-titles')}>Tại sao nên chọn chúng tôi?</h3>
            <p className={cx('intro-text')}>
                Level Up xây dựng một nền tảng tuyển dụng minh bạch, hiệu quả và đáng tin
                cậy – nơi mọi tin đăng đều được kiểm duyệt kỹ lưỡng, mọi ứng viên đều có cơ
                hội tiếp cận những công việc chất lượng từ các doanh nghiệp uy tín. Với
                giao diện thân thiện, công cụ lọc thông minh và đội ngũ hỗ trợ tận tâm,
                chúng tôi luôn đồng hành cùng bạn trên hành trình tìm việc – tuyển người,
                giúp tiết kiệm thời gian và đạt hiệu quả cao nhất. Hãy để chúng tôi là
                chiếc cầu nối giúp bạn chạm gần hơn đến thành công."
            </p>

            <div className={cx('poster')}>
                <a href="https://vnr500.com.vn/Charts/Index?chartId=1&year=2024" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://cms.vietnamreport.net//source/Adv/3_Banner_Profit500.png"
                        alt="Poster quảng cáo"
                    />
                </a>
            </div>

            <h2 className={cx('guide-title')}>Cẩm nang tìm việc làm</h2>
            <div className={cx('guide-container')}>
                <div className={cx('guide-card')}>
                    <img
                        src="https://www.topcv.vn/vi/mau-cv-hien-dai-6.webp?v=3.2"
                        alt="Mẫu CV"
                    />
                    <div className={cx('guide-card-content')}>
                        <h3 className={cx('job-titles')}>Top những mẫu CV đẹp</h3>
                        <a
                            href="https://www.topcv.vn/mau-cv"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('guide-button')}
                        >
                            Xem thêm
                        </a>
                    </div>
                </div>

                <div className={cx('guide-card')}>
                    <img
                        src="https://images.careerviet.vn/content/images/21%205.png"
                        alt="Phỏng vấn"
                    />
                    <div className={cx('guide-card-content')}>
                        <h3 className={cx('job-titles')}>10 tips phỏng vấn thành công</h3>
                        <a
                            href="https://glints.com/vn/blog/ky-nang-tra-loi-phong-van-xin-viec/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('guide-button')}
                        >
                            Xem thêm
                        </a>
                    </div>
                </div>

                <div className={cx('guide-card')}>
                    <img
                        src="https://danang.luatduonggia.vn/wp-content/uploads/2023/04/Bo-luat-lao-dong-2019-3-1-1024x620.jpg"
                        alt="Luật lao động"
                    />
                    <div className={cx('guide-card-content')}>
                    <h3>Bộ luật lao động năm 2019</h3>
                    <a
                        href="https://thuvienphapluat.vn/van-ban/Lao-dong-Tien-luong/Bo-Luat-lao-dong-2019-333670.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cx('guide-button')}
                    >
                        Xem thêm
                    </a>
                    </div>
                </div>

                <div className={cx('guide-card')}>
                    <img
                        src="https://biu.edu.vn/wp-content/uploads/2023/12/Cach-ap-dung-ikigai-trong-dinh-huong-nghe-nghiep-1.png"
                        alt="Định hướng"
                    />
                    <div className={cx('guide-card-content')}>
                        <h3>Định hướng nghề Ikigai</h3>
                        <a
                            href="https://biu.edu.vn/dinh-huong-nghe-nghiep-de-dang-hon-bang-phuong-phap-ikigai/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cx('guide-button')}
                        >
                            Xem thêm
                        </a>
                    </div>
                </div>

                <div className={cx('guide-card')}>
                    <img
                        src="https://static1.cafeland.vn/cafelandData/upload/tintuc/khoinghiep/2020/02/tuan-03/cohoikhoinghiep-1582277136.jpg"
                        alt="Sức khoẻ"
                    />
                    <div className={cx('guide-card-content')}></div>
                    <h3>Quan tâm chăm sóc sức khoẻ</h3>
                    <a
                        href="https://nhathuoclongchau.com.vn/bai-viet/cach-tu-cham-soc-giu-gin-suc-khoe-moi-ngay.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cx('guide-button')}
                    >
                        Xem thêm
                    </a>
                </div>
            </div>
        </div>
    );
}
export default Job;