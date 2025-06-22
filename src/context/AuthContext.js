import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getStoredUser = () => {
        try {
            const userDataString = localStorage.getItem('currentUser');
            if (userDataString && userDataString !== "null" && userDataString !== "undefined") {
                return JSON.parse(userDataString);
            }
        } catch (e) {
            console.error("Lỗi khi đọc user từ localStorage:", e);
            localStorage.removeItem('currentUser'); 
        }
        return null;
    };

    // Khởi tạo trạng thái user và isLoggedIn
    const [user, setUser] = useState(getStoredUser);
    const [isLoggedIn, setIsLoggedIn] = useState(!!getStoredUser());

    // Hàm đăng nhập: lưu user vào localStorage và cập nhật state
    const login = (userData) => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setIsLoggedIn(true);
        setUser(userData);
    };

    // Hàm đăng xuất: xóa user khỏi localStorage và reset state
    const logout = () => {
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
        setUser(null);
    };

    const authContextValue = {
        isLoggedIn,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};