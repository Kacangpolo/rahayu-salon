'use client';

import { useEffect, useState } from 'react';
import { FaSyncAlt, FaHeart } from 'react-icons/fa';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('id');

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
    document.body.appendChild(addScript);
    window.googleTranslateElementInit = googleTranslateElementInit;

    // Check current language from cookie
    const cookies = document.cookie.split(';');
    const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
    if (googtrans) {
      const lang = googtrans.split('/').pop();
      if (lang) setCurrentLang(lang);
    }
  }, []);

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement({
      pageLanguage: 'id',
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    }, 'google_translate_element');
  };

  const changeLanguage = (langCode: string) => {
    // Set cookie for Google Translate
    // Format: /source/target or /auto/target
    // We use /auto/target to be safe, or /id/target since source is id
    document.cookie = `googtrans=/auto/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/auto/${langCode}; path=/;`; // Fallback for localhost

    // Also set the specific pair if needed, but usually /auto/code works
    // Reload to apply
    window.location.reload();
  };

  const languages = [
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ja', name: 'Japan', flag: '🇯🇵' },
    { code: 'zh-CN', name: 'Mandarin', flag: '🇨🇳' },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-2">
      {/* Custom Dropdown */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-rose-100 dark:border-gray-700 p-2 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currentLang === lang.code
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Cute Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border-2 border-rose-200 dark:border-gray-700 hover:border-rose-400 dark:hover:border-rose-500 transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <div className="relative">
          <FaSyncAlt className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
          <div className="absolute -top-2 -right-2 transform rotate-12">
            <FaHeart className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
        </div>
      </button>

      {/* Hidden Google Element */}
      <div id="google_translate_element" className="fixed bottom-0 right-0 pointer-events-none opacity-0 select-none -z-50 invisible"></div>

      <style jsx global>{`
                .goog-te-banner-frame { display: none !important; }
                .goog-tooltip { display: none !important; }
                .goog-te-gadget-icon { display: none !important; }
                body { top: 0px !important; }
            `}</style>
    </div>
  );
}
