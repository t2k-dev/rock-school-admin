import React from "react";
import { Col, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { getStudents } from "../../services/apiStudentService";
import { StudentCardMin } from "./StudentCardMin";

export class StudentsSearch extends React.Component {
  constructor(props) {
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

  handleSearchChange(e) {
    this.setState({ searchText: e.target.value });
  }

  handleStudentClick(item) {
    if (this.props.handleOnSelect) {
      this.props.handleOnSelect(item);
    }
  }

  render() {
    const { searchText, students } = this.state;

    let studentsList;
    if (students && students.length > 0) {
      const filteredStudents = students.filter(
        (s) =>
          s.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
          s.lastName.toLowerCase().includes(searchText.toLowerCase()),
      );

      studentsList = filteredStudents.map((item, index) => (
        <div key={index} style={{ background: "none" }}>
          <StudentCardMin
            item={item}
            handleClick={() => this.handleStudentClick(item)}
            style={{ background: "none" }}
          />
        </div>
      ));
    } else {
      studentsList = <Col style={{ background: "none" }}>Нет записей</Col>;
    }

    return (
      <Form style={{ background: "none" }}>
        <div style={{ background: "none" }}>
          <Form.Control
            className="mb-4 border-secondary/20 text-text-main focus:bg-transparent focus:text-text-main"
            placeholder="Поиск..."
            value={searchText}
            onChange={(e) => this.handleSearchChange(e)}
            autoComplete="off"
            style={{
              background: "none",
              backgroundColor: "transparent",
              color: "inherit",
            }}
          ></Form.Control>
        </div>
        <div style={{ background: "none" }}>{studentsList}</div>
      </Form>
    );
  }
}
