import { parse } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { SexControl } from "../../components/SexControl";
import { Button, FormWrapper, Input } from "../../components/ui";
import { SectionTitle, SectionWrapper } from "../../layout";
import { addStudent, getStudent, saveStudent } from "../../services/apiStudentService";
import { calculateDateFromAge } from "../../utils/dateTime";

// Phone formatting helper
const formatPhoneNumber = (value) => {
  if (!value) return value;
  
  // Remove all non-digits
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Apply formatting: +7 XXX XXX XX XX
  if (phoneNumber.length <= 1) return phoneNumber;
  if (phoneNumber.length <= 4) return `+7 ${phoneNumber.slice(1)}`;
  if (phoneNumber.length <= 7) return `+7 ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4)}`;
  if (phoneNumber.length <= 9) return `+7 ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7)}`;
  return `+7 ${phoneNumber.slice(1, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 9)} ${phoneNumber.slice(9, 11)}`;
};

class StudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.type === "New",
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      userId: "",
      level: 0,
      sex: 1,
      studentId: "",
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    if (this.state.isNew) return;

    const id = this.props.match.params.id;
    const student = await getStudent(id);

    this.setState({
      studentId: id,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      birthDate: student.birthDate,
      phone: formatPhoneNumber("7" + student.phone),
      age: 0,
      sex: student.sex,
      level: student.level,
    });

    console.log(this.state);
  }

  getBirthDate(age) {
    // Get the current date
    const today = new Date();
    
    // Get the current year
    const currentYear = today.getFullYear();
    
    // Calculate the birth year
    const birthYear = currentYear - age;
    
    // Create a new Date object for the birth date
    const birthDate = new Date(birthYear, today.getMonth(), today.getDate());
    
    return birthDate;
  }

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      //email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthDate: this.state.birthDate,
      sex: this.state.sex,
      phone: this.state.phone.replace("+7 ", "").replace(/\s/g, ""),
      //level: this.state.level,
      branchId: 1,
    };

    let studentId;
    if (this.state.isNew) {
      const response = await addStudent(requestBody);
      studentId = response.data;
    } else {
      const response = await saveStudent(this.state.studentId, requestBody);
      studentId = response.data;
    }

    this.props.history.push(`/student/${studentId}`);
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handlePhoneChange = (e) => {
    const { value } = e.target;
    const formattedPhone = formatPhoneNumber(value);
    this.setState({ phone: formattedPhone });
  };

  handleAgeChange = (e) => {
    const age = e.target.value;
    const birthDate = calculateDateFromAge(age);
    console.log(birthDate);
    this.setState({ birthDate: birthDate });
  };

  handleSexChange = (isChecked) => {
    this.setState({
      sex: isChecked,
    });
  };

  render() {
    const { isNew, email, firstName, lastName, birthDate, phone, sex, age } = this.state;
    return (
      <SectionWrapper>
        
        <SectionTitle className="text-center">
          {isNew ? "Новый ученик" : "Редактировать ученика"}
        </SectionTitle>

        <FormWrapper>
          <form onSubmit={this.handleSave} className="flex flex-col gap-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className="text-[14px] text-text-main opacity-60">Имя</span>
                <Input
                  id="firstName"
                  onChange={this.handleChange}
                  value={firstName}
                  placeholder="введите имя..."
                  autoComplete="off"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="text-[14px] text-text-main opacity-60">Фамилия</span>
                <Input
                  id="lastName"
                  onChange={this.handleChange}
                  value={lastName}
                  placeholder="введите фамилию..."
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">
              {isNew === false ? (
                <label className="flex flex-col gap-3">
                  <span className="text-[14px] text-text-main opacity-60">Дата рождения</span>
                  <DatePicker
                    id="birthDate"
                    locale={ru}
                    selected={birthDate}
                    onChange={(date) => {
                      if (date) {
                        this.setState({ birthDate: date });
                      }
                    }}
                    onChangeRaw={(e) => {
                      const rawValue = e.target.value;
                      try {
                        const parsedDate = parse(rawValue, "dd.MM.yyyy", new Date());
                        if (!isNaN(parsedDate)) {
                          this.setState({ birthDate: parsedDate });
                        }
                      } catch (error) {
                        console.error("Invalid date format");
                      }
                    }}
                    dateFormat="dd.MM.yyyy"
                    placeholderText="дд.мм.гггг"
                    shouldCloseOnSelect={true}
                    autoComplete="off"
                    wrapperClassName="w-full"
                    customInput={<Input id="birthDate" />}
                  />
                </label>
              ) : (
                <label className="flex flex-col gap-3">
                  <span className="text-[14px] text-text-main opacity-60">Возраст</span>
                  <Input
                    id="age"
                    onChange={this.handleAgeChange}
                    value={age}
                    placeholder="введите возраст..."
                    autoComplete="off"
                  />
                </label>
              )}

              <SexControl value={sex} onChange={this.handleSexChange}></SexControl>
            </div>

            <div className="h-px bg-white/10" />

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-3">
                <span className="text-[14px] text-text-main opacity-60">Телефон</span>
                <Input
                  id="phone"
                  type="tel"
                  onChange={this.handlePhoneChange}
                  value={phone}
                  placeholder="+7 777 777 77 77"
                  autoComplete="off"
                  maxLength="16"
                />
              </label>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex items-center justify-center">
              <Button type="submit" size="lg" className="min-w-[220px]">
                Сохранить
              </Button>
            </div>
          </form>
        </FormWrapper>
      </SectionWrapper>
    );
  }
}

export default StudentForm;