import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { GroupIcon } from "../../shared/icons";

class BandList extends React.Component {
  render() {
    const { bands } = this.props;

    return (
      <Container style={{ marginRight: "100px" }} className="mt-2">
        <div className="mb-2">
          <GroupIcon size="20px" /> <span style={{ fontWeight: "bold", fontSize: "16px" }}>Группы</span>
        </div>
        <div style={{ fontWeight: "bold" }}> </div>
        <div>
          {bands && bands.length > 0 ? (
            bands.map((band, index) => (
              <div key={band.bandId || index} className="small">
                <Link to={`/band/${band.bandId}`} className="text-decoration-none">
                  {band.name}
                </Link>
              </div>
            ))
          ) : (
            <div className="text-muted small">Не участвует</div>
          )}
        </div>
      </Container>
    );
  }
}

export default BandList;
