import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Course.module.scss';
import images from '../../assets/images.js';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.js';
const cx = classNames.bind(styles);

function Course () {
const { user: currentUser, logout } = useContext(AuthContext);


    return (
        <div className={cx('wrapper')}>
                <div className={cx('title-box')}>
                <h1 className={cx('title')}>LevelUp - NỀN TẢNG HỌC KỸ NĂNG VÀ CƠ HỘI THỰC TẾ</h1>
                </div>
            <div className={cx('cards')}>
                <div className={cx('card')}>
                    <div className={cx('card-header')}>
                        <img
                        src="https://khoahocdoanhnghiep.edu.vn/uploads/khoa-hoc-ky-nang-giao-tiep-tot_1667669720.jpg"
                        alt="Giao tiếp"
                        />
                    </div>
                    <div className={cx('card-info')}>
                    <h3>Kỹ năng giao tiếp</h3>
                    <div className={cx('price', 'free')}>Miễn phí</div>
                    <Link to={`/users/${currentUser.id}/courses/1`}><button>Bắt đầu học</button></Link>
                    </div>
                </div>

                <div className={cx('card')}>
                    <div className={cx('card-header')}>
                        <img
                        src="https://glints.com/vn/blog/wp-content/uploads/2021/10/ky-nang-thuyet-trinh.jpg"
                        alt="Thuyết trình"
                        />
                    </div>             
                    <div className={cx('card-info')}>
                    <h3>Kỹ năng thuyết trình</h3>
                    <div className={cx('price')}>Giá: 249.000đ</div>
                    <Link to={`/users/${currentUser.id}/courses/2`}><button>Bắt đầu học</button></Link>
                    </div>
                </div>

                <div className={cx('card')}>
                    <div className={cx('card-header')}>
                        <img
                        src="https://mikotech.vn/wp-content/uploads/2023/09/bootstrap-html-css-js.png"
                        alt="Kỹ năng chuyên ngành"
                        />
                    </div>
                    <div className={cx('card-info')}>
                    <h3>KNCN: HTML - CSS - JavaScript</h3>
                    <div className={cx('price')}>Giá: 299.000đ</div>
                    <Link to={`/users/${currentUser.id}/courses/3`}><button>Bắt đầu học</button></Link>
                    </div>
                </div>

                <div className={cx('card', 'design-card')}>
                    <div className={cx('card-header')}>
                        <img
                        src="https://hrchannels.com/uptalent/attachments/images/20230314/110209068_chuyen-vien-thiet-ke-do-hoa-5.jpg"
                        alt="Kỹ năng chuyên ngành"
                        />
                    </div>
                    <div className={cx('card-info')}>
                    <h3>KNCN: Thiết kế</h3>
                    <div className={cx('price')}>Giá: 325.000đ</div>
                    <Link to={`/users/${currentUser.id}/courses/4`}><button>Bắt đầu học</button></Link>
                    </div>
                </div>

                <div className={cx('card', 'design-card')}>
                    <div className={cx('card-header')}>
                        <img
                        src={images.tinHoc}
                        alt="Kỹ năng chuyên ngành"
                        />
                    </div>
                    <div className={cx('card-info')}>
                    <h3>Kỹ năng tin học văn phòng</h3>
                    <div className={cx('price', 'free')}>Miễn phí</div>
                    <button>Comming soon !</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course