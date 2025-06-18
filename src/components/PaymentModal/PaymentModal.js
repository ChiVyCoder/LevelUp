// components/PaymentModal.js
import React, { useState } from 'react'; // Bỏ useEffect vì không cần fetch ban đầu
import classNames from 'classnames/bind';
import styles from './PaymentModal.module.scss';

const cx = classNames.bind(styles);

function PaymentModal({ course, userId, onClose, onPaymentSuccess }) {
    const [step, setStep] = useState(2); 
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [paymentImage, setPaymentImage] = useState(null); 

    const amount = course.price || 299000; 

    // Dữ liệu giả lập cho QR và thông tin chuyển khoản 
    const qrCodeData = {
        bank: 'ABCBANK',
        accountNumber: '9876543210',
        accountName: 'CONG TY LEVELUP',
        amount: amount.toLocaleString('vi-VN'),
        content: `TTKH-${course.id}-${userId}-${Date.now()}`,
        qrImage: 'https://tse4.mm.bing.net/th?id=OIP.9v1VqeHkVDSQXS63JzU-wAAAAA&pid=Api&P=0&h=220', 
        transactionId: `TXN-${course.id}-${userId}-${Date.now()}` 
    };

    // Hàm lấy file
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentImage(e.target.files[0]);
        }
    };

    const handleSubmitConfirmation = () => {
        if (!paymentImage) {
            setMessage('Vui lòng tải lên ảnh xác nhận thanh toán.');
            return;
        }

        setIsLoading(true);
        setMessage('Đang xử lý thanh toán và xác nhận...');

        setTimeout(() => {
            setIsLoading(false);
            setMessage('Thanh toán thành công! Chuyển hướng đến khóa học...');
            alert('Thanh toán thành công! Bạn đã có quyền truy cập khóa học.');
            
            onPaymentSuccess(course.id);
            onClose(); 
        }, 3000);
    };

    if (!course || !userId) {
        return <div className={cx('modal-backdrop')}>Dữ liệu thanh toán không hợp lệ.</div>;
    }

    return (
        <div className={cx('modal-backdrop')}>
            <div className={cx('modal-content')}>
                <button className={cx('close-button')} onClick={onClose}>&times;</button>
                <h2 className={cx('modal-title')} >Thanh toán khóa học: {course.title}</h2>
                <p className={cx('amount')}>Tổng tiền: {amount.toLocaleString('vi-VN')} VNĐ</p>

                {step === 2 && qrCodeData && (
                    <div className={cx('qr-payment-info')}>
                        <p>Vui lòng chuyển khoản tới thông tin sau:</p>
                        <div className={cx('qr-details')}>
                            <img src={qrCodeData.qrImage} alt="Mã QR thanh toán" className={cx('qr-image')} />
                            <div className={cx('bank-info')}>
                                <p><strong>Ngân hàng:</strong> {qrCodeData.bank}</p>
                                <p><strong>Số tài khoản:</strong> {qrCodeData.accountNumber}</p>
                                <p><strong>Tên tài khoản:</strong> {qrCodeData.accountName}</p>
                                <p><strong>Số tiền:</strong> {qrCodeData.amount} VNĐ</p>
                                <p><strong>Nội dung:</strong> <span className={cx('highlight')}>{qrCodeData.content}</span></p>
                                <p className={cx('instruction')}>
                                    Vui lòng ghi đúng nội dung chuyển khoản. Sau khi chuyển khoản thành công, hãy tải ảnh biên lai/xác nhận lên bên dưới.
                                </p>
                            </div>
                        </div>

                        <hr />

                        <h3>Gửi xác nhận thanh toán</h3>
                        <div className={cx('upload-form')}>
                            <label htmlFor="payment-image">Tải ảnh biên lai/xác nhận thanh toán:</label>
                            <input
                                type="file"
                                id="payment-image"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={isLoading}
                            />
                            {paymentImage && (
                                <p className={cx('file-name')}>Đã chọn file: {paymentImage.name}</p>
                            )}
                            <button
                                className={cx('submit-confirmation-button')}
                                onClick={handleSubmitConfirmation}
                                disabled={isLoading || !paymentImage}
                            >
                                {isLoading ? 'Đang gửi...' : 'Gửi xác nhận thanh toán'}
                            </button>
                        </div>
                    </div>
                )}

                {isLoading && <p className={cx('loading-message')}>Loading...</p>}
                {message && <p className={cx('message')}>{message}</p>}
            </div>
        </div>
    );
}

export default PaymentModal;