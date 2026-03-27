import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Avatar } from "../../../components/Avatar";
import { EditIcon } from "../../../components/icons/Icons";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";
import BandList from "../../students/BandList";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

class TeacherScreenCard extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditClick = this.handleEditClick.bind(this);
  }

  handleEditClick = (e) => {
    e.preventDefault();
    this.props.history.push(`/teacher/${this.props.item.teacherId}/edit`);
  };

  render() {
    const { item, bands } = this.props;
    return (
      <Card className="p-0 mb-2">
        <Card.Body>
          <Container className="p-2">
            <Row>
              <Col md="2" className="text-center">
                <Avatar />
              </Col>
              <Col md="4">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>
                  {item.firstName} {item.lastName}{" "}
                  {item.isActive ? "" : "(Отключен)"}
                  <EditIcon onIconClick={this.handleEditClick} />
                </div>
                <div className="mt-2 text-muted">Преподаватель</div>
                {item.disciplines &&
                  item.disciplines.map((id) => (
                    <DisciplineIcon key={id} disciplineId={id} />
                  ))}
              </Col>
              <Col md="2">
                <BandList bands={bands} />
              </Col>
              <Col md="4">
                <div
                  className="p-0"
                  style={{ width: "120px", display: "inline-block" }}
                >
                  <div style={{ textAlign: "center" }}>Загрузка</div>
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
                        options: {},
                      }}
                    />
                  </div>
                </div>
                <div
                  className="p-0"
                  style={{ width: "120px", display: "inline-block" }}
                >
                  <div style={{ textAlign: "center" }}>Посещаемость</div>
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
                        options: {},
                      }}
                    />
                  </div>
                </div>
                <div
                  className="p-0"
                  style={{ width: "120px", display: "inline-block" }}
                >
                  <div style={{ textAlign: "center" }}>Пробные</div>
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
                        options: {},
                      }}
                    />
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

export default TeacherScreenCard;
