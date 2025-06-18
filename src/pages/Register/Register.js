import React, { useEffect, useState } from 'react';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import Validator from '../../utils/validateUtil.js';
import images from '../../assets/images.js'
import { Link, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const formElement = document.querySelector("#form");
    if (formElement) {
      Validator({
        form: "#form",
        errorElement: `.${cx('form-message')}`,
        formGroupSelector: `.${cx('formGroup')}`,
        rules: [
          Validator.isRequired("#fullname", "Vui lòng nhập họ và tên"),
          Validator.isRequired("#email", "Vui lòng nhập email"),
          Validator.minLength("#password", 4, "Mật khẩu phải có ít nhất 4 ký tự"),
          Validator.isEmail("#email", "Email không hợp lệ"),
          Validator.isRequired("#password_confirmation", "Vui lòng nhập lại mật khẩu"),
          Validator.isConfirmed("#password_confirmation", function () {
            return document.querySelector("#form #password").value;
          }, "Mật khẩu nhập lại không chính xác"),
        ],
        onSubmit: async function (data) {
          setErrorMessage('');

          try {
            const response = await fetch('https://localhost:7208/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: data.fullname, 
                email: data.email,
                password: data.password,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
              navigate('/login');
            } else {
              const errorData = await response.json();
              setErrorMessage(errorData.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
          } catch (apiError) {
            setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.');
          }
        }
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullname') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'password_confirmation') {
      setPasswordConfirmation(value);
    } 
  };

  return (
    <div className={styles.registerContainer}>
      <img className={cx('form-logo')} src={images.logoLU} alt='Logo'/>
      <h1>Đăng ký tài khoản</h1>
      {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
      <form id="form" className={styles.registerForm}>
        <div className={cx('formGroup')}>
          <label htmlFor="fullname">Họ và tên:</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className={cx('formControl')}
            value={username}
            onChange={handleInputChange}
          />
          <span className={cx('form-message')}></span>
        </div>
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

        <div className={cx('formGroup')}>
          <label htmlFor="password_confirmation">Nhập lại mật khẩu:</label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            className={cx('formControl')}
            value={passwordConfirmation}
            onChange={handleInputChange}
          />
          <span className={cx('form-message')}></span>
        </div>
        <div className={cx('toLogin')}>
          <p>Đã có tài khoản ?</p> <Link to="/login">Đăng nhập</Link>
        </div>
        <button type="submit" className={cx('submitButton')}>Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;