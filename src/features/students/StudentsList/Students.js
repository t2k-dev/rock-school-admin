import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NoRecords } from "../../../components/NoRecords";
import { Container } from "../../../components/ui";
import { getStudents } from "../../../services/apiStudentService";
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
    const { searchText } = this.state;

    return (
        <div style={{ marginTop: "40px" }}>
        <Row className="mb-4">
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Ученики</div>
              </div>
            </div>
            <Container>
              <div>
                <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
              </div>
              <div className="mb-3 text-center">  
                  <Button as={Link} to="/student" variant="outline-success">+ Новый ученик</Button>
              </div>
              <div>{this.renderStudentsList()}</div>
            </Container>
          </Col>
          
        </Row>
        </div>
    );
  }
}

export default Students;
