import React from 'react'

const Header = ({ language }) => {
    const subtitle = language === 'vi' 
        ? "Không có việc gì khó, chỉ sợ mình không làm 💪"
        : "Nothing is impossible, only fear of not trying 💪";

    return (
        <div className="text-center space-y-3 mb-8 select-none">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Just Do IT
            </h1>
            <p className="text-slate-500 font-semibold text-sm">
                {subtitle}
            </p>
        </div>
    )
}

export default Header