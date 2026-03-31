import React from "react";
import { FormLabel } from "./ui";

export class SexControl extends React.Component {
  
  handleSexClick = (e) => {
    if (e.target.id === "rb_male") {
        this.props.onChange(1);
    } else {
        this.props.onChange(2);
    }
  };

  render() {
    const isMale = this.props.value === 1;
    const isFemale = this.props.value === 2;
    return (
      <div className="flex flex-col gap-3">
        <FormLabel>Пол</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          <label className={`flex cursor-pointer items-center justify-center rounded-[14px] border px-4 py-3 text-[15px] transition ${
            isMale
              ? "border-[var(--accent)] bg-accent/20 text-text-main"
              : "border-white/10 bg-inner-bg text-text-muted hover:border-white/20"
          }`}>
            <input
              name="group1"
              type="radio"
              id="rb_male"
              checked={isMale}
              onChange={this.handleSexClick}
              className="sr-only"
            />
            Мужской
          </label>
          <label className={`flex cursor-pointer items-center justify-center rounded-[14px] border px-4 py-3 text-[15px] transition ${
            isFemale
              ? "border-[var(--accent)] bg-accent/20 text-text-main"
              : "border-white/10 bg-inner-bg text-text-muted hover:border-white/20"
          }`}>
            <input
              name="group1"
              type="radio"
              id="rb_female"
              checked={isFemale}
              onChange={this.handleSexClick}
              className="sr-only"
            />
            Женский
          </label>
        </div>
      </div>
    );
  }
}
