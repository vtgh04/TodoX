import React from 'react';

const LanguageSwitcher = ({ language, setLanguage }) => {
    return (
        <div className="fixed top-6 right-6 z-50 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-1 shadow-lg shadow-blue-500/5 flex gap-1 select-none transition-all duration-300">
            <button
                onClick={() => setLanguage('vi')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    language === 'vi'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title="Tiếng Việt"
            >
                <span>🇻🇳</span>
                <span>VI</span>
            </button>
            <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    language === 'en'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
                title="English"
            >
                <span>🇺🇸</span>
                <span>EN</span>
            </button>
        </div>
    );
};

export default LanguageSwitcher;
