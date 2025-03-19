import React from "react";
import { Card, Row, Col, Image, Button, Container } from "react-bootstrap";
import noImage from "../../images/user.jpg";
import { Link } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import EditIcon from "../common/EditIcon";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";

class TeacherScreenCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push("/teachers/edit/" + this.props.item.teacherId);
  };

  render() {
    const Level = {
      0: "Начинающий",
      1: "Продожающий",
      2: "Продвинутый",
    };

    const { item } = this.props;
    return (
      <Card className="ms-col-2 mb-2">
        <Card.Body>
          <Container className="d-flex justify-content-between align-items-center" style={{ flexDirection: "row" }}>
            <Container style={{ width: "160px" }}>
              <Avatar></Avatar>
            </Container>
            <Container style={{ flexDirection: "column" }} className="">
              <Container>
                <div style={{ fontWeight: "bold", fontSize: "28px", width: "500px" }}>
                  {item.firstName} {item.lastName}
                  <EditIcon onIconClick={this.handleEditClick} />
                </div>
                <div className="mt-2">Ветеран</div>
              </Container>
            </Container>
            <Container style={{width:"160px"}}>
              <div style={{textAlign:"center"}}>Загрузка</div>
              <div style={{ width: "120px" }}>
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: [20, 3],
                        color: ["rgb(254, 106, 1)", "#0dc2fd"],
                        backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
                        borderWidth: 3,
                        radius: "100%",
                      },
                    ],
                    options: {

                    },
                  }}
                />
              </div>
            </Container>
            <Container style={{width:"160px"}}>
              <div style={{textAlign:"center"}}>Посещаемость</div>
              <div style={{ width: "120px" }}>
                <Doughnut
                  data={{
                    datasets: [
                      {
                        data: [16, 84],
                        backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
                        borderWidth: 3,
                        radius: "100%",
                      },
                    ],
                    options: {

                    },
                  }}
                />
              </div>
            </Container>
            <Container style={{width:"160px"}}>
              <div style={{textAlign:"center"}}>Пробные</div>
              <div style={{ width: "120px" }}>
                
                <Doughnut
                  data={{
                    
                    datasets: [
                      {
                        data: [60, 40],
                        backgroundColor: ["rgb(204, 223, 243)", "#0dc2fd"],
                        borderWidth: 3,
                        radius: "100%",
                      },
                    ],
                    options: {

                    },
                  }}
                />
              </div>
            </Container>

          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default TeacherScreenCard;
