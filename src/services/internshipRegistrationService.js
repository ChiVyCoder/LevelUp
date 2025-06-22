const API_BASE_URL = 'https://levelup-api-qg0w.onrender.com/';
export const getInternshipApplicationsByUserId = async (userId) => {
    if (!userId) {
        console.error("Lỗi: Không có UserId để lấy thông tin đăng ký thực tập.");
        throw new Error("User ID is required to fetch internship applications.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/internship-applications`);

        if (!response.ok) {
           
            const errorData = await response.json(); // Lấy thông báo lỗi từ body response
            throw new Error(errorData.message || 'Không thể lấy thông tin đăng ký thực tập.');
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Lỗi khi gọi API lấy đăng ký thực tập:", error);
        throw error;
    }
};