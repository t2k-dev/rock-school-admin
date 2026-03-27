const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-10 font-geologica">
      <div className="max-w-[850px] mx-auto px-6">
        <div className="w-full h-[1px] bg-white/5 mb-8" />

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="m-0 text-[15px] font-light text-text-muted">
            &copy; {currentYear}
<<<<<<< HEAD:src/layout/Footer.js
            <span className="text-white/90 font-medium"> Rock School Admin</span>
=======
            <span className="text-white/90 font-medium">
              {" "}
              Rock School Admin
            </span>
>>>>>>> 995dbf5 (﻿add uqly icons, add ts, doing header):src/layout/Footer.tsx
            . Все права защищены.
          </p>

          <div className="flex items-center gap-2 text-[14px]">
            <span className="text-text-muted">Техническая поддержка:</span>
            <a
              href="mailto:t2k.devel@gmail.com"
              className="transition-all duration-300 hover:brightness-125 underline underline-offset-4 text-accent"
            >
              t2k.devel@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
