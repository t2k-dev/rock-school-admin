import React from "react";
import { Card, Container } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Avatar } from "../../shared/Avatar";
import { DisciplineIcon } from "../../shared/discipline/DisciplineIcon";
import { EditIcon } from "../../shared/icons";

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

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
    const { item } = this.props;
    return (
      <Card className="ms-col-2 mb-2">
        <Card.Body>
          <Container className="d-flex justify-content-between align-items-center p-0" style={{ flexDirection: "row" }}>
            <Container style={{ width: "160px" }}>
              <Avatar></Avatar>
            </Container>
            <Container style={{ flexDirection: "column" }} className="flex-fill">
              <Container>
                <div style={{ fontWeight: "bold", fontSize: "28px", width: "500px" }}>
                  {item.firstName} {item.lastName} {item.isActive ? "" : "(Отключен)"}
                  <EditIcon onIconClick={this.handleEditClick} />
                </div>
                <div className="mt-2 text-muted">Преподаватель</div>
                {item.disciplines && item.disciplines.map((id) => <DisciplineIcon key={id} disciplineId={id} />)}
              </Container>
            </Container>

            <Container className="d-flex p-0">
              <Container className="p-0" style={{ width: "120px" }}>
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
              </Container>
              <Container className="p-0" style={{ width: "120px" }}>
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
              </Container>
              <Container className="p-0" style={{ width: "120px" }}>
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
              </Container>
            </Container>
          </Container>
        </Card.Body>
      </Card>
    );
  }
}

export default TeacherScreenCard;
