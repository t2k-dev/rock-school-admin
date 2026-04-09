import { parse } from "date-fns";
import React from "react";
import { SexControl } from "../../components/SexControl";
import { Button, FormLabel, FormWrapper, Input } from "../../components/ui";
import { SectionTitle, SectionWrapper } from "../../layout";
import { DisciplineGridSelector } from "../disciplines/DisciplineGridSelector";

import {
  addTeacher,
  getTeacher,
  saveTeacher,
} from "../../services/apiTeacherService";

import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class TeacherForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNew: props.type === "New",
      disciplinesChanged: false,
      periodsChanged: false,
      teacher: {
        teacherId: "",
        email: "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        sex: 1,
        //userId: 1,
        disciplines: [],
        branchId: "",
        allowGroupLessons: false,
        allowBands: false,
        ageLimit: "",
      },
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValueOrEmptyString = this.getValueOrEmptyString.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    if (this.state.isNew) {
      return;
    }

    const id = this.props.match.params.id;
    const teacher = await getTeacher(id);

    // Format the phone number properly
    const formattedPhone = this.formatPhoneNumber("7" + teacher.phone);

    this.setState({
      teacher: {
        teacherId: this.props.match.params.id,
        email: teacher.email || "",
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        birthDate: new Date(teacher.birthDate),
        phone: formattedPhone,
        disciplines: teacher.disciplines,
        sex: teacher.sex,
        ageLimit: teacher.ageLimit,
        allowGroupLessons: teacher.allowGroupLessons,
        allowBands: teacher.allowBands,
        branchId: teacher.branchId,
        isActive: teacher.isActive,
      },
    });
  }

  getValueOrEmptyString = (str) => {
    if (typeof str !== "undefined" && str) {
      return str;
    }

    return "";
  };

  formatPhoneNumber = (phoneDigits) => {
    if (!phoneDigits) return "";

    // Remove all non-digits and ensure it starts with 7
    let value = phoneDigits.replace(/\D/g, "");
    if (value.length > 0 && !value.startsWith("7")) {
      value = "7" + value;
    }

    // Format the phone number
    let formattedPhone = "";
    if (value.length >= 1) {
      formattedPhone = "+7";
      if (value.length > 1) {
        formattedPhone += " " + value.substring(1, 4);
      }
      if (value.length > 4) {
        formattedPhone += " " + value.substring(4, 7);
      }
      if (value.length > 7) {
        formattedPhone += " " + value.substring(7, 9);
      }
      if (value.length > 9) {
        formattedPhone += " " + value.substring(9, 11);
      }
    }

    return formattedPhone;
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    const teacher = { ...this.state.teacher };
    teacher[name] = value;
    this.setState({ teacher });
  };

  handlePhoneChange = (e) => {
    const formattedPhone = this.formatPhoneNumber(e.target.value);
    const teacher = { ...this.state.teacher };
    teacher.phone = formattedPhone;
    this.setState({ teacher });
  };

  handleUpdateBirthDate = (date) => {
    const teacher = { ...this.state.teacher };
    teacher.birthDate = date;
    this.setState({ teacher });
  };

  handleSexChange = (isChecked) => {
    const teacher = { ...this.state.teacher };
    teacher.sex = isChecked;
    this.setState({ teacher });
  };

  handleDisciplineSelect = (disciplineId, isSelected) => {
    const teacher = { ...this.state.teacher };

    // Update disciplines array based on the isSelected value
    const newDisciplines = isSelected
      ? [...new Set([...teacher.disciplines, disciplineId])] // Add ID, ensuring no duplicates
      : teacher.disciplines.filter((discipline) => discipline !== disciplineId); // Remove ID
    teacher.disciplines = newDisciplines;

    const disciplinesChanged = true;
    this.setState({ teacher, disciplinesChanged });
  };

  handleAllowGroupLessonsChange = (e) => {
    const teacher = { ...this.state.teacher };
    teacher.allowGroupLessons = e.target.checked;

    this.setState({ teacher });
  };

  handleAllowBandsChange = (e) => {
    const teacher = { ...this.state.teacher };
    teacher.allowBands = e.target.checked;

    this.setState({ teacher });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      teacher: {
        email: this.state.teacher.email,
        firstName: this.state.teacher.firstName,
        lastName: this.state.teacher.lastName,
        birthDate: this.state.teacher.birthDate,
        sex: this.state.teacher.sex,
        phone: this.state.teacher.phone.replace("+7 ", "").replace(/\s/g, ""),
        disciplines: this.state.teacher.disciplines,
        branchId: this.state.teacher.branchId,
        ageLimit: this.state.teacher.ageLimit,
        allowGroupLessons: this.state.teacher.allowGroupLessons,
        allowBands: this.state.teacher.allowBands,
      },
      disciplinesChanged: this.state.disciplinesChanged,
    };

    let teacherId;
    if (this.state.isNew) {
      const response = await addTeacher(requestBody);
      teacherId = response.data;
    } else {
      const response = await saveTeacher(
        this.state.teacher.teacherId,
        requestBody,
      );
      teacherId = this.state.teacher.teacherId;
    }

    this.props.history.push(`/teacher/${teacherId}`);
  };

  render() {
    const {
      email,
      firstName,
      lastName,
      birthDate,
      phone,
      sex,
      ageLimit,
      allowGroupLessons,
      allowBands,
      disciplines,
      branchId,
    } = this.state.teacher;
    const { isNew } = this.state;

    return (
      <SectionWrapper>
        <SectionTitle className="text-center">
          {isNew ? "Новый преподаватель" : "Редактировать преподавателя"}
        </SectionTitle>

        <FormWrapper>
          <form onSubmit={this.handleSave} className="flex flex-col gap-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col">
                <FormLabel>Имя</FormLabel>
                <Input
                  name="firstName"
                  onChange={this.handleChange}
                  value={firstName}
                  placeholder="введите имя..."
                  autoComplete="off"
                />
              </label>

              <label className="flex flex-col">
                <FormLabel>Фамилия</FormLabel>
                <Input
                  name="lastName"
                  onChange={this.handleChange}
                  value={lastName}
                  placeholder="введите фамилию..."
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_220px]">
              <label className="flex flex-col">
                <FormLabel>Дата рождения</FormLabel>
                <DatePicker
                  id="birthDate"
                  locale={ru}
                  selected={birthDate}
                  onChange={(date) => {
                    if (date) {
                      this.handleUpdateBirthDate(date);
                    }
                  }}
                  onChangeRaw={(e) => {
                    const rawValue = e.target.value;
                    try {
                      const parsedDate = parse(
                        rawValue,
                        "dd.MM.yyyy",
                        new Date(),
                      );
                      if (!isNaN(parsedDate)) {
                        this.handleUpdateBirthDate(parsedDate);
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

              <SexControl
                value={sex}
                onChange={this.handleSexChange}
              ></SexControl>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col">
                <FormLabel>Телефон</FormLabel>
                <Input
                  name="phone"
                  type="tel"
                  onChange={this.handlePhoneChange}
                  value={phone}
                  placeholder="+7 777 777 77 77"
                  maxLength="16"
                />
              </label>

              <label className="flex flex-col">
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                  placeholder="введите email..."
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="h-px bg-white/10" />

            <DisciplineGridSelector
              multiSelect={true}
              selectedDisciplineIds={disciplines}
              onMultiDisciplineChange={this.handleDisciplineSelect}
              label="Направления"
            />

            <div className="h-px bg-white/10" />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <label className="flex flex-col">
                <FormLabel>Ученики от</FormLabel>
                <Input
                  name="ageLimit"
                  onChange={this.handleChange}
                  value={ageLimit}
                  placeholder="введите возраст..."
                  autoComplete="off"
                />
              </label>

              <div className="grid gap-3 rounded-[20px] bg-inner-bg p-4">
                <label className="flex cursor-pointer gap-3 items-center rounded-[14px] px-1 py-2 text-[15px] text-text-main">
                  <input
                    id="supportGroups"
                    type="checkbox"
                    checked={allowGroupLessons}
                    onChange={this.handleAllowGroupLessonsChange}
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                  />
                  <span>Групповые уроки</span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-[14px] px-1 py-2 text-[15px] text-text-main">
                  <input
                    id="allowBands"
                    type="checkbox"
                    checked={allowBands}
                    onChange={this.handleAllowBandsChange}
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-accent focus:ring-accent"
                  />
                  <span>Музыкальные группы</span>
                </label>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <label className="flex flex-col">
              <FormLabel>Филиал</FormLabel>
              <select
                id="branchId"
                aria-label="Выберите филиал"
                value={branchId}
                onChange={this.handleChange}
                className="rounded-[14px] border border-white/10 bg-input-bg px-4 py-3 text-[16px] text-text-main outline-none transition focus:border-white/20 focus:ring-2 focus:ring-accent"
              >
                <option value="">выберите...</option>
                <option value="1">На Абая</option>
                <option value="2">На Аль-Фараби</option>
              </select>
            </label>

            <div className="h-px bg-white/10" />

            <div className="text-center">
              <Button type="submit">Сохранить</Button>
            </div>
          </form>
        </FormWrapper>
      </SectionWrapper>
    );
  }
}

export default TeacherForm;
