import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { TeacherIcon } from "../../components/icons";

export const ProfileScreen = () => {
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
    <div className="h-full w-full flex justify-center items-start pt-[60px] font-geologica text-text-main">
      <div className="w-full max-w-[850px] px-6 flex flex-col gap-8">
        <h2 className="text-[45px] font-semibold tracking-tight m-0">
          Профиль пользователя
        </h2>

        {/* User Information Card */}
        <div className="p-8 rounded-[32px] shadow-2xl flex flex-col gap-10 bg-card-bg">
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
              Пользователь
            </span>
            <div className="p-10 rounded-[24px] flex items-center gap-20 bg-inner-bg">
              <div className="flex flex-col items-center gap-4 group cursor-pointer">
                <div className="w-[140px] h-[140px] rounded-full flex items-center justify-center transition-all duration-300 bg-accent/20 text-text-muted">
                  <TeacherIcon />
                </div>
                <button
                  className="px-4 py-2 rounded-[10px] text-[13px] border-none cursor-pointer transition-colors duration-200 bg-accent/40 
                text-text-muted group-hover:bg-accent/70 group-hover:text-text-main 
                font-medium"
                >
                  + Добавить фото
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-20 gap-y-8 flex-1">
                <div>
                  <div className="text-[14px] font-light mb-1 text-text-muted">
                    Имя
                  </div>
                  <div className="text-[22px] font-medium">
                    {user.firstName}
                  </div>
                </div>
                <div>
                  <div className="text-[14px] font-light mb-1 text-text-muted">
                    Роль
                  </div>
                  <div className="text-[22px] font-medium">{user.role}</div>
                </div>
                <div>
                  <div className="text-[14px] font-light mb-1 text-text-muted">
                    Email
                  </div>
                  <div className="text-[20px] font-medium">{user.email}</div>
                </div>
                <div>
                  <div className="text-[14px] font-light mb-1 text-text-muted">
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
            <div className="p-8 rounded-[24px] flex items-center gap-6 bg-inner-bg">
              <Link to="/change-password">
                <button className="flex items-center gap-3 px-6 py-3.5 rounded-[14px] text-[16px] font-medium border-none transition-all duration-200 cursor-pointer bg-accent/40 text-text-muted hover:bg-accent/70 hover:text-text-main">
                  <Lock size={18} />
                  <span className="font-medium">Изменить пароль</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
