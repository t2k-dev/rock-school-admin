import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { Container } from "../../../components/ui";
import { getBands } from "../../../services/apiBandService";
import BandCard from "./BandCard";

class Bands extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      searchText: "",
      bands: [],
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
    const returnedBands = await getBands();
    this.setState({ bands: returnedBands, isLoading: false });
  }

  renderBandsList(bands) {
    const { searchText } = this.state;
    const normalizedSearchText = searchText.toLowerCase();
    
    const filteredBands = bands?.
      filter((band) => band.name.toLowerCase().includes(normalizedSearchText)).
      sort((left, right) => left.name.localeCompare(right.name));

    if (!filteredBands || filteredBands.length === 0) {
      return <NoRecords />;
    } 

    return(
      <>
      {filteredBands.map((item, index) => <BandCard key={index} item={item} />)}
      </>
    );
  }

  render() {
    const { searchText, bands, isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
    }

    const activeBands = bands?.filter((b) => b.isActive);
    const inactiveBands = bands?.filter((b) => !b.isActive);

    return (
      <div style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Группы</div>
              </div>
              <div>
              </div>
            </div>
            <Container>
              <div>
              <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
              </div>
              <div className="mb-3 text-center">
                <Button as={Link} to="/admin/registerBand" variant="outline-success">
                  + Новая группа
                </Button>
              </div>
              <div className="space-y-5">{this.renderBandsList(activeBands)}</div>
              <h4 className="mb-3">Неактивные</h4>
              <div className="space-y-5">{this.renderBandsList(inactiveBands)}</div>
            </Container>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Bands;
