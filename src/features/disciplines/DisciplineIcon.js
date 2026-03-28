import React from "react";
import { BassGuitarIcon, CancelIcon, DrumsIcon, ElectroGuitarIcon, ExtremeVocalIcon, GuitarIcon, PianoIcon, UkuleleIcon, ViolaIcon, VocalIcon } from "../../components/icons";

export class DisciplineIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let iconControl;
    switch (this.props.disciplineId) {
      case 1:
        iconControl = (
          <GuitarIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 2:
        iconControl = (
          <ElectroGuitarIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 3:
        iconControl = (
          <BassGuitarIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 4:
        iconControl = (
          <UkuleleIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 5:
        iconControl = (
          <VocalIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 6:
        iconControl = (
          <DrumsIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 7:
        iconControl = (
          <PianoIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 8:
        iconControl = (
          <ViolaIcon color={this.props.color} size={this.props.size} />
        );
        break;
      case 9:
        iconControl = (
          <ExtremeVocalIcon color={this.props.color} size={this.props.size} />
        );
        break;
      default:
        iconControl = (
          <CancelIcon color={this.props.color} size={this.props.size} />
        );
    }

    return <div style={{ display: "inline-block" }}>{iconControl}</div>;
  }
}
