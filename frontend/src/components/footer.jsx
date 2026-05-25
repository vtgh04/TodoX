import React from 'react';

const Footer = ({ stats, language }) => {
    const active = stats?.active || 0;
    const completed = stats?.completed || 0;

    let message = language === 'vi' 
        ? "🎯 Bắt đầu ngày mới bằng cách lập danh sách công việc cần làm!"
        : "🎯 Start your day by listing tasks to do!";

    if (completed > 0 && active > 0) {
        message = language === 'vi'
            ? `🎉 Tuyệt vời! Bạn đã hoàn thành ${completed} việc, còn ${active} việc nữa thôi. Cố lên!`
            : `🎉 Great! You have completed ${completed} tasks, only ${active} left to go. Keep it up!`;
    } else if (completed > 0 && active === 0) {
        message = language === 'vi'
            ? `🎉 Xuất sắc! Bạn đã hoàn thành tất cả ${completed} công việc của ngày hôm nay! 🌟`
            : `🎉 Excellent! You have completed all ${completed} tasks for today! 🌟`;
    } else if (active > 0 && completed === 0) {
        message = language === 'vi'
            ? `💪 Cố lên! Bạn đang có ${active} công việc cần hoàn thành.`
            : `💪 Keep it up! You have ${active} tasks to complete.`;
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