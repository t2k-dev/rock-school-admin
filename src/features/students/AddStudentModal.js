import React from "react";
import { sub } from "date-fns";
import { X } from "lucide-react"; // Импортируем иконку

import { addStudent } from "../../services/apiStudentService";
import { StudentFormFields } from "./StudentFormFields";
import { StudentsSearch } from "./StudentsSearch";

export class AddStudentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      phone: "",
      level: 0,
      sex: 1,
      age: "",
      activeTab: "new", // Добавляем состояние для вкладок
    };
  }

  // Метод для переключения вкладок
  setActiveTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleAgeChange = (e) => {
    const age = parseInt(e.target.value, 10);

    if (!isNaN(age) && age > 0) {
      const birthDate = sub(new Date(), { years: age });
      this.setState({
        age: age,
        birthDate: birthDate,
      });
    } else {
      this.setState({
        age: e.target.value,
        birthDate: "",
      });
    }
  };

  handleSexChange = (value) => {
    this.setState({ sex: value });
  };

  handleSave = async () => {
    const { email, firstName, lastName, birthDate, phone, level, sex } =
      this.state;

    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      sex: sex,
      phone: phone.replace("+7 ", "").replace(/\s/g, ""),
      level: level,
      branchId: 1,
    };

    try {
      const response = await addStudent(requestBody);
      const studentId = response.data;

      const newStudent = {
        studentId,
        email,
        firstName,
        lastName,
        birthDate,
        phone,
        level,
        sex,
      };

      if (this.props.onAddStudent) {
        this.props.onAddStudent(newStudent);
      }

      this.props.handleClose();
    } catch (error) {
      console.error("Ошибка при добавлении студента:", error);
    }
  };

  handleAddExisting = (student) => {
    if (this.props.onAddStudent) {
      this.props.onAddStudent(student);
    }
    this.props.handleClose();
  };

  render() {
    const { show, handleClose, onlyExistingStudents } = this.props;
    const {
      email,
      firstName,
      lastName,
      birthDate,
      phone,
      level,
      sex,
      age,
      activeTab,
    } = this.state;

    // Если модалка не должна отображаться, возвращаем null
    if (!show) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main-bg/80 backdrop-blur-sm">
        {/* Контейнер модального окна */}
        <div className="w-full max-w-[600px] max-h-[90vh] bg-card-bg rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-secondary/10 font-geologica text-text-main">
          {/* Header */}
          <div className="p-8 flex items-center justify-between border-b border-secondary/10">
            <h2 className="text-[24px] font-semibold tracking-tight m-0">
              Добавить ученика
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-inner-bg text-text-muted hover:text-text-main transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div
            className="p-8 overflow-y-auto custom-scrollbar flex-1"
            style={{ maxHeight: "70vh" }}
          >
            {onlyExistingStudents ? (
              <div className="flex flex-col gap-4">
                <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                  Поиск студента
                </span>
                <StudentsSearch handleOnSelect={this.handleAddExisting} />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {/* Custom Tabs */}
                <div className="flex p-1 bg-inner-bg rounded-[18px] w-full">
                  <button
                    onClick={() => this.setActiveTab("new")}
                    className={`flex-1 py-3 rounded-[14px] text-[15px] font-medium transition-all duration-200 ${
                      activeTab === "new"
                        ? "bg-accent text-text-main shadow-lg"
                        : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    Новый
                  </button>
                  <button
                    onClick={() => this.setActiveTab("existing")}
                    className={`flex-1 py-3 rounded-[14px] text-[15px] font-medium transition-all duration-200 ${
                      activeTab === "existing"
                        ? "bg-accent text-text-main shadow-lg"
                        : "text-text-muted hover:text-text-main"
                    }`}
                  >
                    Существующий
                  </button>
                </div>

                {/* Tab Content */}
                <div className="transition-all duration-300">
                  {activeTab === "new" ? (
                    <div className="flex flex-col gap-6">
                      <StudentFormFields
                        isNew={true}
                        email={email}
                        firstName={firstName}
                        lastName={lastName}
                        birthDate={birthDate}
                        phone={phone}
                        level={level}
                        sex={sex}
                        age={age}
                        handleChange={this.handleChange}
                        handleAgeChange={this.handleAgeChange}
                        handleSexChange={this.handleSexChange}
                      />

                      <button
                        onClick={this.handleSave}
                        className="w-full mt-4 py-4 rounded-[18px] bg-accent text-text-main font-semibold text-[17px] shadow-lg shadow-accent/20 hover:bg-accent/70 transition-all duration-300 transform active:scale-[0.98]"
                      >
                        Создать и сохранить
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 pt-2">
                      <span className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                        Найти в базе
                      </span>
                      <StudentsSearch handleOnSelect={this.handleAddExisting} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
