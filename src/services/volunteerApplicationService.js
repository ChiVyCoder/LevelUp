const API_BASE_URL = 'https://levelup-api-qg0w.onrender.com/api'; 

export const getVolunteerApplicationsByUserId = async (userId) => {
    if (!userId) {
        console.error("Lỗi: Không có UserId để lấy thông tin đăng ký tình nguyện.");
        throw new Error("User ID is required to fetch volunteer applications.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/volunteer-applications`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể lấy thông tin đăng ký tình nguyện.');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Lỗi khi gọi API lấy đăng ký tình nguyện:", error);
        throw error;
    }
};
