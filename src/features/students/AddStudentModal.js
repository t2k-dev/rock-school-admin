import React from "react";
import { sub } from "date-fns";
import { X, UserPlus } from "lucide-react";

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
      activeTab: "new",
    };
  }

  setActiveTab = (tab) => this.setState({ activeTab: tab });

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  };

  handleAgeChange = (e) => {
    const age = parseInt(e.target.value, 10);
    if (!isNaN(age) && age > 0) {
      const birthDate = sub(new Date(), { years: age });
      this.setState({ age: age, birthDate: birthDate });
    } else {
      this.setState({ age: e.target.value, birthDate: "" });
    }
  };

  handleSexChange = (value) => this.setState({ sex: value });

  handleSave = async () => {
    const { email, firstName, lastName, birthDate, phone, level, sex } =
      this.state;
    const requestBody = {
      firstName,
      lastName,
      birthDate,
      sex,
      phone: phone.replace("+7 ", "").replace(/\s/g, ""),
      level,
      branchId: 1,
    };

    try {
      const response = await addStudent(requestBody);
      const studentId = response.data;
      if (this.props.onAddStudent) {
        this.props.onAddStudent({
          studentId,
          email,
          firstName,
          lastName,
          birthDate,
          phone,
          level,
          sex,
        });
      }
      this.props.handleClose();
    } catch (error) {
      console.error("Ошибка при добавлении студента:", error);
    }
  };

  handleAddExisting = (student) => {
    if (this.props.onAddStudent) this.props.onAddStudent(student);
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

    if (!show) return null;

    // Стили для инпутов, чтобы убрать системные фоны
    const inputResetStyle = {
      background: "none",
      backgroundColor: "transparent",
      outline: "none",
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-main-bg/60 backdrop-blur-sm">
        <div className="w-full max-w-[580px] max-h-[90vh] bg-card-bg rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-secondary/20 font-geologica text-text-main">
          {/* Header */}
          <div className="px-8 py-6 flex items-center justify-between border-b border-secondary/10 bg-inner-bg/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-accent/10 rounded-xl">
                <UserPlus size={22} className="text-accent" />
              </div>
              <h2 className="text-[22px] font-bold tracking-tight">
                Добавить ученика
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-inner-bg text-text-muted hover:text-text-main transition-all"
              style={inputResetStyle}
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-transparent">
            {onlyExistingStudents ? (
              <div className="flex flex-col gap-4">
                <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-text-muted/60 ml-1">
                  Поиск студента
                </span>
                <StudentsSearch handleOnSelect={this.handleAddExisting} />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex p-1 rounded-[20px] border border-secondary/20">
                  <button
                    onClick={() => this.setActiveTab("new")}
                    className={`flex-1 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${
                      activeTab === "new"
                        ? "bg-accent text-text-main"
                        : "text-text-muted hover:text-text-main"
                    }`}
                    style={activeTab !== "new" ? inputResetStyle : {}}
                  >
                    Новый профиль
                  </button>
                  <button
                    onClick={() => this.setActiveTab("existing")}
                    className={`flex-1 py-3 rounded-[16px] text-[14px] font-semibold transition-all ${
                      activeTab === "existing"
                        ? "bg-accent text-text-main"
                        : "text-text-muted hover:text-text-main"
                    }`}
                    style={activeTab !== "existing" ? inputResetStyle : {}}
                  >
                    Существующий
                  </button>
                </div>

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
                        customInputStyle={inputResetStyle}
                      />

                      <button
                        onClick={this.handleSave}
                        className="w-full mt-4 py-4 rounded-[20px] bg-accent/40 text-text-main font-bold text-[16px] hover:bg-accent/70 transition-all transform active:scale-[0.98]"
                        style={{ border: "none" }}
                      >
                        Создать и сохранить
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 pt-2">
                      <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-text-muted/60 ml-1">
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
