import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getBands } from "../../../services/apiBandService";
import { Loading } from "../../shared/Loading";
import { NoRecords } from "../../shared/NoRecords";
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

  renderBands(bands) {
    const { searchText } = this.state;
    
    const activeBands = bands?.
      filter((b) => b.name.includes(searchText)).
      sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        
        return 0;
      });

    if (!activeBands || activeBands.length === 0) {
      return <NoRecords />;
    } 

    return(
      <>
      {activeBands.map((item, index) => <BandCard key={index} item={item} />)}
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
      <Container style={{ marginTop: "40px" }}>
        <Row>
          <Col md="2"></Col>
          <Col md="8">
            <div className="d-flex mb-5">
              <div className="flex-grow-1">
                <div style={{ fontWeight: "bold", fontSize: "28px" }}>Группы</div>
              </div>
              <div>
                <Button as={Link} to="/admin/registerBand" variant="outline-success">
                  + Новая группа
                </Button>
              </div>
            </div>
            <div>
              <Form.Control className="mb-4" placeholder="Поиск..." value={searchText} onChange={(e) => this.handleSearchChange(e)}></Form.Control>
            </div>
            <div>{this.renderBands(activeBands)}</div>
            <h4 className="mb-3"> Неактивные </h4>
            <div>{this.renderBands(inactiveBands)}</div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Bands;
