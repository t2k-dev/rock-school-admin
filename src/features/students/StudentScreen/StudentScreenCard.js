import React from "react";
import { Card, Col, Container, Row, Stack } from "react-bootstrap";

import { Avatar } from "../../../components/Avatar";
import { EditIcon, InstagramIcon } from "../../../components/icons";
import BandList from "../BandList";

class StudentScreenCard extends React.Component {
  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/student/edit/${this.props.item.studentId}`);
  };

  render() {
    const Level = {
      0: "Начинающий (0)",
      1: "Продолжающий (1)",
      2: "Продвинутый",
      4: "Продолжающий (4)",
      10: "Бог (10)",
    };

    const { item, bands } = this.props;
    return (
      <Card className="mb-2 p-0">
        <Card.Body>
          <Container className="p-2">
            <Row>
              <Col md="2" className="text-center">
                <Avatar />
              </Col>
              <Col md="6">
                <div className="mt-4">
                  <div className="fw-bold" style={{ fontSize: "24px" }}>
                    {item.firstName} {item.lastName}
                    <EditIcon onIconClick={this.handleEditClick} />
                  </div>
                  <div className="mt-1">
                    <InstagramIcon size={"20px"} title={"Instagram"} />
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ flexDirection: "row" }}
                >
                  <div>
                    <BandList bands={bands} />
                  </div>
                  <div>
                    <Stack gap={2} style={{ width: "200px" }}>
                      {/*<Button variant="outline-warning"
                  as={Link}
                  to={{
                    pathname: `/student/${item.studentId}/waitingSchedule`,
                    state: {student:item}
                  }}>
                  Предзапись
                </Button>*/}
                    </Stack>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default StudentScreenCard;
