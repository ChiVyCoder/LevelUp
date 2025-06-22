// src/services/volunteerService.js

export const getAllVolunteers = async () => {
    try {
        const response = await fetch('https://levelup-api-qg0w.onrender.com/volunteer');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu tình nguyện viên:", error);
        throw error;
    }
};