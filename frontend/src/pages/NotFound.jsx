import React from 'react';
import { Link } from 'react-router';

const NotFound = () => {
    return (
        <div className="min-h-screen w-full bg-white relative overflow-hidden flex flex-col items-center justify-center p-4"> 
            {/* Light Sky Blue Glow */}
            <div 
                className="absolute inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: `
                        radial-gradient(circle at center, #93c5fd 0%, transparent 70%)
                    `,
                    opacity: 0.6
                }} 
            />

            <div className="max-w-md w-full text-center space-y-6 z-10 select-none">
                <div className="w-full flex justify-center">
                    <img 
                        src="/not_found.svg" 
                        alt="Not Found Illustration" 
                        className="w-80 h-auto animate-pulse" 
                        style={{ 
                            animationDuration: '3s',
                            filter: 'drop-shadow(0 10px 15px rgba(147, 197, 253, 0.3))'
                        }}
                    />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                        Đường dẫn không tồn tại!
                    </h1>
                    <p className="text-slate-500 text-sm font-semibold">
                        Có vẻ như bạn đã đi lạc hoặc trang này đã bị xóa. Hãy quay lại trang chủ để tiếp tục quản lý công việc nhé.
                    </p>
                </div>
                <div className="pt-2">
                    <Link 
                        to="/" 
                        className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer"
                    >
                        Quay về Trang Chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;