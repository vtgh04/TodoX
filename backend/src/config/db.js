import mongoose from "mongoose";
import dns from "node:dns";

export const connectDB = async () => {
    // Tắt buffering của Mongoose để các request DB trả về lỗi ngay lập tức thay vì bị treo (hang) khi chưa kết nối được DB
    mongoose.set("bufferCommands", false);

    // 1. Thử kết nối bình thường bằng DNS mặc định của hệ thống
    try {
        await mongoose.connect(process.env.ConnectionStringMongodb);
        console.log("Kết nối MongoDB Atlas thành công 🎉");
        return;
    } catch (error) {
        console.warn("Lỗi kết nối MongoDB Atlas (DNS hệ thống):", error.message);

        // 2. Nếu lỗi phân giải tên miền (ENOTFOUND hoặc querySrv), thử đổi DNS sang Google DNS
        if (error.message.includes("ENOTFOUND") || error.message.includes("querySrv") || error.message.includes("query")) {
            console.log("Đang thử lại kết nối bằng cách chuyển DNS sang Google DNS...");
            try {
                dns.setServers(["8.8.8.8", "8.8.4.4"]);
                await mongoose.connect(process.env.ConnectionStringMongodb);
                console.log("Kết nối MongoDB Atlas thành công bằng Google DNS 🎉");
                return;
            } catch (dnsError) {
                console.warn("Kết nối MongoDB Atlas bằng Google DNS thất bại:", dnsError.message);
            }
        }

        // 3. Fallback: Thử kết nối tới MongoDB cục bộ (Local MongoDB)
        console.log("Đang thử kết nối cơ sở dữ liệu local (127.0.0.1:27017)...");
        try {
            await mongoose.connect("mongodb://127.0.0.1:27017/todoX");
            console.log("Kết nối MongoDB Local thành công 🎉");
        } catch (localError) {
            console.error("Lỗi kết nối MongoDB Local:", localError.message);
            console.error("=== LỖI KẾT NỐI DB ===");
            console.error("Vui lòng kiểm tra:");
            console.error("1. Mạng internet và Whitelist IP trên MongoDB Atlas.");
            console.error("2. Hoặc khởi chạy dịch vụ MongoDB trên máy tính (nếu dùng local).");
            console.error("3. Biến ConnectionStringMongodb trong file backend/.env");
            console.error("=======================");
        }
    }
};
