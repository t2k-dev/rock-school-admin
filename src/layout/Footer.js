import { Colors } from "../constants/Colors";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-10 font-geologica">
      <div className="max-w-[850px] mx-auto px-6">
        <div className="w-full h-[1px] bg-white/5 mb-8" />

        <div className="flex flex-col items-center gap-4 text-center">
          <p
            className="m-0 text-[15px] font-light"
            style={{ color: Colors.textMuted }}
          >
            &copy; {currentYear}
            <span className="text-white/90 font-medium">Rock School Admin</span>
            . Все права защищены.
          </p>

          <div className="flex items-center gap-2 text-[14px]">
            <span style={{ color: Colors.textMuted }}>
              Техническая поддержка:
            </span>
            <a
              href="mailto:t2k.devel@gmail.com"
              className="transition-all duration-300 hover:brightness-125 underline underline-offset-4"
              style={{ color: Colors.accent }}
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
