import React from "react";
import { Alert, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import { activateBand, deactivateBand, getBandScreenDetails } from "../../../services/apiBandService";
import { BandScreenCard } from "./BandScreenCard";

const ERROR_MESSAGES = {
  LOAD_FAILED: "Не удалось загрузить данные группы",
  NO_BAND_ID: "Не указан ID группы",
  ACTIVATION_FAILED: "Не удалось изменить статус группы",
};

export class BandScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bandId: this.props.match?.params?.id,
      band: null,
      isLoading: true,
      isActivating: false,
      error: null,
    };
  }

  componentDidMount() {
    this.loadBandData();
  }

  async loadBandData() {
    const { bandId } = this.state;

    if (!bandId) {
      this.setState({
        error: ERROR_MESSAGES.NO_BAND_ID,
        isLoading: false,
      });
      return;
    }

    try {
      this.setState({ isLoading: true, error: null });
      
      const bandData = await getBandScreenDetails(bandId);
      
      this.setState({
        band: bandData,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load band data:", error);
      this.setState({
        error: ERROR_MESSAGES.LOAD_FAILED,
        isLoading: false,
      });
    }
  }

  handleActivateToggle = async () => {
    const { bandId, band } = this.state;
    
    try {
      this.setState({ isActivating: true });
      
      if (band.isActive) {
        await deactivateBand(bandId);
      } else {
        await activateBand(bandId);
      }
      
      // Reload data to get updated status
      await this.loadBandData();
    } catch (error) {
      console.error("Failed to toggle band status:", error);
      this.setState({
        error: ERROR_MESSAGES.ACTIVATION_FAILED,
        isActivating: false,
      });
    }
  };

  renderLoadingState = () => (
    <Container className="text-center" style={{ marginTop: "100px" }}>
      <Spinner animation="border" role="status" className="mb-3">
        <span className="visually-hidden">Загрузка...</span>
      </Spinner>
      <div>Загрузка данных группы...</div>
    </Container>
  );

  renderErrorState = () => (
    <Container style={{ marginTop: "40px" }}>
      <Alert variant="danger">
        <Alert.Heading>Ошибка</Alert.Heading>
        <p>{this.state.error}</p>
        <hr />
        <div className="d-flex justify-content-end">
          <Button 
            onClick={() => this.loadBandData()} 
            variant="outline-danger"
            disabled={this.state.isLoading}
          >
            Попробовать снова
          </Button>
        </div>
      </Alert>
    </Container>
  );

  render() {
    const { band, isLoading, isActivating, error } = this.state;

    if (isLoading) {
      return this.renderLoadingState();
    }

    if (error) {
      return this.renderErrorState();
    }

    if (!band) {
      return (
        <Container style={{ marginTop: "40px" }}>
          <Alert variant="warning">
            <Alert.Heading>Группа не найдена</Alert.Heading>
            <p>Запрашиваемая группа не существует или была удалена.</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button as={Link} to="/bands" variant="outline-warning">
                Вернуться к списку групп
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return (
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            {/* Header */}
            <div className="d-flex mb-4 align-items-center">
              <div className="flex-grow-1">
                <h2 className="mb-1">{band.name}</h2>
                <div className="text-muted">
                  {band.teacher?.firstName} {band.teacher?.lastName}
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button
                  variant={band.isActive ? "outline-warning" : "outline-success"}
                  onClick={this.handleActivateToggle}
                  disabled={isActivating}
                >
                  {isActivating ? (
                    <>
                      <Spinner size="sm" className="me-1" />
                      {band.isActive ? "Деактивация..." : "Активация..."}
                    </>
                  ) : (
                    band.isActive ? "Деактивировать" : "Активировать"
                  )}
                </Button>
                <Button
                  as={Link}
                  to={`/band/${band.bandId}/edit`}
                  variant="outline-primary"
                  disabled={!band.isActive}
                >
                  Редактировать
                </Button>
              </div>
            </div>

            {/* Status Alert */}
            {!band.isActive && (
              <Alert variant="warning" className="mb-4">
                <strong>Группа деактивирована</strong> - занятия не проводятся
              </Alert>
            )}

            {/* Band Details */}
            <BandScreenCard band={band} />

          </Col>
        </Row>
      </Container>
    );
  }
}