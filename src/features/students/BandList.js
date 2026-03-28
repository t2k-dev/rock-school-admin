import React from "react";
import { Link } from "react-router-dom";
import { GroupIcon } from "../../components/icons";

class BandList extends React.Component {
  render() {
    const { bands } = this.props;

    return (

      <div className="min-w-[180px] rounded-xl bg-[#161920] px-4 py-3">
        <div className="mb-2 flex items-center gap-2 text-[16px] font-bold text-[#E2E7F6]">
          <GroupIcon size="20px" />
          <span>Группы</span>
        </div>

        <div className="space-y-1">
          {bands && bands.length > 0 ? (
            bands.map((band, index) => (
              <div key={band.bandId || index} className="text-sm leading-5">
                <Link
                  to={`/band/${band.bandId}`}
                  className="text-[#94A3B8] no-underline transition-colors duration-200 hover:text-[#E2E7F6]"
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
