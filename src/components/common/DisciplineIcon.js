import React from "react";
import { Form } from "react-bootstrap";
import { VocalIcon } from "../icons/VocalIcon";
import { GuitarIcon } from "../icons/GuitarIcon";
import { BassGuitarIcon } from "../icons/BassGuitarIcon";
import { ElectroGuitarIcon } from "../icons/ElectroGuitarIcon";
import { ExtremeVocalIcon } from "../icons/ExtremeVocalIcon";
import { UkuleleIcon } from "../icons/UkuleleIcon";

export class DisciplineIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let iconControl;
    switch (this.props.disciplineId) {
      case 1:
        iconControl = <GuitarIcon />;
        break;
      case 2:
        iconControl = <ElectroGuitarIcon />;
        break;
      case 3:
        iconControl = <BassGuitarIcon />;
        break;
      case 4:
        iconControl = <UkuleleIcon />;
        break;
      case 5:
        iconControl = <VocalIcon />;
        break;
      case 9:
        iconControl = <ExtremeVocalIcon />;
        break;
      default:
        iconControl = <div>#</div>;
    }

    return <div style={{ display: "inline-block" }}>{iconControl}</div>;
  }
}
