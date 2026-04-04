import React from "react";
import noImage from "../../images/user.jpg";

export const StudentCardMin = ({ item, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="group mb-2 cursor-pointer rounded-xl p-2 transition-colors hover:bg-white/5 active:scale-[0.99]"
      style={{ background: "none" }}
    >
      <div className="flex items-center gap-4" style={{ background: "none" }}>
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-secondary/10">
          <img
            src={noImage}
            alt="User"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1" style={{ background: "none" }}>
          <h3 className="m-0 text-[16px] font-medium text-text-muted transition-colors group-hover:text-text-main">
            {item.firstName} {item.lastName}
          </h3>
        </div>
      </div>
    </div>
  );
};
