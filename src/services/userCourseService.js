const API_BASE_URL = 'https://levelup-api-qg0w.onrender.com/';

export const finishCourse = async (userId, courseId) => {
    if (!userId || !courseId) {
        throw new Error("User ID and Course ID are required to finish a course.");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/courses/${courseId}/finish`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Không thể đánh dấu khóa học đã hoàn thành.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API đánh dấu hoàn thành khóa học:", error);
        throw error;
    }
};

export const getUserCompletedCourses = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required to fetch completed courses.");
    }
    try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}/courses/completed`);

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) {
                return [];
            }
            throw new Error(errorData.message || 'Không thể lấy thông tin khóa học đã hoàn thành.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy khóa học đã hoàn thành:", error);
        throw error;
    }
};