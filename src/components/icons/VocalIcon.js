import React, { useState } from "react";

export function VocalIcon({ onIconClick }) {
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
        width="18px"
        height="18px"
        version="1.1"
        style={{shapeRendering:"geometricPrecision",
            textRendering:"geometricPrecision",
            imageRendering: "optimizeQuality",
            fillRule: "evenodd",
            clipRule:"evenodd",
            fill:"#c22222"
        }}
        viewBox="0 0 4.261 4.297"
      >
        <g id="Слой_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            className="fil0"
            d="M2.273 0.884l0.429 0.678 0.701 0.452 -0.764 0.764 -0.308 -0.19 -2.076 1.709 -0.128 -0.127 -0.127 -0.127 1.712 -2.079 -0.203 -0.316 0.764 -0.764zm1.433 -0.808l0.479 0.479c0.102,0.101 0.102,0.267 0,0.369l-0.514 0.514c-0.101,0.101 -0.267,0.101 -0.369,0l-0.479 -0.479c-0.101,-0.101 -0.101,-0.267 0,-0.369l0.515 -0.514c0.101,-0.101 0.267,-0.101 0.368,0z"
          />
        </g>
      </svg>
    </span>
  );
}
