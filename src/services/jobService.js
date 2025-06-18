
const API_BASE_URL = 'https://localhost:7208/api'; 


export const getAllJobs = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/job`);
        
        if (!response.ok) {
            // Nếu phản hồi HTTP không OK (ví dụ: 404, 500)
            const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định.' }));
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const jobs = await response.json();
        return jobs;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error);
        throw error; // Ném lỗi để component gọi có thể xử lý
    }
};