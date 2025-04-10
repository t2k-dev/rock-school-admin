import React, { useState } from "react";

export function ExtremeVocalIcon({ onIconClick }) {
  const [color, setColor] = useState("#000000"); // Default color

  const handleClick = (e) => {
    if (onIconClick) {
      onIconClick(e);
    }
  };

  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        version="1.1"
        style={{shapeRendering: "geometricPrecision", textRendering:"geometricPrecision", imageRendering:"optimizeQuality", fillRule: "evenodd", clipRule:"evenodd"}}
        viewBox="0 0 46.567 46.765"
      >
        <g id="Слой_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            class="fil0 str0"
            d="M19.835 17.011l3.731 5.894 6.095 3.932 -6.648 6.648 -2.675 -1.658 -18.054 14.868 -1.107 -1.107 -1.107 -1.107 14.888 -18.077 -1.771 -2.745 6.648 -6.648zm10.071 -7.544l-1.709 -3.358 3.922 -5.882 -8.04 6.078 1.044 7.653 -0.503 0.503c-0.881,0.881 -0.881,2.323 0,3.204l4.165 4.165c0.881,0.881 2.323,0.881 3.204,0l0.414 -0.414 7.859 1.072 6.078 -8.04 -5.882 3.922 -3.494 -1.778c0.321,-0.815 0.154,-1.782 -0.502,-2.438l-4.166 -4.166c-0.643,-0.643 -1.585,-0.817 -2.39,-0.521z"
          />
        </g>
      </svg>
    </span>
  );
}
