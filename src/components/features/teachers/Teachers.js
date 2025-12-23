import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTeachers } from "../../../services/apiTeacherService";
import TeacherCard from "./TeacherCard";

class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      teachers: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    this.onFormLoad();
  }

  handleSearchChange = (e) => {
    this.setState({ searchText: e.target.value });
  };
  
  async onFormLoad() {
    const returnedTeachers = await getTeachers();
    this.setState({ teachers: returnedTeachers });
  }

  render() {
    const { searchText, teachers } = this.state;

    let teachersList;
    if (teachers) {
      const filteredTeachers = teachers.filter((s) => s.firstName.includes(searchText));

      filteredTeachers.sort((a, b) => {
        if (!a.isActive && b.isActive) return 1;
        if (a.isActive && !b.isActive) return -1;
        if (a.firstName < b.firstName) return -1;
        if (a.firstName > b.firstName) return 1;
        
        return 0;
      });

      teachersList = filteredTeachers.map((item, index) => <TeacherCard key={index} item={item} />);
    } else {
      teachersList = <Col>Нет записей</Col>;
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Преподаватели</div>
              </div>
              <div>
                <Button as={Link} to="/admin/registerTeacher" variant="outline-success">
                  + Новый преподаватель
                </Button>
              </div>
            </div>
            <div>
              <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
            </div>
            <div>{teachersList}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Teachers;
