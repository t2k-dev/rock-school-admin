import React from "react";
import { Link } from "react-router-dom";
import { GroupIcon } from "../../components/icons/Icons";

class BandList extends React.Component {
  render() {
    const { bands } = this.props;

    return (
<<<<<<< HEAD
      <div className="min-w-[180px] rounded-xl bg-[#161920] px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-[16px] font-bold text-[#E2E7F6]">
          <GroupIcon size="20px" />
          <span>Группы</span>
=======
      <Container style={{ marginRight: "100px" }} className="mt-2">
        <div className="mb-2">
          <GroupIcon size="20px" />{" "}
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>Группы</span>
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
        </div>

        <div className="space-y-1">
          {bands && bands.length > 0 ? (
            bands.map((band, index) => (
<<<<<<< HEAD
              <div key={band.bandId || index} className="text-sm leading-5">
                <Link
                  to={`/band/${band.bandId}`}
                  className="text-[#94A3B8] no-underline transition-colors duration-200 hover:text-[#E2E7F6]"
=======
              <div key={band.bandId || index} className="small">
                <Link
                  to={`/band/${band.bandId}`}
                  className="text-decoration-none"
>>>>>>> 04387c4 (﻿add uqly icons, add ts, doing header)
                >
                  {band.name}
                </Link>
              </div>
            ))
          ) : (
            <div className="text-sm text-[#94A3B8]">Не участвует</div>
          )}
        </div>
      </div>
    );
  }
}

export default BandList;
