import React from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../components/Loading";
import { NoRecords } from "../../../components/NoRecords";
import { Button, Container, Input } from "../../../components/ui";
import { SectionTitle, SectionWrapper } from "../../../layout";
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
      <SectionWrapper>
        <div className="mx-auto max-w-5xl">
          <SectionTitle>Группы</SectionTitle>

          <Container className="flex flex-col gap-8">
            <label className="mb-6 flex flex-col gap-3">
              <Input
                placeholder="Поиск..."
                value={searchText}
                onChange={this.handleSearchChange}
              />
            </label>

            <div className="text-center">
              <Button
                as={Link}
                to="/admin/registerBand"
                variant="primary"
              >
                + Новая группа
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-[18px] font-semibold text-text-main">Активные группы</h3>
              <div className="space-y-5">{this.renderBandsList(activeBands)}</div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-4">
              <h3 className="m-0 text-[18px] font-semibold text-text-main">Неактивные группы</h3>
              <div className="space-y-5">{this.renderBandsList(inactiveBands)}</div>
            </div>
          </Container>
        </div>
      </SectionWrapper>
    );
  }
}

export default Bands;
