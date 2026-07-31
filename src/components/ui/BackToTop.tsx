import React, { useState, useEffect } from 'react';

export const BackToTop: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      style={{
        position: 'fixed',
        bottom: '100px', // Placed directly above FAB (28px + 58px + 14px gap)
        right: '29px',
        zIndex: 998,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--primary-500)',
        color: '#ffffff',
        boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'var(--transition)',
      }}
    >
      <i className="fa-solid fa-arrow-up" style={{ fontSize: '16px' }} />
    </button>
  );
};
