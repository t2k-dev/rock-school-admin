import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

import { getStudents } from "../../services/apiStudentService";

import StudentCard from "./StudentCard";

class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      students: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  async onFormLoad() {
    const returnedStudents = await getStudents();
    this.setState({ students: returnedStudents });
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };

  render() {
    const { searchText, students } = this.state;

    let studentsList;
    if (students) {
      const filteredStudents = students.filter((s) => s.firstName.includes(searchText));
      studentsList = filteredStudents.map((item, index) => <StudentCard key={index} item={item} />);
    } else {
      studentsList = <Col>Нет записей</Col>;
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row className="mb-4">
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Ученики</div>
              </div>
              <div>
                <Link to="/student/new">
                  <Button variant="outline-success">+ Новый ученик</Button>
                </Link>
              </div>
            </div>
            <div>
              <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
            </div>
            <div>{studentsList}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Students;
