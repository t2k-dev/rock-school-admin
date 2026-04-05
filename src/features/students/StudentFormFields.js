import { parse } from "date-fns";
import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import { SexControl } from "../../components/SexControl";

export const StudentFormFields = ({
  isNew,
  email,
  firstName,
  lastName,
  birthDate,
  phone,
  level,
  sex,
  age,
  handleChange,
  handleAgeChange,
  handleSexChange,
}) => {
  const inputBaseClasses = `
    w-full bg-transparent border border-secondary/20 rounded-2xl py-3 px-4 
    text-text-main placeholder:text-text-muted/30 outline-none
    transition-all duration-200 
    focus:border-accent focus:ring-1 focus:ring-accent/20
  `;

  const labelClasses =
    "block text-[13px] font-medium text-text-muted mb-1.5 ml-1 uppercase tracking-wider opacity-70";

  return (
    <div
      className="flex flex-col gap-5 bg-transparent"
      style={{ background: "none" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelClasses}>Имя</label>
          <input
            id="firstName"
            type="text"
            className={inputBaseClasses}
            onChange={handleChange}
            value={firstName}
            placeholder="Имя"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Фамилия</label>
          <input
            id="lastName"
            type="text"
            className={inputBaseClasses}
            onChange={handleChange}
            value={lastName}
            placeholder="Фамилия"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelClasses}>
            {isNew ? "Возраст" : "Дата рождения"}
          </label>
          {!isNew ? (
            <div className="relative">
              <DatePicker
                locale={ru}
                selected={birthDate}
                onChange={(date) =>
                  handleChange({ target: { id: "birthDate", value: date } })
                }
                dateFormat="dd.MM.yyyy"
                placeholderText="дд.мм.гггг"
                className={inputBaseClasses}
                shouldCloseOnSelect={true}
              />
            </div>
          ) : (
            <input
              id="age"
              type="number"
              className={inputBaseClasses}
              onChange={handleAgeChange}
              value={age}
              placeholder="лет"
            />
          )}
        </div>

        <div className="flex flex-col">
          <label className={labelClasses}>Уровень</label>
          <select
            id="level"
            className={`${inputBaseClasses} cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center]`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundSize: "1.5em",
            }}
            value={level}
            onChange={(e) =>
              handleChange({ target: { id: "level", value: e.target.value } })
            }
          >
            <option value="0" className="bg-card-bg">
              0 - Начинающий
            </option>
            <option value="1" className="bg-card-bg">
              1 - Начинающий
            </option>
            <option value="2" className="bg-card-bg">
              2 - Начинающий
            </option>
            <option value="3" className="bg-card-bg">
              3 - Продолжающий
            </option>
            <option value="10" className="bg-card-bg">
              10 - Бог
            </option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-inner-bg/40 rounded-[24px] border border-secondary/20 group hover:border-secondary/20 transition-colors">
        <label className={labelClasses}>Пол ученика</label>
        <SexControl value={sex} onChange={handleSexChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className={labelClasses}>Email</label>
          <input
            id="email"
            type="email"
            className={inputBaseClasses}
            onChange={handleChange}
            value={email}
            placeholder="mail@example.com"
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClasses}>Телефон</label>
          <InputMask
            mask="+7 999 999 99 99"
            maskChar=" "
            value={phone}
            onChange={handleChange}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                id="phone"
                type="text"
                className={inputBaseClasses}
                placeholder="+7 ___ ___ __ __"
              />
            )}
          </InputMask>
        </div>
      </div>
    </div>
  );
};
