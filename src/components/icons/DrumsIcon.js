import React from "react";

export function DrumsIcon({ onIconClick, color = "#000000", size = "24px" }) {
  return (
    <span title="Барабаны">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        version="1.1"
        style={{
          shapeRendering:"geometricPrecision",
          textRendering: "geometricPrecision",
          imageRendering: "optimizeQuality",
          fillRule: "evenodd",
          clipRule: "evenodd"
        }}
        viewBox="0 0 3.44 3.941"
      >
        <g id="Слой_x0020_1" fill={color}>
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            class="fil0"
            d="M1.603 2.13c0.695,0 1.257,-0.12 1.257,-0.267 0,-0.147 -0.562,-0.267 -1.257,-0.267 -0.039,0 -0.077,0.001 -0.116,0.002l0.307 0.234c0.016,0.012 0.019,0.034 0.008,0.05l-0.022 0.029c-0.012,0.016 -0.034,0.019 -0.05,0.008l-0.47 -0.312c-0.528,0.031 -0.914,0.134 -0.914,0.256 0,0.147 0.563,0.267 1.257,0.267z"
            
          />
          <path
            class="fil0"
            d="M1.603 3.629c0.73,0 1.322,-0.139 1.331,-0.312l0 0 0 -0.004 -0.036 -1.096c0,0.175 -0.596,0.316 -1.331,0.316 -0.734,0 -1.33,-0.141 -1.33,-0.316l0.036 1.096 0 0.004 0 0c0.008,0.173 0.601,0.312 1.33,0.312z"
          />
          <path
            class="fil0"
            d="M1.603 3.941c0.73,0 1.322,-0.15 1.331,-0.335l0 0 0 -0.004 0 -1.184c0,0.188 -0.596,0.34 -1.331,0.34 -0.734,0 -1.33,-0.152 -1.33,-0.34l0 1.184 0 0.004 0 0c0.008,0.185 0.601,0.335 1.33,0.335z"
          />
          <path
            class="fil0"
            d="M0.014 0.69l0.06 -0.08c0.023,-0.032 0.068,-0.039 0.1,-0.016l1.309 1.001 -0.091 0.003 -0.136 0.006 -1.227 -0.814c-0.032,-0.022 -0.038,-0.068 -0.015,-0.1zm1.716 1.229l-0.472 -0.313 0.002 0.001 0.47 0.312z"
          />
          <path
            class="fil0"
            d="M3.432 0.126l-0.048 -0.088c-0.019,-0.035 -0.063,-0.048 -0.097,-0.029l-1.774 0.99c-0.017,0.009 -0.023,0.031 -0.014,0.048l0.018 0.032c0.009,0.018 0.031,0.023 0.048,0.015l1.838 -0.871c0.035,-0.017 0.047,-0.062 0.029,-0.097z"
          />
        </g>
      </svg>
    </span>
  );
}
