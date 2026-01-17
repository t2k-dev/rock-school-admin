import React from "react";
import { Button, Card, Container, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Avatar } from "../../shared/Avatar";
import { EditIcon, GroupIcon, InstagramIcon } from "../../shared/icons";

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

    const { item } = this.props;
    return (
      <Card className="ms-col-2 mb-2">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center" style={{ flexDirection: "row" }}>
            <div style={{ width: "160px" }}>
              <Avatar></Avatar>
            </div>
            <Container className="flex-grow-1">
              <Container>
                <div style={{ fontWeight: "bold", fontSize: "24px" }}>
                  {item.firstName} {item.lastName}
                  <EditIcon onIconClick={this.handleEditClick} />
                </div>
                <div className= "mt-1">
                  <InstagramIcon
                    size={"20px"}
                    title={"Instagram"}
                  />
                </div>
              </Container>
            </Container>
            <div>
              <Container style={{ textAlign: "center", marginRight: "100px" }} className="mt-2">
                <GroupIcon />
                <div style={{ fontWeight: "bold" }}> Группа</div>
                <div>18pm</div>
              </Container>
            </div>
            <div>
              <Stack gap={2} style={{ width: "200px" }}>
                <Button variant="outline-warning"
                  as={Link}
                  to={{
                    pathname: `/student/${item.studentId}/waitingSchedule`,
                    state: {student:item}
                  }}>
                  Предзапись
                </Button>
              </Stack>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default StudentScreenCard;
