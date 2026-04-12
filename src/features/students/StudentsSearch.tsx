import React from "react";
import { getStudents } from "../../services/apiStudentService";
import { StudentCardMin } from "./StudentCardMin";
import { Input } from "../../components/ui/Input";

interface Student {
  studentId: string | number;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface StudentsSearchProps {
  handleOnSelect?: (student: Student) => void;
}

interface StudentsSearchState {
  searchText: string;
  students: Student[];
}

export class StudentsSearch extends React.Component<
  StudentsSearchProps,
  StudentsSearchState
> {
  constructor(props: StudentsSearchProps) {
    super(props);
    this.state = {
      searchText: "",
      students: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleStudentClick = this.handleStudentClick.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const returnedStudents = await getStudents();
    this.setState({ students: returnedStudents });
  }

  handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ searchText: e.target.value });
  }

  handleStudentClick(item: Student) {
    if (this.props.handleOnSelect) {
      this.props.handleOnSelect(item);
    }
  }

  render() {
    const { searchText, students } = this.state;

    const filteredStudents = (students || []).filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchText.toLowerCase()),
    );

    return (
      <div className="bg-transparent">
        <div className="mb-6">
          <Input
            placeholder="Поиск"
            value={searchText}
            onChange={this.handleSearchChange}
            name="search"
          />
        </div>

        <div className="space-y-2">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((item, index) => (
              <button key={item.studentId || index} className="bg-transparent">
                <StudentCardMin
                  item={item}
                  handleClick={() => this.handleStudentClick(item)}
                />
              </button>
            ))
          ) : (
            <div className="text-text-muted px-4 py-2">Нет записей</div>
          )}
        </div>
      </div>
    );
  }
}

export default StudentsSearch;
