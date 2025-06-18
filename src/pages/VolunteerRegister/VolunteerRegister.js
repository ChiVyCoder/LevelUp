// Thay đổi trong file React của bạn (Ví dụ: VolunteerRegister.js)
import React, { useEffect } from 'react';
import styles from './VolunteerRegister.module.scss';
import classNames from 'classnames/bind';
import Validator from '../../utils/validateUtil.js';
import images from '../../assets/images.js';
import { useParams } from 'react-router-dom'; 

const cx = classNames.bind(styles);

function VolunteerRegister() {
  const { userId, volunteerId } = useParams(); 

  useEffect(() => {
    Validator({
      form: "#form",
      errorElement: `.${cx('form-message')}`,
      formGroupSelector: `.${cx('formGroup')}`,
      rules: [
        Validator.isRequired("#fullname", "Vui lòng nhập họ và tên"),
        Validator.isRequired("#phone", "Vui lòng nhập số điện thoại"),
        Validator.isRequired("#email", "Vui lòng nhập email"),
        Validator.isRequiredTextarea("#skills", "Vui lòng nhập thông tin"),
        Validator.isRequiredTextarea("#reason", "Vui lòng nhập thông tin"),
        Validator.isRequired('input[name="gender"]', "Vui lòng chọn giới tính"),
        Validator.isEmail("#email", "Email không hợp lệ"),
      ],
      onSubmit: function (data) {
        console.log('Form hợp lệ, dữ liệu gửi về server:', data);
        sendVolunteerApplication(data);
      }
    });
  }, []);

  const sendVolunteerApplication = async (formData) => {
    // Kiểm tra xem đã lấy được userId và volunteerId từ URL chưa
    if (!userId || !volunteerId) {
      alert("Thiếu ID người dùng hoặc ID hoạt động tình nguyện trong URL.");
      return;
    }

    const payload = {
      // payload chỉ chứa thông tin form, userId và volunteerId sẽ được gửi qua URL
      fullname: formData.fullname,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      reason: formData.reason,
      skills: formData.skills,
    };

    try {
      // <<-- CẬP NHẬT URL API để bao gồm cả userId và volunteerId
      const response = await fetch(`https://localhost:7208/api/volunteer-applications/${userId}/${volunteerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Đăng ký tình nguyện thành công:', responseData);
        alert('Đăng ký tình nguyện thành công!');
        // ... (có thể chuyển hướng hoặc reset form)
      } else {
        console.error('Đăng ký tình nguyện thất bại:', responseData);
        alert(`Đăng ký thất bại: ${responseData.message || JSON.stringify(responseData)}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu đăng ký:', error);
      alert('Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng kiểm tra console.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img className={cx('form-logo')} src={images.logoLU} alt='Logo'/>
      <h1>Đăng ký tham gia tình nguyện</h1>
      {/* Hiển thị ID để kiểm tra trong demo */}
      {userId && volunteerId && <p>Bạn đang đăng ký cho hoạt động **{volunteerId}** dưới tên người dùng **{userId}**</p>}
      <form id="form" className={styles.loginForm}>
        {/* ... các trường input form ... */}
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
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" className={cx('formControl')} />
          <span className={cx('form-message')}></span>
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="reason">Lý do tham gia:</label>
          <textarea name="reason" id='reason' className={cx('formControl')}></textarea>
          <span className={cx('form-message')}></span>
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="skills">Kỹ năng có thể đóng góp:</label>
          <textarea name="skills" id='skills' className={cx('formControl')}></textarea>
          <span className={cx('form-message')}></span>
        </div>
        <button type="submit" className={cx('submitButton')}>Đăng ký</button>
      </form>
    </div>
  );
}

export default VolunteerRegister;