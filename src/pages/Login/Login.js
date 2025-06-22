import React, { useEffect, useState, useContext } from 'react';
import styles from './Login.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import Validator from '../../utils/validateUtil.js';
import images from '../../assets/images.js';
import { AuthContext } from '../../context/AuthContext'; 

const cx = classNames.bind(styles);

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  // State để quản lý giá trị input và thông báo lỗi
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Khởi tạo Validator khi component mount
  useEffect(() => {
    const formElement = document.querySelector("#form");
    if (formElement) {
      Validator({
        form: "#form",
        errorElement: `.${cx('form-message')}`,
        formGroupSelector: `.${cx('formGroup')}`,
        rules: [
          Validator.isRequired("#email", "Vui lòng nhập email"),
          Validator.isEmail("#email", "Email không hợp lệ"),
          Validator.isRequired("#password", "Vui lòng nhập mật khẩu"),
        ],
        onSubmit: async function (formValues) {
          setErrorMessage(''); 

          try {
            const response = await fetch('https://localhost:7208/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: formValues.email,
                password: formValues.password, 
              }),
            });

            const responseData = await response.json(); 

            if (response.ok) {
              const userData = responseData.user;
              login(userData); 
              navigate(`/profile/${userData.id}`); 
            } else {
              if (responseData && responseData.message) {
                setErrorMessage(responseData.message);
              } else if (responseData && responseData.errors) {
                let detailedError = '';
                if (responseData.errors.Email) detailedError += `Email: ${responseData.errors.Email.join(', ')}. `;
                if (responseData.errors.Password) detailedError += `Mật khẩu: ${responseData.errors.Password.join(', ')}. `;
                setErrorMessage(detailedError || 'Đăng nhập thất bại. Vui lòng thử lại.');
              } else {
                setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
              }
            }
          } catch (apiError) {
            setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.');
          }
        }
      });
    }
  }, []); 

  // Cập nhật state khi input thay đổi 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img className={cx('form-logo')} src={images.logoLU} alt='Logo'/>
      <h1>Đăng Nhập</h1>
      {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
      <form id="form" className={styles.loginForm} onSubmit={(e) => {
          e.preventDefault(); 
      }}>
        <div className={cx('formGroup')}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className={cx('formControl')}
            value={email}
            onChange={handleInputChange}
          />
          <span className={cx('form-message')}></span>
        </div>

        <div className={cx('formGroup')}>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            name="password"
            className={cx('formControl')}
            value={password}
            onChange={handleInputChange}
          />
          <span className={cx('form-message')}></span>
        </div>
        <div className={cx('toRegister')}>
          <p>Chưa có tài khoản ?</p> <Link to="/register">Đăng ký</Link>
        </div>
        <button type="submit" className={cx('submitButton')}>Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;