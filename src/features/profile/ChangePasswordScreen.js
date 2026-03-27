import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Lock,
  ArrowLeft,
  ShieldCheck,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { changePassword } from "../../services/apiAccountService";
import { Colors } from "../../constants/Colors";
import { PasswordInput } from "./PasswordInp";

export const ChangePasswordScreen = () => {
  const history = useHistory();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showAlert, setShowAlert] = useState({
    show: false,
    variant: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const user = { email: "admin@rockschool.kz" };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors.length > 0) setFormErrors([]);
    if (showAlert.show) setShowAlert({ ...showAlert, show: false });
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = [];

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      errors.push("Пожалуйста, заполните все поля");
    } else {
      if (passwordForm.newPassword.length < 6) {
        errors.push("Пароль должен содержать минимум 6 символов");
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        errors.push("Новый пароль и подтверждение не совпадают");
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      await changePassword({
        email: user.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setShowAlert({
        show: true,
        variant: "success",
        message: "Пароль успешно изменен",
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);

      let errorMessage = "Ошибка при изменении пароля. Попробуйте еще раз.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            setFormErrors(["Неверный текущий пароль"]);
            setIsSubmitting(false);
            return;
          case 401:
            errorMessage = "Сессия истекла. Войдите в систему заново";
            break;
          case 500:
            errorMessage = "Ошибка сервера. Попробуйте позже";
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              "Произошла ошибка при изменении пароля";
        }
      }

      setFormErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="h-full w-full flex flex-col justify-center items-center pt-[60px] font-geologica pb-[100px]"
        style={{ color: Colors.textMain }}
      >
        <div className="w-full max-w-[850px] px-6 flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => history.goBack()}
              className="flex items-center justify-center w-[50px] h-[50px] rounded-full border-none cursor-pointer transition-all duration-200 hover:bg-[var(--hover-color)] hover:text-[var(--hover-text)]"
              style={{
                backgroundColor: `${Colors.accent}33`,
                color: Colors.textMain,
                "--hover-color": Colors.accent,
                "--hover-text": Colors.textMain,
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-[45px] font-semibold tracking-tight m-0">
              Безопасность
            </h2>
          </div>

          <div
            className="p-8 rounded-[32px] shadow-2xl flex flex-col gap-10"
            style={{ backgroundColor: Colors.cardBg }}
          >
            <div className="flex flex-col gap-4">
              <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                Смена пароля
              </span>

              <div
                className="p-10 rounded-[24px]"
                style={{ backgroundColor: Colors.innerBg }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex flex-col gap-5">
                      <PasswordInput
                        label="Текущий пароль"
                        name="currentPassword"
                        fieldKey="currentPassword"
                        value={passwordForm.currentPassword}
                        showState={showPasswords.currentPassword}
                        placeholder="Введите старый пароль"
                        onChange={handlePasswordChange}
                        onToggle={togglePasswordVisibility}
                      />
                      <div className="h-[1px] w-full bg-white/5 my-2" />
                      <PasswordInput
                        label="Новый пароль"
                        name="newPassword"
                        fieldKey="newPassword"
                        value={passwordForm.newPassword}
                        showState={showPasswords.newPassword}
                        placeholder="Минимум 6 символов"
                        onChange={handlePasswordChange}
                        onToggle={togglePasswordVisibility}
                      />
                      <PasswordInput
                        label="Подтверждение"
                        name="confirmPassword"
                        fieldKey="confirmPassword"
                        value={passwordForm.confirmPassword}
                        showState={showPasswords.confirmPassword}
                        placeholder="Повторите новый пароль"
                        onChange={handlePasswordChange}
                        onToggle={togglePasswordVisibility}
                      />
                    </div>

                    <div
                      className="flex flex-col gap-4 p-6 rounded-[20px] self-start"
                      style={{ backgroundColor: `${Colors.mainBg}88` }}
                    >
                      <div
                        className="flex items-center gap-3"
                        style={{ color: Colors.accent }}
                      >
                        <ShieldCheck size={20} />
                        <span className="font-medium text-[15px]">
                          Важно знать:
                        </span>
                      </div>
                      <ul
                        className="text-[13px] font-light flex flex-col gap-3 m-0 p-0 list-none"
                        style={{ color: Colors.textMuted }}
                      >
                        <li className="flex items-start gap-2">
                          <div
                            className="w-1 h-1 rounded-full mt-2"
                            style={{ backgroundColor: Colors.accent }}
                          />
                          Минимум 6 знаков
                        </li>
                        <li className="flex items-start gap-2">
                          <div
                            className="w-1 h-1 rounded-full mt-2"
                            style={{ backgroundColor: Colors.accent }}
                          />
                          Используйте буквы и цифры
                        </li>
                      </ul>
                    </div>
                  </div>

                  {formErrors.length > 0 && (
                    <p className="text-red-400 text-[14px] m-0 -mt-4 animate-in fade-in duration-300">
                      {formErrors[0]}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-3 px-6 py-3.5 rounded-[14px] text-[16px] font-medium border-none transition-all duration-200 cursor-pointer hover:bg-[var(--hover-color)] hover:text-[var(--hover-text)]"
                      style={{
                        backgroundColor: `${Colors.accent}33`,
                        color: Colors.textMuted,
                        "--hover-color": Colors.accent,
                        "--hover-text": Colors.textMain,
                      }}
                    >
                      <Lock size={18} />
                      <span>
                        {isSubmitting ? "Изменение..." : "Обновить пароль"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => history.goBack()}
                      className="flex items-center gap-3 px-6 py-3.5 rounded-[14px] text-[16px] font-medium border-none transition-all duration-200 cursor-pointer hover:bg-[var(--hover-color)] hover:text-[var(--hover-text)]"
                      style={{
                        backgroundColor: `${Colors.danger}33`,
                        color: Colors.textMuted,
                        "--hover-color": Colors.danger,
                        "--hover-text": Colors.textMain,
                      }}
                    >
                      <span>Отмена</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAlert.show && (
        <div className="fixed bottom-10 right-10 z-50">
          <div
            className="p-4 rounded-[14px] flex items-center justify-between min-w-[300px] animate-in fade-in slide-in-from-bottom-5 duration-300"
            style={{
              backgroundColor:
                showAlert.variant === "success" ? "#22c55e15" : "#ef444415",
              border: `1px solid ${
                showAlert.variant === "success" ? "#22c55e30" : "#ef444430"
              }`,
            }}
          >
            <div className="flex items-center gap-3">
              {showAlert.variant === "success" ? (
                <CheckCircle size={18} style={{ color: "#4ade80" }} />
              ) : (
                <AlertCircle size={18} style={{ color: "#f87171" }} />
              )}
              <span
                className="text-[14px] font-medium"
                style={{
                  color:
                    showAlert.variant === "success" ? "#86efac" : "#fca5a5",
                }}
              >
                {showAlert.message}
              </span>
            </div>
            <X
              size={16}
              className="ml-4 cursor-pointer opacity-40 hover:opacity-100"
              onClick={() => setShowAlert({ ...showAlert, show: false })}
            />
          </div>
        </div>
      )}
    </>
  );
};
