import React from "react";
import { Col, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { getStudents } from "../../services/apiStudentService";
import { StudentCardMin } from "./StudentCardMin";

export class StudentsSearch extends React.Component{
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
    if (students) {
      const filteredStudents = students.filter((s) => s.firstName.includes(searchText) || s.lastName.includes(searchText));
      studentsList = filteredStudents.map((item, index) => 
      <StudentCardMin 
        key={index} 
        item={item} 
        handleClick={() => this.handleStudentClick(item)}
      />
    
    );
    } else {
      studentsList = <Col>Нет записей</Col>;
    }

    return (
    
    <Form>
        <div>
            <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)} autoComplete="off"></Form.Control>
        </div>
        <div>{studentsList}</div>
    </Form>
    );
    }
}