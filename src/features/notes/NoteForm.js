import React from "react";
import { parse } from "date-fns";
import { ru } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { addNote, saveNote } from "../../services/apiNoteService";

// Стили для календаря
import "react-datepicker/dist/react-datepicker.css";

class NoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isNew: props.type === "New",
      note: {
        branchId: 1,
        status: 1,
      },
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { state } = this.props.location;
    if (state && state.note) {
      this.setState({ note: state.note });
    }
  }

  handleChange = (e) => {
    const { id, value } = e.target;
    const note = { ...this.state.note };
    note[id] = value;
    this.setState({ note: note });
  };

  handleUpdateCompleteDate = (date) => {
    const note = { ...this.state.note };
    note.completeDate = date;
    this.setState({ note });
  };

  handleSave = async (e) => {
    e.preventDefault();

    const requestBody = {
      branchId: this.state.note.branchId,
      description: this.state.note.description,
      status: this.state.note.status,
      comment: this.state.note.comment,
      completeDate: this.state.note.completeDate,
      actualCompleteDate: this.state.note.actualCompleteDate,
    };

    if (this.state.isNew) {
      await addNote(requestBody);
    } else {
      await saveNote(this.state.note.noteId, requestBody);
    }

    this.props.history.push("/home");
  };

  render() {
    const { description, comment, completeDate, status } = this.state.note;
    const { isNew } = this.state;

    return (
      <div className="h-full w-full flex justify-center items-start pt-[60px] font-geologica text-text-main">
        <div className="w-full max-w-[600px] px-6 flex flex-col gap-8">
          <h2 className="text-[40px] font-semibold tracking-tight m-0 text-center">
            {isNew ? "Новая активность" : "Редактировать активность"}
          </h2>

          <div className="p-8 rounded-[32px] shadow-2xl flex flex-col gap-8 bg-card-bg">
            <form onSubmit={this.handleSave} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                  Описание
                </label>
                <input
                  id="description"
                  type="text"
                  value={description || ""}
                  onChange={this.handleChange}
                  placeholder="введите текст..."
                  autoComplete="off"
                  className="w-full p-4 rounded-[16px] bg-inner-bg border border-secondary/20 text-text-main focus:outline-none focus:border-accent transition-all duration-200"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                  Статус
                </label>
                <div className="relative">
                  <select
                    id="status"
                    name="status"
                    value={status || ""}
                    onChange={this.handleChange}
                    className="w-full p-4 rounded-[16px] bg-inner-bg border border-secondary/20 text-text-main focus:outline-none focus:border-accent appearance-none cursor-pointer"
                  >
                    <option>выберите...</option>
                    <option value="1">Новое</option>
                    <option value="2">Отменено</option>
                    <option value="3">Выполнено</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                    ▼
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  value={comment || ""}
                  onChange={this.handleChange}
                  placeholder="введите текст..."
                  autoComplete="off"
                  rows="4"
                  className="w-full p-4 rounded-[16px] bg-inner-bg border border-secondary/20 text-text-main focus:outline-none focus:border-accent transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium uppercase tracking-[0.2em] opacity-40 ml-2">
                  Дата
                </label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <DatePicker
                      locale={ru}
                      selected={completeDate}
                      onChange={(date) =>
                        date && this.handleUpdateCompleteDate(date)
                      }
                      onChangeRaw={(e) => {
                        const rawValue = e.target.value;
                        try {
                          const parsedDate = parse(
                            rawValue,
                            "dd.MM.yyyy HH:mm",
                            new Date(),
                          );
                          if (!isNaN(parsedDate)) {
                            this.handleUpdateCompleteDate(parsedDate);
                          }
                        } catch (error) {
                          console.error("Invalid date format");
                        }
                      }}
                      dateFormat="dd.MM.yyyy HH:mm"
                      placeholderText="дд.мм.гггг чч:мм"
                      shouldCloseOnSelect={true}
                      showTimeSelect
                      timeFormat="HH:mm"
                      className="w-full p-4 rounded-[16px] bg-inner-bg border border-secondary/20 text-text-main focus:outline-none focus:border-accent transition-all duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => this.handleUpdateCompleteDate(new Date())}
                    className="px-6 py-4 rounded-[16px] bg-secondary/10 text-text-muted hover:bg-secondary/20 hover:text-text-main transition-all duration-200 font-medium text-[14px] whitespace-nowrap"
                  >
                    Сегодня
                  </button>
                </div>
              </div>

              <div className="h-[1px] w-full bg-secondary/20 my-2"></div>

              <button
                type="submit"
                className="w-full py-4 rounded-[18px] bg-accent text-text-main font-semibold text-[18px] shadow-lg shadow-accent/20 hover:bg-accent/70 transition-all duration-300 transform active:scale-[0.98]"
              >
                Сохранить
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default NoteForm;
