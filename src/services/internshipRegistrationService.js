const API_BASE_URL = 'https://localhost:7208/api'; // Thay đổi nếu cổng API của bạn khác

// Hàm để lấy tất cả các đăng ký thực tập của một người dùng cụ thể
export const getInternshipApplicationsByUserId = async (userId) => {
    if (!userId) {
        console.error("Lỗi: Không có UserId để lấy thông tin đăng ký thực tập.");
        throw new Error("User ID is required to fetch internship applications.");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/internship-applications`);

        if (!response.ok) {
            // Nếu response không thành công (ví dụ: 404, 500), ném lỗi
            const errorData = await response.json(); // Lấy thông báo lỗi từ body response
            throw new Error(errorData.message || 'Không thể lấy thông tin đăng ký thực tập.');
        }

        const data = await response.json();
        return data; // Trả về mảng các InternshipRegistration của người dùng đó
    } catch (error) {
        console.error("Lỗi khi gọi API lấy đăng ký thực tập:", error);
        throw error;
    }
};