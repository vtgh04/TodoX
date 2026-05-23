import mongoose from "mongoose";
import dns from "node:dns";

// Thiết lập DNS của Google để giải quyết lỗi không phân giải được SRV trên một số nhà mạng
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.ConnectionStringMongodb);
        console.log("Kết nối thành công")
    } catch (error) {
        console.log(error);

        process.exit(1);
    }
}
