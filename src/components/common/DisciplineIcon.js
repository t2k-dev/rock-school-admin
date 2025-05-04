import React from "react";
import { BassGuitarIcon } from "../icons/BassGuitarIcon";
import { ElectroGuitarIcon } from "../icons/ElectroGuitarIcon";
import { ExtremeVocalIcon } from "../icons/ExtremeVocalIcon";
import { GuitarIcon } from "../icons/GuitarIcon";
import { UkuleleIcon } from "../icons/UkuleleIcon";
import { VocalIcon } from "../icons/VocalIcon";

export class DisciplineIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let iconControl;
    switch (this.props.disciplineId) {
      case 1:
        iconControl = <GuitarIcon color={this.props.color}/>;
        break;
      case 2:
        iconControl = <ElectroGuitarIcon color={this.props.color}/>;
        break;
      case 3:
        iconControl = <BassGuitarIcon color={this.props.color}/>;
        break;
      case 4:
        iconControl = <UkuleleIcon color={this.props.color}/>;
        break;
      case 5:
        iconControl = <VocalIcon color={this.props.color}/>;
        break;
      case 9:
        iconControl = <ExtremeVocalIcon color={this.props.color}/>;
        break;
      default:
        iconControl = <div>#</div>;
    }

    return <div style={{ display: "inline-block" }}>{iconControl}</div>;
  }
}
