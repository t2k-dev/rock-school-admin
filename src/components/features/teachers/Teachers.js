import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getTeachers } from "../../../services/apiTeacherService";
import { Loading } from "../../shared/Loading";
import { NoRecords } from "../../shared/NoRecords";
import TeacherCard from "./TeacherCard";

class Teachers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
    this.setState({ isLoading: true });
    const returnedTeachers = await getTeachers();
    this.setState({ teachers: returnedTeachers, isLoading: false });
  }

  renderTeachers(teachers) {
    const { searchText } = this.state;
    
    const activeTeachers = teachers?.
      filter((s) => s.firstName.includes(searchText)).
      sort((a, b) => {
        if (a.firstName < b.firstName) return -1;
        if (a.firstName > b.firstName) return 1;
        
        return 0;
      });

    if (!activeTeachers || activeTeachers.length === 0) {
      return <NoRecords />;
    } 

    return(
      <>
      {activeTeachers.map((item, index) => <TeacherCard key={index} item={item} />)}
      </>
    );
  }

  render() {
    const { searchText, teachers, isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
    }
    
    const activeTeachers = teachers?.filter((t) => t.isActive);

    const inactiveTeachers = teachers?.filter((t) => !t.isActive);

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
            <div>{this.renderTeachers(activeTeachers)}</div>
            <h4 className="mb-3"> Неактивные </h4>
            <div>{this.renderTeachers(inactiveTeachers)}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Teachers;
