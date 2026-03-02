import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-display font-bold">Velociti</span>
            </div>
            <p className="text-slate-400 text-sm">The future of car buying and selling.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Buy</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-brand-500">Search Cars</a></li>
              <li><a href="#" className="hover:text-brand-500">New Arrivals</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Sell</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-brand-500">Get an Offer</a></li>
              <li><a href="#" className="hover:text-brand-500">How it Works</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-brand-500">About Us</a></li>
              <li><a href="#" className="hover:text-brand-500">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="text-slate-500 text-sm">© 2024 Velociti. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
