// src/pages/ProfileEdit/ProfileEdit.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './ProfileEdit.module.scss'; 
import { getUserProfile } from '../../services/userService'; 

const cx = classNames.bind(styles);

function ProfileEdit() {
    const { id } = useParams();
    const userId = id; 
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveMessage, setSaveMessage] = useState('');

    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');
    const [editAvatarUrl, setEditAvatarUrl] = useState('');

    // Fetch dữ liệu profile hiện tại để điền vào form
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getUserProfile(userId);
                setEditUsername(data.username || '');
                setEditBio(data.bio || '');
                setEditAvatarUrl(data.avatarUrl || '');
            } catch (err) {
                console.error("Lỗi khi tải hồ sơ để chỉnh sửa:", err);
                setError('Không thể tải dữ liệu hồ sơ để chỉnh sửa.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaveMessage('');
        try {
            const response = await fetch(`https://localhost:7208/api/User/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: editUsername,
                    bio: editBio,
                    avatarUrl: editAvatarUrl,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi cập nhật hồ sơ.');
            }

            setSaveMessage('Hồ sơ đã được cập nhật thành công!');
            setTimeout(() => {
                navigate(`/profile/${userId}`);
            }, 2000)
        } catch (err) {
            console.error("Lỗi khi lưu hồ sơ:", err);
            setSaveMessage(`Lỗi: ${err.message}`);
        }
    };

    const handleCancelEdit = () => {
        navigate(`/profile/${userId}`); 
    };

    if (loading) {
        return <div className={cx('loading')}>Đang tải form chỉnh sửa...</div>;
    }

    if (error) {
        return <div className={cx('error')}>Lỗi: {error}</div>;
    }

    return (
        <div className={cx('profile-edit-container')}>
            <h2>Chỉnh sửa hồ sơ cá nhân</h2>
            {saveMessage && (
                <p className={cx('save-message', { 'error': saveMessage.startsWith('Lỗi:') })}>
                    {saveMessage}
                </p>
            )}
            <form onSubmit={handleSaveProfile} className={cx('edit-form')}>
                <div className={cx('form-group')}>
                    <label htmlFor="editUsername">Tên người dùng:</label>
                    <input
                        type="text"
                        id="editUsername"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="editBio">Giới thiệu:</label>
                    <textarea
                        id="editBio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="editAvatarUrl">URL Ảnh đại diện:</label>
                    <input
                        type="url"
                        id="editAvatarUrl"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                    />
                </div>
                <div className={cx('form-actions')}>
                    <button type="submit" className={cx('save-button')}>Lưu thay đổi</button>
                    <button onClick={() => navigate(`/profile/${userId}`)} className={cx('return-button')}>Trở về</button>
                </div>
            </form>
        </div>
    );
}

export default ProfileEdit;