import { Link } from 'react-router-dom'
import classNames from 'classnames/bind';
import styles from './Footer.module.scss'
import logo from '../../assets/img/logoLU.jpg'
import facebookLogo from '../../assets/img/facebook-logo.jpg'
import youtubeLogo from '../../assets/img/logo-YouTube.jpg'
import instagramLogo from '../../assets/img/instagram-logo.png'
import tiktokLogo from '../../assets/img/tiktok-logo.png'
const cx = classNames.bind(styles);

function Footer () {
    return (
        <footer className={cx('main-footer')}>
        <div className={cx('footer-item')}>
            <a className={cx('footer-logo-container')}>
            <img className={cx('footer-logo')} src={logo} alt="logoLU" />
            </a>
            <ul className={cx('footer-list')}>
            <li className={cx('footer-list-item')}>Điện thoại: 0916377758</li>
            <li className={cx('footer-list-item')}>Email: s233821@nctu.edu.vn</li>
            <li className={cx('footer-list-item')}>Địa chỉ: Ninh Kiều, Cần Thơ</li>
            </ul>
        </div>
        <div className={cx('footer-item')}>
            <ul className={cx('footer-list')}>
            <h3 className={cx('footer-list-title')}>VỀ CHÚNG TÔI</h3>
            <li className={cx('footer-list-item')}>Vi Trương Gia Hân</li>
            <li className={cx('footer-list-item')}>Phạm Thảo My</li>
            <li className={cx('footer-list-item')}>Phạm Kim Ngân</li>
            <li className={cx('footer-list-item')}>Trần Chí Vỹ</li>
            </ul>
        </div>
        <div className={cx('footer-item')}>
            <ul className={cx('footer-list')}>
            <h3 className={cx('footer-list-title')}>VỀ LEVELUP</h3>
            <li className={cx('footer-list-item')}>Giới thiệu</li>
            <li className={cx('footer-list-item')}>Liên hệ</li>
            <li className={cx('footer-list-item')}>Điều khoản</li>
            <li className={cx('footer-list-item')}>Bảo mật</li>
            </ul>
        </div>
        <div className={cx('footer-item')}>
            <h3 className={cx('footer-list-title')}>KẾT NỐI</h3>
            <ul className={cx('footer-list-socialmedia')}>
            <li className={cx('footer-list-item')}>
                <a href="https://www.youtube.com/" target='_blank'>
                <img
                    className={cx('socialmedia-logo')}
                    src={youtubeLogo}
                    alt="Youtube-logo"
                />
                </a>
            </li>
            <li className={cx('footer-list-item')}>
                <a href="https://www.facebook.com/" target='_blank'>
                <img
                    className={cx('socialmedia-logo')}
                    src={facebookLogo}
                    alt="facebook-logo"
                />
                </a>
            </li>

            <li className={cx('footer-list-item')}>
                <a href="https://www.instagram.com/" target='_blank'>
                <img
                    className={cx('socialmedia-logo')}
                    src={instagramLogo}
                    alt="instagram-logo"
                />
                </a>
            </li>
            <li className={cx('footer-list-item')}>
                <a href="https://www.tiktok.com/" target='_blank'>
                <img
                    className={cx('socialmedia-logo')}
                    src={tiktokLogo}
                    alt="tiktok-logo"
                />
                </a>
            </li>
            </ul>
        </div>
        <p className={cx('copyright')}>
            © 2025 - LevelUp - Bản quyền thuộc về <strong>Nhóm Một</strong> <br/>
            <strong>Sản phẩm này không phải là sản phẩm thương mại.</strong>
        </p>
        </footer>
    )
}

export default Footer;