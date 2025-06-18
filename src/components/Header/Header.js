import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { useContext, useEffect, useState } from 'react';
import logo from '../../assets/img/logoLU.jpg';
import { AuthContext } from '../../context/AuthContext';

const cx = classNames.bind(styles);

function Header () {
    const { user, isLoggedIn } = useContext(AuthContext);
    const userId = user ? user.id : null; 
    
    const location = useLocation(); 
    const [activeLinkPath, setActiveLinkPath] = useState(location.pathname);
    

    useEffect(() => {
        setActiveLinkPath(location.pathname);
    }, [location.pathname]);

    const handleLogoClick = () => {
        console.log("Clicked on logo, navigating to home.");
    };

    return (
        <header className={cx('header')}>
            <Link onClick={handleLogoClick} to="/"> 
                <div className={cx('logo')}>
                    <img src={logo} alt="LevelUp Logo" />
                </div>
            </Link>
            <nav className={cx('nav-links')}>
                <Link 
                    className={cx({ 'nav-active': activeLinkPath === '/' })} 
                    to="/"
                >
                    Trang chủ
                </Link>
                <Link 
                    className={cx({ 'nav-active': activeLinkPath === '/course' 
                        || activeLinkPath === `/users/${userId}/courses/1`
                        || activeLinkPath === `/users/${userId}/courses/2`
                        || activeLinkPath === `/users/${userId}/courses/3`
                        || activeLinkPath === `/users/${userId}/courses/4`
                    })} 
                    to="/course"
                >
                    Khóa học
                </Link>
                <Link 
                    className={cx({ 'nav-active': activeLinkPath === '/job' || activeLinkPath === '/opportunity' || activeLinkPath === '/volunteer'})} 
                    to="/opportunity"
                >
                    Cơ hội
                </Link>
                {isLoggedIn ? (
                    <>
                        <Link 
                            className={cx({ 'nav-active': activeLinkPath === `/profile/${userId}` })} 
                            to={`/profile/${userId}`}
                        >
                            Hồ sơ
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/register" style={{marginLeft: '10px'}}>Đăng ký</Link>
                    </>
                )}
            </nav>
        </header> 
    )
}

export default Header;