
const API_BASE_URL = 'https://levelup-api-qg0w.onrender.com/api'; 


export const getAllJobs = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/job`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định.' }));
            throw new Error(`Lỗi HTTP! Trạng thái: ${response.status} - ${errorData.message || response.statusText}`);
        }

        const jobs = await response.json();
        return jobs;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công việc:', error);
        throw error; 
    }
};