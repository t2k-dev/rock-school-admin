import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Colors } from "../../constants/Colors";
import { Plus } from "lucide-react";

const ProfileScreen = () => {
  // Mock user data - in real app this would come from authentication context
  const user = {
    firstName: "Маржан",
    lastName: "Администратор",
    email: "admin@rockschool.kz",
    role: "Администратор",
    phone: "+7 (701) 123-45-67",
    joinDate: "15 января 2024",
    lastCome: "16.03.2026",
    allLessons: "14",
  };

  return (
    <div
      className="h-full w-full flex justify-center items-start pt-[60px] font-geologica"
      style={{ color: Colors.textMain }}
    >
      <div className="w-full max-w-[850px] px-6 flex flex-col gap-8">
        <h2 className="text-[45px] font-semibold tracking-tight m-0">
          Профиль пользователя
        </h2>

        {/* User Information Card */}
        <div
          className="p-8 rounded-[32px] shadow-2xl flex flex-col gap-10"
          style={{ backgroundColor: Colors.cardBg }}
        >
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
              Пользователь
            </span>
            <div
              className="p-10 rounded-[24px] flex items-center gap-20"
              style={{ backgroundColor: Colors.innerBg }}
            >
              <div className="flex flex-col items-center gap-4 group cursor-pointer">
                <div
                  className="w-[140px] h-[140px] rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: `${Colors.accent}33`,
                    color: Colors.textMuted,
                  }}
                >
                  <Plus size={80} strokeWidth={1.2} className="text-white/70" />
                </div>
                <button
                  className="px-4 py-2 rounded-[10px] text-[13px] border-none cursor-pointer transition-colors duration-200 group-hover:bg-[var(--hover-color)] group-hover:text-[var(--hover-text)]"
                  style={{
                    backgroundColor: `${Colors.accent}33`,
                    color: Colors.textMuted,
                    "--hover-color": `${Colors.accent}`,
                    "--hover-text": `${Colors.textMain}`,
                  }}
                >
                  + Добавить фото
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-20 gap-y-8 flex-1">
                <div>
                  <div
                    className="text-[14px] font-light mb-1"
                    style={{ color: Colors.textMuted }}
                  >
                    Имя
                  </div>
                  <div className="text-[22px] font-medium">
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <div
                    className="text-[14px] font-light mb-1"
                    style={{ color: Colors.textMuted }}
                  >
                    Роль
                  </div>
                  <div className="text-[22px] font-medium">{user.role}</div>
                </div>
                <div>
                  <div
                    className="text-[14px] font-light mb-1"
                    style={{ color: Colors.textMuted }}
                  >
                    Email
                  </div>
                  <div className="text-[20px] font-medium">{user.email}</div>
                </div>
                <div>
                  <div
                    className="text-[14px] font-light mb-1"
                    style={{ color: Colors.textMuted }}
                  >
                    Последний вход
                  </div>
                  <div className="text-[22px] font-medium">{user.lastCome}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings Card */}
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
              Операции
            </span>
            <div
              className="p-8 rounded-[24px] flex items-center gap-6"
              style={{ backgroundColor: Colors.innerBg }}
            >
              <Link to="/change-password">
                <button
                  className="flex items-center gap-3 px-6 py-3.5 rounded-[14px] text-[16px] font-medium border-none transition-all duration-200 cursor-pointer hover:bg-[var(--hover-color)] hover:text-[var(--hover-text)]"
                  style={{
                    backgroundColor: `${Colors.accent}33`,
                    color: Colors.textMuted,
                    "--hover-color": `${Colors.accent}`,
                    "--hover-text": `${Colors.textMain}`,
                  }}
                >
                  <Lock size={18} />
                  <span>Изменить пароль</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
