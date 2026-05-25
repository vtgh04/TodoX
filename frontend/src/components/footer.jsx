import React from 'react';

const Footer = ({ stats }) => {
    const active = stats?.active || 0;
    const completed = stats?.completed || 0;

    let message = "🎯 Bắt đầu ngày mới bằng cách lập danh sách công việc cần làm!";

    if (completed > 0 && active > 0) {
        message = `🎉 Tuyệt vời! Bạn đã hoàn thành ${completed} việc, còn ${active} việc nữa thôi. Cố lên!`;
    } else if (completed > 0 && active === 0) {
        message = `🎉 Xuất sắc! Bạn đã hoàn thành tất cả ${completed} công việc của ngày hôm nay! 🌟`;
    } else if (active > 0 && completed === 0) {
        message = `💪 Cố lên! Bạn đang có ${active} công việc cần hoàn thành.`;
    }

    return (
        <div className="text-center py-6 border-t border-slate-100 mt-4 select-none">
            <p className="text-xs font-bold text-slate-500 italic bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-1.5 animate-pulse">
                {message}
            </p>
        </div>
    );
};

export default Footer;