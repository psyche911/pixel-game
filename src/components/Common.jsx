import React from 'react';

export const PixelCard = ({ title, children, className = '' }) => {
    return (
        <div className={`nes-container with-title is-centered ${className}`} style={{ backgroundColor: 'white', color: 'black' }}>
            {title && <p className="title">{title}</p>}
            {children}
        </div>
    );
};

export const Avatar = ({ src, size = 100 }) => {
    return (
        <img
            src={src}
            alt="Pixel Avatar"
            style={{
                width: size,
                height: size,
                imageRendering: 'pixelated',
                border: '4px solid #000',
                marginBottom: '1rem'
            }}
            className="nes-avatar"
        />
    );
};

export const ProgressBar = ({ current, max }) => {
    return (
        <div className="nes-progress is-primary" style={{ height: '24px', marginBottom: '1rem' }}>
            <progress className="nes-progress is-pattern" value={current} max={max}></progress>
        </div>
    );
};
