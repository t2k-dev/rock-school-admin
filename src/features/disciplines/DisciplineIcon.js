import React from "react";
import { BassGuitarIcon } from "../../components/icons/BassGuitarIcon";
import { CancelIcon } from "../../components/icons/CancelIcon";
import { DrumsIcon } from "../../components/icons/DrumsIcon";
import { ElectroGuitarIcon } from "../../components/icons/ElectroGuitarIcon";
import { ExtremeVocalIcon } from "../../components/icons/ExtremeVocalIcon";
import { GuitarIcon } from "../../components/icons/GuitarIcon";
import { PianoIcon } from "../../components/icons/PianoIcon";
import { UkuleleIcon } from "../../components/icons/UkuleleIcon";
import { ViolaIcon } from "../../components/icons/ViolaIcon";
import { VocalIcon } from "../../components/icons/VocalIcon";

export class DisciplineIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let iconControl;
    switch (this.props.disciplineId) {
      case 1:
        iconControl = <GuitarIcon color={this.props.color} size={this.props.size} />;
        break;
      case 2:
        iconControl = <ElectroGuitarIcon color={this.props.color} size={this.props.size} />;
        break;
      case 3:
        iconControl = <BassGuitarIcon color={this.props.color} size={this.props.size} />;
        break;
      case 4:
        iconControl = <UkuleleIcon color={this.props.color} size={this.props.size} />;
        break;
      case 5:
        iconControl = <VocalIcon color={this.props.color} size={this.props.size} />;
        break;
      case 6:
        iconControl = <DrumsIcon color={this.props.color} size={this.props.size} />;
        break;
      case 7:
        iconControl = <PianoIcon color={this.props.color} size={this.props.size} />;
        break;
      case 8:
        iconControl = <ViolaIcon color={this.props.color} size={this.props.size} />;
        break;
      case 9:
        iconControl = <ExtremeVocalIcon color={this.props.color} size={this.props.size} />;
        break;
      default:
        iconControl = <CancelIcon color={this.props.color} size={this.props.size} />;
    }

    return <div style={{ display: "inline-block" }}>{iconControl}</div>;
  }
}
