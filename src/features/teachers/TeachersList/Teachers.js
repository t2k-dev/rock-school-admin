import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { Container } from "../../../components/ui";
import { getTeachers } from "../../../services/apiTeacherService";
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
      <div style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Преподаватели</div>
              </div>
              <div>
              </div>
            </div>
            <Container>
              <div>
                <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
              </div>
              <div className="mb-3 text-center">
                <Button as={Link} to="/admin/registerTeacher" variant="outline-success">
                  + Новый преподаватель
                </Button>
              </div>
              <div className="space-y-5">{this.renderTeachers(activeTeachers)}</div>
              <h4 className="mb-3"> Неактивные </h4>
              <div className="space-y-5">{this.renderTeachers(inactiveTeachers)}</div>
            </Container>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Teachers;
