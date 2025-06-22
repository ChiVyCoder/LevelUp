// src/services/userService.js

const API_BASE_URL = 'https://levelup-api-qg0w.onrender.com/api';


export const getUserProfile = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/User/${userId}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Lỗi khi tải hồ sơ người dùng ${userId}.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi trong getUserProfile:", error);
        throw error;
    }
};


export const getUserCourses = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/User/${userId}/courses`);

        if (!response.ok) {            
            if (response.status === 404) {
                return [];
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Lỗi khi tải khóa học của người dùng ${userId}.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi trong getUserCourses:", error);
        throw error;
    }
};


export const getUserInternships = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/User/${userId}/internships`);

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Lỗi khi tải đăng ký thực tập của người dùng ${userId}.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi trong getUserInternships:", error);
        throw error;
    }
};


export const getUserVolunteers = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/User/${userId}/volunteers`);

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            const errorData = await response.json();
            throw new Error(errorData.message || `Lỗi khi tải đăng ký tình nguyện của người dùng ${userId}.`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi trong getUserVolunteers:", error);
        throw error;
    }
};