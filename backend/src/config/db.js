import mongoose from "mongoose";
import dns from "node:dns";

// Thiết lập DNS của Google để giải quyết lỗi không phân giải được SRV trên một số nhà mạng
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Không thể thiết lập DNS Google, sử dụng DNS mặc định của hệ thống:", e.message);
}

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ConnectionStringMongodb);
        console.log("Kết nối MongoDB thành công 🎉");
    } catch (error) {
        console.error("Lỗi kết nối MongoDB:", error.message);
        console.error("Vui lòng kiểm tra lại kết nối mạng, địa chỉ IP (đã whitelist trên Atlas chưa) hoặc chuỗi ConnectionStringMongodb trong file .env!");
    }
}
