import { parse } from "date-fns";
import { ru } from "date-fns/locale";
import { Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import { SexControl } from "../common/SexControl";

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
  onSave,
}) => {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="firstName">
        <Form.Label>Имя</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={firstName}
          placeholder="введите имя..."
          autoComplete="off"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="lastName">
        <Form.Label>Фамилия</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={lastName}
          placeholder="введите фамилию..."
          autoComplete="off"
        />
      </Form.Group>

      {!isNew && (
        <Form.Group className="mb-3" controlId="birthDate">
          <Form.Label>Дата рождения</Form.Label>
          <div>
            <Form.Control
              as={DatePicker}
              locale={ru}
              selected={birthDate}
              onChange={(date) => {
                if (date) {
                  handleChange({ target: { id: "birthDate", value: date } });
                }
              }}
              onChangeRaw={(e) => {
                const rawValue = e.target.value;
                try {
                  const parsedDate = parse(rawValue, "dd.MM.yyyy", new Date());
                  if (!isNaN(parsedDate)) {
                    handleChange({ target: { id: "birthDate", value: parsedDate } });
                  }
                } catch (error) {
                  console.error("Invalid date format");
                }
              }}
              dateFormat="dd.MM.yyyy"
              placeholderText="дд.мм.гггг"
              shouldCloseOnSelect={true}
            />
          </div>
        </Form.Group>
      )}

      {isNew && (
        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Возраст</Form.Label>
          <Form.Control
            onChange={handleAgeChange}
            value={age}
            placeholder="введите возраст..."
            autoComplete="off"
          />
        </Form.Group>
      )}

      <SexControl value={sex} onChange={handleSexChange} />

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          onChange={handleChange}
          value={email}
          placeholder="введите email..."
          autoComplete="off"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="phone">
        <Form.Label>Телефон</Form.Label>
        <Form.Control
          as={InputMask}
          mask="+7 999 999 99 99"
          maskChar=" "
          onChange={handleChange}
          value={phone}
          placeholder="введите телефон..."
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="level">
        <Form.Label>Уровень</Form.Label>
        <Form.Select
          name="level"
          value={level}
          onChange={(e) => handleChange({ target: { id: "level", value: e.target.value } })}
        >
          <option>выберите...</option>
          <option value="0">0 - Начинающий</option>
          <option value="1">1 - Начинающий</option>
          <option value="2">2 - Начинающий</option>
          <option value="3">3 - Продолжающий</option>
          <option value="4">4 - Продолжающий</option>
          <option value="5">5 - Продолжающий</option>
          <option value="10">10 - Бог</option>
        </Form.Select>
      </Form.Group>

      {onSave && (
        <Button variant="primary" onClick={onSave} type="button">
          Сохранить
        </Button>
      )}
    </Form>
  );
};