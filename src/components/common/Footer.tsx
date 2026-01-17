import React from 'react';

interface FooterProps {
  onTakeAnotherQuiz?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onTakeAnotherQuiz }) => {
  return (
    <div className="relative w-full mt-52">
      {/* Wave Divider */}
      <div className="relative w-full h-[80px] overflow-hidden -mb-1">
        <svg
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="fill-[#FFE2D6] dark:fill-[#19222a]"
            d="M0,0 L0,120 L1200,120 L1200,0 C985,60 845,80 600,50 C355,20 215,40 0,0 Z"
          />
        </svg>
      </div>

      {/* Minimalist Footer Section */}
      <footer className="bg-[#FFE2D3] dark:bg-[#19222a] pt-2 pb-16 px-6 -mt-1">
        <div className="max-w-[960px] mx-auto flex flex-col items-center">
          {/* Section Header (Made with love) */}
          <div className="flex flex-col flex-1 mb-4">
            <div className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[#896b5d] dark:text-primary/80 text-sm">
                favorite
              </span>
              <h4 className="text-[#896b5d] dark:text-primary/80 text-xs font-bold uppercase leading-normal tracking-[0.2em]">
                Made with love by Realaza
              </h4>
            </div>
          </div>

          {/* Single Button (Main CTA) */}
          {onTakeAnotherQuiz && (
            <div className="flex px-4 py-3 justify-center mb-10">
              <button
                onClick={onTakeAnotherQuiz}
                className="group relative flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.05em] shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <span className="truncate">Take another quiz</span>
              </button>
            </div>
          )}

          {/* Footer Base (Legal/Copyright) */}
          <div className="flex flex-col gap-6 text-center w-full pt-10">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <a
                className="text-[#896b5d] dark:text-gray-400 text-sm font-medium hover:text-[#5d4a3d] transition-colors uppercase tracking-widest"
                href="https://dreamlaw.in/privacy-policy/"
              >
                Privacy Policy
              </a>
              <a
                className="text-[#896b5d] dark:text-gray-400 text-sm font-medium hover:text-[#5d4a3d] transition-colors uppercase tracking-widest"
                href="https://dreamlaw.in/terms-conditions/"
              >
                Terms & Conditions
              </a>
              <a
                className="text-[#896b5d] dark:text-gray-400 text-sm font-medium hover:text-[#5d4a3d] transition-colors uppercase tracking-widest"
                href="https://dreamlaw.in/contact-us/"
              >
                Contact Us
              </a>
            </div>
            <p className="text-[#896b5d]/60 dark:text-gray-500 text-xs font-normal tracking-wide mt-4">
              © 2026 Dreamlaw. All rights reserved.{' '}
              <br className="md:hidden" />
              Curating your law knowledge.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
