import React from 'react';

export default function Logo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 500 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Lotus Icon */}
            <path d="M250 20C250 20 230 50 210 60C210 60 230 70 250 100C270 70 290 60 290 60C270 50 250 20 250 20Z" fill="#D4AF37" stroke="#F5F5DC" strokeWidth="2" />
            <path d="M250 100C250 100 230 90 200 95C200 95 220 120 250 130C280 120 300 95 300 95C270 90 250 100 250 100Z" fill="#D4AF37" fillOpacity="0.8" />
            <path d="M210 60C210 60 190 65 180 85C180 85 200 95 210 90" stroke="#D4AF37" strokeWidth="2" />
            <path d="M290 60C290 60 310 65 320 85C320 85 300 95 290 90" stroke="#D4AF37" strokeWidth="2" />

            {/* Text */}
            <text x="50%" y="145" textAnchor="middle" fill="#F5F5DC" fontFamily="serif" fontSize="24" letterSpacing="0.2em">EST. 2024</text>
        </svg>
    );
}
