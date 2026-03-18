import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login as loginAPI } from "../../services/apiAuthService";
import { LogIn } from "lucide-react";
import { Colors } from "../../constants/Colors";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [triedSubmit, setTriedSubmit] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

  const isInvalid = (field) => {
    if (!triedSubmit) return false;
    if (!formData[field].trim()) return true;
    if (field === "login" && !EMAIL_REGEX.test(formData.login)) return true;
    return false;
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center fixed font-geologica"
      style={{ backgroundColor: Colors.mainBg }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-[60px] w-full max-w-[500px] rounded-[24px] flex flex-col gap-8"
        style={{ backgroundColor: Colors.cardBg }}
      >
        <h2
          className="text-[36px] font-semibold m-0"
          style={{ color: Colors.textMain }}
        >
          Вход в систему
        </h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] opacity-60"
              style={{ color: Colors.textMain }}
            >
              Логин
            </label>
            <input
              name="login"
              type="text"
              placeholder="Введите логин..."
              value={formData.login}
              onChange={handleChange}
              disabled={isLoading}
              className={`p-4 rounded-[12px] border-none outline-none text-[16px] transition-all
                ${isInvalid("login") ? "ring-1 ring-red-500" : "focus:ring-1"}`}
              style={{
                backgroundColor: "#2e323e",
                color: Colors.textMain,
                "--tw-ring-color": Colors.accent,
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label
              className="text-[16px] opacity-60"
              style={{ color: Colors.textMain }}
            >
              Пароль
            </label>
            <input
              name="password"
              type="password"
              placeholder="Введите пароль..."
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`p-4 rounded-[12px] border-none outline-none text-[16px] transition-all
                ${isInvalid("password") ? "ring-1 ring-red-500" : "focus:ring-1"}`}
              style={{
                backgroundColor: "#2e323e",
                color: Colors.textMain,
                "--tw-ring-color": Colors.accent,
              }}
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-[14px] m-0 -mt-4">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="flex justify-center items-center gap-3 px-6 py-3.5 rounded-[14px] text-[16px] font-semibold border-none transition-all duration-200 cursor-pointer hover:bg-[var(--hover-color)] hover:text-[var(--hover-text)]"
          style={{
            backgroundColor: `${Colors.accent}33`,
            color: Colors.textMuted,
            "--hover-color": `${Colors.accent}`,
            "--hover-text": `${Colors.textMain}`,
          }}
        >
          {isLoading ? (
            <span className="animate-pulse">Загрузка...</span>
          ) : (
            <div className="flex gap-2 items-center">
              <LogIn size="24px" style={{ color: Colors.textMuted }} />
              <span>Войти</span>
            </div>
          )}
        </button>

        <div className="flex justify-center gap-1 text-[13px]">
          <span
            style={{ color: Colors.accent }}
            className="cursor-pointer hover:underline"
          >
            Забыли пароль?
          </span>
          <span style={{ color: Colors.textMuted }}>
            Обратитесь к администратору
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
