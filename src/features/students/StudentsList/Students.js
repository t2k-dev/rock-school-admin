import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { Button, Container, Input } from "../../../components/ui";
import { SectionTitle, SectionWrapper } from "../../../layout";
import { getStudents } from "../../../services/apiStudentService";
import StudentCard from "./StudentCard";

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchText: "",
      students: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    this.setState({ isLoading: true });
    const returnedStudents = await getStudents();
    this.setState({ students: returnedStudents, isLoading: false });
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  renderStudentsList() {
    const { searchText, students } = this.state;

    if (!students) {
      return <NoRecords />;
    }

    const normalizedSearchText = searchText.toLowerCase();

    return students
      .filter(
        (student) =>
          student.firstName.toLowerCase().includes(normalizedSearchText) ||
          student.lastName.toLowerCase().includes(normalizedSearchText)
      )
      .sort((left, right) => {
        if (left.firstName < right.firstName) return -1;
        if (left.firstName > right.firstName) return 1;
        return 0;
      })
      .map((item, index) => <StudentCard key={index} item={item} />);
  }

  render() {
    const { isLoading, searchText } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    return (
      <SectionWrapper>
        <div className="mx-auto max-w-5xl">
          <SectionTitle>Ученики</SectionTitle>

          <Container className="flex flex-col gap-8">
            {/* Search */}
            <label className="mb-6 flex flex-col gap-3">
              <Input
                placeholder="Поиск..."
                value={searchText}
                onChange={this.handleSearchChange}
              />
            </label>
            
            {/* Add button */}
            <div className="text-center">
              <Button
                as={Link}
                to="/student"
                variant="primary"
              >
                + Новый ученик
              </Button>
            </div>
            
            {/* Students list */}
            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-[18px] font-semibold text-text-main">Список учеников</h3>
              <div className="space-y-5">{this.renderStudentsList()}</div>
            </div>
          </Container>
        </div>
      </SectionWrapper>
    );
  }
}

export default Students;
