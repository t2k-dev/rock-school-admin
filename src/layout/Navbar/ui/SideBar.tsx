import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../model/constants";
import { TeacherIcon } from "../../../components/icons";

const Sidebar = () => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside
      className="
      flex flex-col 
      w-80 h-[calc(100vh-32px)] 
      bg-card-bg text-text-muted 
      p-4 
      sticky top-4 left-4 shrink-0
      rounded-xl my-4 ml-4
  "
    >
      <Link to="/">
        <div className="flex items-center gap-3 px-2 mb-10 mt-2">
          {/* LOGO */}
          <img
            src="/logo_100x100.png"
            alt="Rock School"
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-text-main tracking-tight">
            Rock School
          </span>
        </div>
      </Link>

      <nav className="flex flex-col gap-2">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path === "/branchScreen" ? "/branchScreen/1" : link.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                active
                  ? "bg-accent text-text-main shadow-lg"
                  : "hover:bg-white/5 text-text-muted"
              }`}
            >
              <span className="text-[15px] font-medium">{link.name}</span>
              <div className="w-5 h-5 flex items-center justify-center opacity-60">
                <Icon />
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 relative">
        <Link
          to="/support"
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-accent/15 text-accent hover:bg-accent/25 transition-colors"
        >
          <span className="font-medium text-[15px]">Поддержка</span>
          <div className="text-lg font-bold">?</div>
        </Link>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent active:border-white/10"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-inner-bg flex-shrink-0 flex items-center justify-center overflow-hidden">
                <TeacherIcon />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-text-main truncate leading-none mb-1">
                  Алексей Панченко
                </p>
                <p className="text-[11px] text-text-muted uppercase tracking-wider font-bold">
                  Администратор
                </p>
              </div>
            </div>
            <div
              className={`transition-transform opacity-40 ${isUserMenuOpen ? "rotate-180" : ""}`}
            >
              <div className="w-2 h-2 border-r-2 border-b-2 border-text-main rotate-45 mb-1" />
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-40 bg-card-bg rounded-xl shadow-2xl border border-white/5 py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-text-main hover:bg-accent"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Профиль
              </Link>
              <div className="h-[1px] bg-white/5 my-1" />
              <button className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10">
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
