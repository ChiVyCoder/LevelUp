// src/pages/Profile/Profile.js
import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { getVolunteerApplicationsByUserId } from '../../services/volunteerApplicationService';
import { getUserProfile} from '../../services/userService'; 
import { getInternshipApplicationsByUserId } from '../../services/internshipRegistrationService'; 
import { getUserCompletedCourses, finishCourse } from '../../services/userCourseService'; 
import { AuthContext } from '../../context/AuthContext';

const cx = classNames.bind(styles);

function Profile() {
    const { user: currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id: urlUserId } = useParams();

    const displayUserId = urlUserId ? parseInt(urlUserId) : (currentUser ? currentUser.id : null);

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('courses');

    const [registeredVolunteers, setRegisteredVolunteers] = useState([]);
    const [loadingVolunteers, setLoadingVolunteers] = useState(false);
    const [errorVolunteers, setErrorVolunteers] = useState('');

    
    const [registeredInternships, setRegisteredInternships] = useState([]);
    const [loadingInternships, setLoadingInternships] = useState(false);
    const [errorInternships, setErrorInternships] = useState('');

    const [completedCourses, setCompletedCourses] = useState([]);
    const [loadingCompletedCourses, setLoadingCompletedCourses] = useState(false);
    const [errorCompletedCourses, setErrorCompletedCourses] = useState('');
    useEffect(() => {
        const fetchProfile = async () => {
            if (!displayUserId) {
                setLoading(false);
                setError('Không tìm thấy ID người dùng để hiển thị hồ sơ.');
                return;
            }

            try {
                setLoading(true);
                setError('');
                const data = await getUserProfile(displayUserId);
                setProfileData(data);
            } catch (err) {
                console.error("Lỗi khi tải hồ sơ:", err);
                setError('Không thể tải dữ liệu hồ sơ.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [displayUserId]);

    // LẤY DỮ LIỆU ĐĂNG KÝ TÌNH NGUYỆN
    useEffect(() => {
        const fetchVolunteerApps = async () => {
            if (!displayUserId) {
                return;
            }

            try {
                setLoadingVolunteers(true);
                setErrorVolunteers('');
                const applications = await getVolunteerApplicationsByUserId(displayUserId);
                setRegisteredVolunteers(applications);
            } catch (err) {
                console.error("Lỗi khi tải hoạt động tình nguyện đã đăng ký:", err);
                setErrorVolunteers('');
                setRegisteredVolunteers([]);
            } finally {
                setLoadingVolunteers(false);
            }
        };

        fetchVolunteerApps();
    }, [displayUserId]);

    //useEffect ĐỂ LẤY DỮ LIỆU ĐĂNG KÝ THỰC TẬP
    useEffect(() => {
        const fetchInternshipApps = async () => {
            if (!displayUserId) {
                return;
            }

            try {
                setLoadingInternships(true);
                setErrorInternships('');
                const applications = await getInternshipApplicationsByUserId(displayUserId);
                setRegisteredInternships(applications);
            } catch (err) {
                console.error("Lỗi khi tải thực tập đã đăng ký:", err);
                setErrorInternships('');
                setRegisteredInternships([]);
            } finally {
                setLoadingInternships(false);
            }
        };

        fetchInternshipApps();
    }, [displayUserId]);

    // useEffect ĐỂ LẤY DỮ LIỆU HOÀN THÀNH KHÓA HỌC
    const courseNamesMap = {
        1: 'Khóa học Giao tiếp',
        2: 'Khóa học Kỹ năng thuyết trình',
        3: 'Khóa học HTML, CSS, JAVASCRIPT',
        4: 'Khóa học Thiết kế',
    };
  useEffect(() => {
        const fetchCompletedCourses = async () => {
            if (!displayUserId) return;
            try {
                setLoadingCompletedCourses(true);
                setErrorCompletedCourses('');
                const courses = await getUserCompletedCourses(displayUserId);
                setCompletedCourses(courses);
            } catch (err) {
                console.error("Lỗi khi tải khóa học đã hoàn thành:", err);
                setErrorCompletedCourses('Không thể tải danh sách khóa học đã hoàn thành.');
                setCompletedCourses([]);
            } finally {
                setLoadingCompletedCourses(false);
            }
        };
        fetchCompletedCourses();
    }, [displayUserId]);


    if (loading) {
        return <div className={cx('loading')}>Đang tải hồ sơ...</div>;
    }

    if (error) {
        return <div className={cx('error')}>Lỗi: {error}</div>;
    }

    if (!profileData) {
        return (
            <div className={cx('noData')}>
                Không có dữ liệu hồ sơ để hiển thị. Vui lòng kiểm tra ID người dùng hoặc
                <button onClick={() => navigate('/login')}>Đăng nhập</button>
            </div>
        );
    }    

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const defaultAvatar = "https://blog.cpanel.com/wp-content/uploads/2019/08/user-01.png";
    const userAvatar = profileData.avatarUrl || currentUser?.AvatarUrl || defaultAvatar;

    return (
        <div className={cx('card')} role="region" aria-label="Thông tin hồ sơ cá nhân">
            <div className={cx('left-panel')}>
                <div className={cx('avatar-wrapper')} tabIndex="0" aria-label="Ảnh đại diện">
                    <img className={cx('avatar')} src={userAvatar} alt={`Ảnh đại diện của ${profileData.username || profileData.email}`} />
                    <div className={cx('badge-premium')} aria-label="Thành viên Premium">
                        PREMIUM
                    </div>
                </div>
                <div className={cx('stars')} aria-label="Đánh giá 4 trên 5 sao" tabIndex="0">
                    <p>⭐⭐⭐⭐⭐</p>
                </div>
            </div>

            <div className={cx('right-panel')}>
                <div className={cx('name')} tabIndex="0">
                    {profileData.username || profileData.email}
                </div>

                <div className={cx('description')} tabIndex="0">
                    {profileData.bio || "Chưa có mô tả cá nhân."}
                </div>

                <div className={cx('tabs')}>
                    <button
                        className={cx('tab-button', { active: activeTab === 'courses' })}
                        onClick={() => setActiveTab('courses')}
                    >
                        Khóa học đã học
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'volunteers' })}
                        onClick={() => setActiveTab('volunteers')}
                    >
                        Hoạt động đã tham gia
                    </button>
                    <button
                        className={cx('tab-button', { active: activeTab === 'internships' })}
                        onClick={() => setActiveTab('internships')}
                    >
                        Thực tập đã đăng ký
                    </button>
                </div>

                <div className={cx('tab-content')}>
                    {activeTab === 'courses' && (
                        <div>
                            <h2>Các khóa học đã học:</h2>
                            {loadingCompletedCourses ? (
                                <p>Đang tải khóa học đã hoàn thành...</p>
                            ) : errorCompletedCourses ? (
                                <p className={cx('error')}>{errorCompletedCourses}</p>
                            ) : completedCourses.length > 0 ? (
                                <ol className={cx('course-list')}>
                                    {completedCourses.map(course => (
                                        <li key={course.id} className={cx('course-item')}>  
                                            <strong>{courseNamesMap[course.courseId] || `Khóa học ID: ${course.courseId}`}</strong>
                                            <span> - Hoàn thành vào: {new Date(course.enrolledAt).toLocaleDateString('vi-VN')}</span>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>Bạn chưa hoàn thành khóa học nào.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'volunteers' && (
                        <div>
                            <h2>Các hoạt động tình nguyện đã tham gia:</h2>
                            {loadingVolunteers ? (
                                <p>Đang tải danh sách hoạt động...</p>
                            ) : errorVolunteers ? (
                                <p className={cx('error')}>{errorVolunteers}</p>
                            ) : registeredVolunteers.length > 0 ? (
                                <ol className={cx('volunteer-list')}>
                                    {registeredVolunteers.map(app => (
                                        <li key={app.id} className={cx('volunteer-item')}>
                                            <h4 className={cx('volunteer-title')}>{app.volunteer?.title || 'Tên hoạt động không xác định'}</h4>
                                            <p>Ngày đăng ký: {new Date(app.applicationDate).toLocaleDateString('vi-VN')}</p>
                                            <p>Trạng thái: {app.status || 'Đang chờ'}</p>
                                            <p>Địa điểm: {app.volunteer?.location || 'N/A'}</p>
                                            <p>Ngành: {app.volunteer?.industry || 'N/A'}</p>
                                            <p>Loại hình: {app.volunteer?.type || 'N/A'}</p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>Bạn chưa đăng ký hoạt động tình nguyện nào.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'internships' && (
                        <div>
                            <h2>Các cơ hội thực tập đã đăng ký:</h2>
                            {loadingInternships ? (
                                <p>Đang tải danh sách thực tập...</p>
                            ) : errorInternships ? (
                                <p className={cx('error')}>{errorInternships}</p>
                            ) : registeredInternships.length > 0 ? (
                                <ol className={cx('internship-list')}>
                                    {registeredInternships.map(app => (
                                        <li key={app.id} className={cx('internship-item')}>
                                            <p>Ngày đăng ký: {new Date(app.applicationDate).toLocaleDateString('vi-VN')}</p>
                                            <p>Trạng thái: {app.status || 'Đang chờ'}</p>
                                            <p>Công ty: {app.job?.companyName || 'N/A'}</p>
                                            <p>Địa điểm: {app.job?.location || 'N/A'}</p>
                                            <p>Ngành: {app.job?.industry || 'N/A'}</p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <p>Bạn chưa đăng ký cơ hội thực tập nào.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className={cx('social')} aria-label="Mạng xã hội">
                    <a
                        href="https://www.facebook.com/phan.anh.233080"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="Facebook"
                        tabIndex="0"
                        aria-label="Facebook"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                            alt="Facebook icon"
                        />
                    </a>
                    <a
                        href="https://twitter.com/PhanAnh"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="Twitter"
                        tabIndex="0"
                        aria-label="Twitter"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                            alt="Twitter icon"
                        />
                    </a>
                    <a
                        href="https://linkedin.com/in/PhanAnh"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="LinkedIn"
                        tabIndex="0"
                        aria-label="LinkedIn"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                            alt="LinkedIn icon"
                        />
                    </a>
                    <a
                        href="https://github.com/PhanAnh"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-tooltip="GitHub"
                        tabIndex="0"
                        aria-label="GitHub"
                    >
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
                            alt="GitHub icon"
                        />
                    </a>
                </div>

                <button onClick={() => navigate(`/profile/${displayUserId}/edit`)} className={cx('logoutButton')}>
                    Chỉnh sửa hồ sơ
                </button>
                <button onClick={handleLogout} className={cx('logoutButton')}>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}

export default Profile;