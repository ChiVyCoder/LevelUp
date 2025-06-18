import React, { useEffect, useState } from 'react';
import styles from './IntershipRegister.module.scss';
import classNames from 'classnames/bind';
import Validator from '../../utils/validateUtil.js';
import images from '../../assets/images.js';
import { useParams, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function InternshipRegister() {
  const [errorMessage, setErrorMessage] = useState('');
  const { userId, jobId } = useParams(); // Lấy userId và jobId từ URL
  const navigate = useNavigate();

  useEffect(() => {
    const formElement = document.querySelector("#form");
    if (formElement) {
      Validator({
        form: "#form",
        errorElement: `.${cx('form-message')}`,
        formGroupSelector: `.${cx('formGroup')}`,
        rules: [
          Validator.isRequired("#fullname", "Vui lòng nhập họ và tên"),
          Validator.isRequired("#phone", "Vui lòng nhập số điện thoại"),
          Validator.isRequired('input[name="gender"]', "Vui lòng chọn giới tính"),
          Validator.isRequiredDate("#date", "Vui lòng chọn ngày sinh"),
          Validator.isRequired("#email", "Vui lòng nhập email"),
          Validator.isEmail("#email", "Email không hợp lệ"),
        ],
        onSubmit: async function (data) {
          console.log('Form hợp lệ, dữ liệu thu thập từ Validator:', data);
          setErrorMessage('');

          try {
            const applicationData = {
              fullName: data.fullname,
              phone: data.phone,
              gender: data.gender,
              dateOfBirth: data.date,
              email: data.email,
            };

            const response = await fetch(`https://localhost:7208/api/internship-applications/${userId}/${jobId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(applicationData),
            });

            const responseData = await response.json();

            if (response.ok) {
              alert(responseData.message || 'Đăng ký thông tin thực tập thành công!');
              navigate(`/profile/${userId}`);
            } else {
              setErrorMessage(responseData.message || 'Đăng ký thông tin thực tập thất bại. Vui lòng thử lại.');
              console.error('Lỗi API đăng ký:', responseData);
            }
          } catch (apiError) {
            setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối.');
            console.error('Lỗi kết nối:', apiError);
          }
        }
      });
    }
  }, [userId, jobId, navigate]);

  return (
    <div className={cx('loginContainer')}>
      <img className={cx('form-logo')} src={images.logoLU} alt='Logo' />
      <h1>Đăng ký thực tập</h1>
      {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
      <form id="form" className={styles.loginForm} onSubmit={(e) => e.preventDefault()}>
        <div className={cx('formGroup')}>
          <label htmlFor="fullname">Họ và tên:</label>
          <input type="text" id="fullname" name="fullname" className={cx('formControl')} />
          <span className={cx('form-message')}></span>
        </div>

        <div id="gender-group" className={cx('formGroup')}>
          <label>Giới tính:</label>
          <div className={cx('genderGroup')}>
            <div>
              <input type="radio" name="gender" value="male" className={cx('formControlRadio')} />
              <label>Nam</label>
            </div>
            <div>
              <input type="radio" name="gender" value="female" className={cx('formControlRadio')} />
              <label>Nữ</label>
            </div>
            <div>
              <input type="radio" name="gender" value="other" className={cx('formControlRadio')} />
              <label>Khác</label>
            </div>
          </div>
          <span className={cx('form-message')}></span>
        </div>

        <div className={cx('formGroup')}>
          <label htmlFor="phone">Số điện thoại:</label>
          <input type="text" id="phone" name="phone" className={cx('formControl')} />
          <span className={cx('form-message')}></span>
        </div>

        <div className={cx('formGroup')}>
          <label htmlFor="date">Ngày sinh:</label>
          <input type="date" id="date" name="date" className={cx('formControl')} />
          <span className={cx('form-message')}></span>
        </div>

        <div className={cx('formGroup')}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" className={cx('formControl')} />
          <span className={cx('form-message')}></span>
        </div>

        <button type="submit" className={cx('submitButton')}>Đăng ký</button>
      </form>
    </div>
  );
}

export default InternshipRegister;
