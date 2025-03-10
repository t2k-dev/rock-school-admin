import React from "react";
import { Card, Row, Col, Image, Button, Container } from "react-bootstrap";
import { Avatar } from "../common/Avatar";
import EditIcon from "../common/EditIcon";
import GroupIcon from "../icons/GroupIcon";

class StudentScreenCard extends React.Component {
  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/students/edit/" + this.props.item.studentId);
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
                  <EditIcon onIconClick={this.handleEditClick} />
                </div>
                <div className="mt-2">{Level[item.level]}</div>
              </Container>
            </Container>
            <Container>
            <Container style={{textAlign:'center'}} className="mt-2">
              <GroupIcon/>
                <div> Группа</div>
                <div >18pm</div>
              </Container>                
            </Container>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default StudentScreenCard;
