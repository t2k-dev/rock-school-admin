import React from "react";
<<<<<<< HEAD
import { CancelIcon } from "../../components/icons/CancelIcon";
import { BassGuitarIcon } from "../../components/icons/Disciplines/BassGuitarIcon";
import { DrumsIcon } from "../../components/icons/Disciplines/DrumsIcon";
import { ElectroGuitarIcon } from "../../components/icons/Disciplines/ElectroGuitarIcon";
import { ExtremeVocalIcon } from "../../components/icons/Disciplines/ExtremeVocalIcon";
import { GuitarIcon } from "../../components/icons/Disciplines/GuitarIcon";
import { PianoIcon } from "../../components/icons/Disciplines/PianoIcon";
import { UkuleleIcon } from "../../components/icons/Disciplines/UkuleleIcon";
import { ViolaIcon } from "../../components/icons/Disciplines/ViolaIcon";
import { VocalIcon } from "../../components/icons/Disciplines/VocalIcon";
=======
import { BassGuitarIcon } from "../../components/icons/Icons/BassGuitarIcon";
import { CancelIcon } from "../../components/icons/Icons/CancelIcon";
import { DrumsIcon } from "../../components/icons/Icons/DrumsIcon";
import { ElectroGuitarIcon } from "../../components/icons/Icons/ElectroGuitarIcon";
import { ExtremeVocalIcon } from "../../components/icons/Icons/ExtremeVocalIcon";
import { GuitarIcon } from "../../components/icons/Icons/GuitarIcon";
import { PianoIcon } from "../../components/icons/Icons/PianoIcon";
import { UkuleleIcon } from "../../components/icons/Icons/UkuleleIcon";
import { ViolaIcon } from "../../components/icons/Icons/ViolaIcon";
import { VocalIcon } from "../../components/icons/Icons/VocalIcon";
>>>>>>> 995dbf5 (﻿add uqly icons, add ts, doing header)

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
