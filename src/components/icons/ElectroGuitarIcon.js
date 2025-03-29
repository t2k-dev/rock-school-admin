import React, { useState } from "react";

export function ElectroGuitarIcon({ onIconClick }) {
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
        width="22px"
        height="24px"
        version="1.1"
        style={{
            shapeRendering:"geometricPrecision",
            textRendering: "geometricPrecision",
            imageRendering: "optimizeQuality",
            fillRule: "evenodd",
            clipRule: "evenodd"
        }}
        viewBox="0 0 1.913 2.092"
      >
        <g id="Слой_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            class="fil0"
            d="M1.662 0.366l-0.674 0.875 0 0 0.401 -0.034c0.007,-0.001 0.014,0.004 0.018,0.01 0.005,0.006 0.006,0.013 0.005,0.02l-0.001 0.006c-0.001,0.007 -0.006,0.013 -0.012,0.017l-0.453 0.252 -0.203 0.577 -0.007 0.001c-0.036,0.008 -0.071,-0.012 -0.083,-0.047l-0.127 -0.377 -0.471 -0.017c-0.027,-0.001 -0.049,-0.021 -0.054,-0.048l0 -0.003c-0.004,-0.024 0.008,-0.044 0.028,-0.058l0.568 -0.396 0.161 -0.432c0.003,-0.009 0.01,-0.014 0.019,-0.017 0.009,-0.002 0.018,0 0.025,0.006l0.015 0.013c0.006,0.005 0.008,0.012 0.009,0.02l0.041 0.397 0.71 -0.831c0.002,-0.018 0.007,-0.06 0.018,-0.074l0.008 -0.012 -0.021 -0.017c-0.009,-0.007 -0.01,-0.02 -0.003,-0.029l0 0c0.007,-0.008 0.02,-0.01 0.029,-0.002l0.019 0.015 0.026 -0.035 -0.024 -0.02c-0.009,-0.007 -0.01,-0.02 -0.003,-0.029l0 0c0.007,-0.008 0.02,-0.01 0.029,-0.002l0.022 0.018 0.026 -0.035 -0.02 -0.017c-0.009,-0.007 -0.01,-0.02 -0.003,-0.029l0 0c0.007,-0.009 0.02,-0.01 0.029,-0.003l0.019 0.016 0.02 -0.028c0.014,-0.019 0.04,-0.022 0.056,-0.009l0.096 0.079c0.016,0.013 0.018,0.039 0.003,0.056l-0.024 0.026 0.018 0.015c0.009,0.007 0.01,0.02 0.003,0.028l0 0c-0.007,0.009 -0.02,0.01 -0.029,0.003l-0.02 -0.016 -0.029 0.033 0.021 0.017c0.009,0.007 0.01,0.02 0.003,0.029l0 0c-0.007,0.008 -0.02,0.01 -0.029,0.003l-0.023 -0.019 -0.029 0.032 0.018 0.015c0.008,0.007 0.01,0.02 0.003,0.029l0 0c-0.008,0.008 -0.021,0.01 -0.029,0.002l-0.02 -0.016 -0.009 0.011c-0.012,0.013 -0.048,0.026 -0.066,0.031z"
          />
        </g>
      </svg>
    </span>
  );
}
