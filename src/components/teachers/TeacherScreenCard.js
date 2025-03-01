import React from "react";
import { Card, Row, Col, Image, Button, Container } from "react-bootstrap";
import noImage from "../../images/user.jpg";
import { Link } from "react-router-dom";
import { Avatar } from "../common/Avatar";

class TeacherScreenCard extends React.Component {
  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/teachers/edit/" + this.props.item.teacherId);
  };

  render() {
    const Level = {
      0: 'Начинающий',
      1: 'Продожающий',
      2: 'Продвинутый'
    }

    const { item } = this.props;
    return (
      <Card className="ms-col-2 mb-2">
        <Card.Body>
          <Container className="d-flex justify-content-between align-items-center" style={{ flexDirection: "row" }}>
            <Container style={{ width: "160px" }}>
              <Avatar></Avatar>
            </Container>
            <Container
              style={{ flexDirection: "column" }}
              className=""
            >
              <Container>
                <div style={{fontWeight:'bold', fontSize:'28px'}}>
                  {item.firstName} {item.lastName}
                </div>
                <div className="mt-2">{Level[item.level]}</div>
              </Container>
              <Container className="mt-2">
                <div>Играет в группе</div>
                <div className="d-inline">Нет</div>
              </Container>
            </Container>
            <Container>
                
            </Container>
            <Button
              variant="secondary"
              type="null"
              size="sm"
              onClick={this.handleEditClick}
            >
              Редактировать
            </Button>

          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default TeacherScreenCard;
