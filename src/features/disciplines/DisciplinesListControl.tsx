import React from "react";
import { FormLabel } from "../../components/ui/FormLabel";

interface Discipline {
  id: number;
  name: string;
  isChecked: boolean;
}

interface DisciplinesListProps {
  disciplines: number[];
  onCheck: (id: number, isChecked: boolean) => void;
}

interface DisciplinesListState {
  checkboxes: Discipline[];
}

export class DisciplinesListControl extends React.Component<DisciplinesListProps, DisciplinesListState> {
  constructor(props: DisciplinesListProps) {
    super(props);

    this.state = {
      checkboxes: [
        { id: 1, name: "Гитара", isChecked: false },
        { id: 2, name: "Электрогитара", isChecked: false },
        { id: 3, name: "Бас-гитара", isChecked: false },
        { id: 4, name: "Укулеле", isChecked: false },
        { id: 5, name: "Вокал", isChecked: false },
        { id: 6, name: "Барабаны", isChecked: false },
        { id: 7, name: "Фортепиано", isChecked: false },
        { id: 8, name: "Скрипка", isChecked: false },
        { id: 9, name: "Экстрим Вокал", isChecked: false },
      ],
    };
  }

  componentDidUpdate(prevProps: DisciplinesListProps) {
    if (this.props.disciplines !== prevProps.disciplines) {
      this.setState((prevState) => {
        const updatedDisciplines = prevState.checkboxes.map((checkbox) => ({
          ...checkbox,
          isChecked: this.props.disciplines.includes(checkbox.id),
        }));
        return { checkboxes: updatedDisciplines };
      });
    }
  }

  handleChange = (checkboxId: number) => {
    this.setState((prevState) => {
      const updatedCheckboxes = prevState.checkboxes.map((checkbox) =>
        checkbox.id === checkboxId ? { ...checkbox, isChecked: !checkbox.isChecked } : checkbox
      );

      const updatedCheckbox = updatedCheckboxes.find((checkbox) => checkbox.id === checkboxId);
      if (updatedCheckbox) {
        this.props.onCheck(checkboxId, updatedCheckbox.isChecked);
      }

      return { checkboxes: updatedCheckboxes };
    });
  };

  render() {
    const { checkboxes } = this.state;

    const firstCol = checkboxes.slice(0, 4);
    const secondCol = [
      checkboxes[4], 
      checkboxes[8], 
      checkboxes[5], 
      checkboxes[6], 
      checkboxes[7]  
    ];

    const renderCheckbox = (item: Discipline, extraMargin: boolean = false) => (
      <label
        key={item.id}
        className={`flex items-center gap-3 cursor-pointer select-none group ${extraMargin ? "mt-5" : "mt-2.5"}`}
      >
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={item.isChecked}
            onChange={() => this.handleChange(item.id)}
          />
          <div className="w-6 h-6 border-2 border-white/10 rounded-lg bg-input-bg transition-all peer-checked:bg-accent peer-checked:border-accent group-hover:border-accent/50" />
          <svg
            className="absolute w-4 h-4 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-text-main text-[15px] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {item.name}
        </span>
      </label>
    );

    return (
      <div className="mb-6">
        <FormLabel className="block mb-4 font-bold text-lg opacity-100">
          Направления
        </FormLabel>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div className="flex flex-col">
            {firstCol.map((item) => renderCheckbox(item))}
          </div>
          <div className="flex flex-col">
            {secondCol.map((item, idx) => renderCheckbox(item, idx === 2))}
          </div>
        </div>
      </div>
    );
  }
}

export default DisciplinesListControl;