import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('py-2');
        header.classList.remove('py-4');
      } else {
        header.classList.add('py-4');
        header.classList.remove('py-2');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav ref={headerRef} className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-20 flex items-center transition-all duration-200">
      <div className="flex justify-between items-center w-full mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
        <div className="flex items-center gap-xl">
          <button onClick={() => navigate('/')} className="flex items-center gap-xl cursor-pointer">
            <span className="font-headline-md text-headline-md font-bold text-primary text-3xl">Carssourcing</span>
          </button>
          <div className="hidden md:flex gap-lg">
            <button onClick={() => navigate('/')} className="font-label-md text-label-md text-on-tertiary-container border-b-2 border-on-tertiary-container cursor-pointer">
              Inventory
            </button>
            <button onClick={() => navigate('/search')} className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer">
              Sell
            </button>
            <a href="#finance" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer">
              Finance
            </a>
            <a href="#reviews" className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer">
              Research
            </a>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary">search</span>
            <input
              className="pl-10 pr-4 py-2 rounded-full border-outline-variant bg-surface-container-lowest focus:ring-on-tertiary-container focus:border-on-tertiary-container text-body-md"
              placeholder="Search models..."
              type="text"
            />
          </div>
          <button onClick={() => navigate('/login')} className="font-label-md text-label-md text-secondary px-md py-2 cursor-pointer">
            Login
          </button>
          <button onClick={() => navigate('/search')} className="bg-primary text-on-primary font-label-md text-label-md px-lg py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer">
            List Car
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
