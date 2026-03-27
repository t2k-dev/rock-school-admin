import React, { useState, ChangeEvent, FormEvent } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginAPI } from "../../services/apiAuthService";
import { LogIn } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const Login: React.FC = () => {
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [triedSubmit, setTriedSubmit] = useState<boolean>(false);

  const history = useHistory();
  const location = useLocation<LocationState>();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setTriedSubmit(true);

    if (!formData.login.trim() || !formData.password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (!EMAIL_REGEX.test(formData.login)) {
      setError("Введите корректный формат email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginAPI(formData);
      login(response.token, response.user || { login: formData.login });
      history.replace(from);
    } catch (err) {
      setError("Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-main-bg font-geologica">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[500px] flex-col gap-8 rounded-[24px] bg-card-bg p-[60px]"
      >
        <h2 className="text-[36px] font-semibold text-text-main m-0">
          Вход в систему
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-text-main opacity-60">
              Логин
            </label>
            <input
              name="login"
              type="text"
              placeholder="Введите логин..."
              value={formData.login}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-[12px] bg-inner-bg p-4 text-[16px] text-text-main outline-none transition-all placeholder:text-text-muted/30 border-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[16px] text-text-main opacity-60">
              Пароль
            </label>
            <input
              name="password"
              type="password"
              placeholder="Введите пароль..."
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="rounded-[12px] bg-inner-bg p-4 text-[16px] text-text-main outline-none transition-all placeholder:text-text-muted/30 border-none"
            />
          </div>
        </div>

        {error && <p className="text-danger -mt-4 text-[14px] m-0">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-3 rounded-[14px] bg-accent/20 px-6 py-3.5 text-[16px] font-semibold text-text-muted transition-all duration-200 hover:bg-accent hover:text-text-main border-none cursor-pointer"
        >
          {isLoading ? (
            <span className="animate-pulse">Загрузка...</span>
          ) : (
            <>
              <LogIn size={24} className="text-inherit" />
              <span>Войти</span>
            </>
          )}
        </button>

        <div className="flex justify-center gap-1 text-[13px]">
          <span className="cursor-pointer text-accent hover:underline">
            Забыли пароль?
          </span>
          <span className="text-text-muted">Обратитесь к администратору</span>
        </div>
      </form>
    </div>
  );
};
