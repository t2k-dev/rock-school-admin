import React, { useState } from "react";

function GroupIcon({ onIconClick }) {
  const [color, setColor] = useState("#000000"); // Default color

  const handleClick = (e) => {
    if (onIconClick) {
      onIconClick(e);
    }
  };

  return (
    <span>
      <svg
        onClick={handleClick}
        xmlns="http://www.w3.org/2000/svg"
        width={30}
        height={30}
        id="Layer_1"
        x="0px"
        y="0px"
        viewBox="0 0 511.999 511.999"
        style={{
          enableBackground:'new 0 0 511.999 511.999;',
          fill:"#c22222"
        }}
      >
        <g>
          <g>
            <path d="M259.858,411.656c3.161,8.504,11.221,13.762,19.79,13.762c2.442,0,4.927-0.427,7.351-1.328    c10.929-4.062,16.496-16.214,12.433-27.142l-16.03-43.134h-40.766v-16.476c11.511,0,36.586,0,47.623,0    c6.065,0,10.982-4.917,10.982-10.982c0-5.988-4.858-10.982-10.982-10.982v-56.182c1.788,0,3.47-0.437,4.962-1.194    c0.482-4.494,2.509-8.759,5.803-11.962c-1.012-5.036-5.453-8.808-10.765-8.808h-78.244c8.887-4.518,39.522-20.093,49.086-24.956    c-6.688,1.632-13.559,0.766-19.426-2.146l-36.195,28.357c1.81,6.67,2.693,13.713,2.42,20.711    c-0.634,16.309-7.456,31.157-19.91,40.915c-5.741,4.498-12.287,7.59-19.246,9.272c5.698,10.367,2.225,4.049,15.37,27.961h36.555    c0,8.172,0,73.898,0,82.541l-14.545,14.547l1.396,29.668l24.14-24.142l50.267,50.28c4.29,4.289,11.244,4.29,15.532,0.002    c4.289-4.288,4.29-11.242,0.002-15.532l-54.827-54.842v-54.549L259.858,411.656z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M440.153,271.681l-5.45-0.382v79.255l23.06-48.794C464.105,288.337,454.949,272.719,440.153,271.681z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M319.15,278.847c-4.064,1.003-8.411,0.687-12.416-1.053v26.611c1.703,1.282,3.3,3.325,4.588,4.865h68.469v-0.001    c0,0,0-41.319,0-45.383L319.15,278.847z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M355.157,3.322c-1.202-2.788-4.438-4.074-7.226-2.871l-86.207,37.171c-9.089-2.874-18.85,2.008-21.947,11.074    l-24.766,72.535c-1.201,3.514-1.22,7.188-0.246,10.56c3.059-2.163,6.523-3.703,10.16-4.531c1.827-3.661,4.472-6.982,7.901-9.668    c4.992-3.911,11.232-6.065,17.568-6.064c1.682,0,3.336,0.162,4.957,0.443l17.723-51.907c0.657-1.925,0.942-3.883,0.929-5.807    l78.785-43.956C355.207,8.94,356.281,5.93,355.157,3.322z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M507.016,116.525c-3.824-6.484-11.157-9.596-18.159-8.382l-53.809-81.317c-1.541-2.31-4.623-3.154-7.137-1.836    c-2.69,1.409-3.727,4.733-2.318,7.422l44.724,85.33l-40.878,24.104c-56.959,1.064-54.428,1.155-54.428,1.155l-72.608-1.152    c0.405,2.39,0.524,4.809,0.369,7.21c-0.233,3.608-1.077,7.17-2.538,10.508c3.344,8.933,1.959,19.058-3.678,26.793    c-1.802,2.472-3.787,4.438-6.091,6.135l-0.448,28.259h0.244c11.11,0,20.692,6.636,25.01,16.15l19.558-11.682    c14.155-8.456,29.284-15.058,45.072-19.696c0.364-4.211,1.68-8.152,3.735-11.606l0.255-16.031l50.831-0.95    c3.031-0.057,5.996-0.896,8.606-2.436l57.471-33.889C509.168,135.679,511.952,124.893,507.016,116.525z"></path>
          </g>
        </g>
        <g>
          <g>
            <circle cx="338.657" cy="92.15" r="36.46"></circle>
          </g>
        </g>
        <g>
          <g>
            <path d="M507.242,212.881c-0.136-1.453-1.317-2.589-2.775-2.669l-35.233-1.927c-17.115-0.937-34.242,0.599-51.005,4.574v-4.951    c0-6.162-5.052-10.982-10.982-10.982c-6.059,0-10.982,4.953-10.982,10.982v10.345c-17.705,4.368-33.929,9.725-52.988,21.11    l-30.293,18.094c-1.254,0.749-1.771,2.303-1.215,3.654c0.557,1.354,2.02,2.091,3.433,1.742l81.062-20.001    c0,3.487,0,160.811,0,162.214c-7.598,7.596-61.624,61.617-69.642,69.635c-4.29,4.288-4.29,11.242-0.001,15.531    c4.288,4.289,11.243,4.29,15.531,0c6.231-6.229,47.585-47.58,54.112-54.105v13.484c0,6.065,4.917,10.982,10.982,10.982    c6.065,0,10.982-4.917,10.982-10.982v-13.484c6.531,6.531,47.869,47.87,54.104,54.105c4.29,4.289,11.244,4.288,15.532,0    c4.289-4.289,4.289-11.243,0-15.531c-7.86-7.86-57.902-57.902-69.636-69.636c0-7.521,0-160.786,0-167.633l86.784-21.412    C506.431,215.67,507.38,214.334,507.242,212.881z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M48.717,366.536v122.532c0,12.664,10.266,22.931,22.931,22.931c12.665,0,22.931-10.267,22.931-22.931V379.693    C78.396,380.12,62.525,375.111,48.717,366.536z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M193.124,487.989l-5.002-106.32c-0.164-3.492-1.126-6.902-2.81-9.968l-28.726-52.256    c-1.605,19.34-10.315,36.824-25.841,48.197l11.815,21.493l4.753,101.01c0.594,12.635,11.314,22.421,23.984,21.828    C183.946,511.378,193.72,500.641,193.124,487.989z"></path>
          </g>
        </g>
        <g>
          <g>
            <circle cx="99.523" cy="84.17" r="39.605"></circle>
          </g>
        </g>
        <g>
          <g>
            <path d="M277.79,158.527c3.222-2.524,1.174-0.915,1.993-1.572c5.538-4.46,6.191-12.392,2.033-17.7    c-0.016-0.02-0.033-0.037-0.05-0.057c-4.233-5.341-12.115-6.465-17.693-2.157c-0.023,0.018-0.048,0.032-0.071,0.05l-1.864,1.46    l-3.751-4.788c-0.013-0.017-0.028-0.03-0.041-0.047c-3.508-4.419-9.882-5.071-14.205-1.686c-0.001,0.001-0.003,0.002-0.004,0.003    c-4.412,3.457-5.186,9.837-1.729,14.249l3.752,4.788l-3.195,2.503c-3.156-4.029-2.337-2.983-3.752-4.788    c-0.002-0.002-0.004-0.004-0.006-0.007c-3.445-4.388-9.834-5.177-14.244-1.724c-4.412,3.457-5.187,9.837-1.731,14.251l3.752,4.788    l-59.056,46.267c-0.02-0.017-0.04-0.032-0.06-0.049c-23.329-19.815-53.325-16.376-63.213,6.978    c-2.151,5.079-5.96,9.745-11.184,12.918l21.76,16.541c7.321-6.033,17.917-4.681,23.578,2.544    c5.642,7.202,4.378,17.613-2.824,23.255c-3.392,2.657-7.496,3.764-11.478,3.458c-0.705,6.163-2.943,12.086-6.621,17.294    c-5.795,8.207-14.625,13.669-24.381,15.318l3.871,4.941c3.457,4.412,2.682,10.793-1.729,14.249    c-4.414,3.457-10.792,2.683-14.25-1.731l-22.261-28.412l-38.815-27.409c-4.892,24.919,6.99,51.867,25.603,69.15    c20.8,19.267,52.882,28.003,75.089,10.606c10.499-8.225,16.275-20.629,17.331-34.491c0.98-12.868,10.666-23.376,23.362-25.41    c24.064-3.856,36.138-31.238,21.87-59.776l59.056-46.267l3.752,4.788c0.002,0.002,0.004,0.004,0.007,0.008    c3.646,4.642,10.607,5.274,15.011,1.055c0.004-0.004,0.011-0.009,0.016-0.013c3.665-3.524,4.219-9.391,0.946-13.569l-3.752-4.788    l3.195-2.503l3.752,4.788c3.396,4.335,9.774,5.237,14.25,1.731c4.407-3.452,5.192-9.833,1.731-14.251L277.79,158.527z"></path>
          </g>
        </g>
        <g>
          <g>
            <path d="M150.923,136.401c-11.176,0-91.063,0-102.794,0c-24.813,0-45.099,20.185-45.222,44.939    c-0.124,15.402-0.244,30.381-0.366,45.585v0.016c-0.054,6.805,3.147,12.528,8.083,16.013l65.644,46.354    c8.599,6.072,20.534,4.05,26.634-4.589c6.088-8.621,4.033-20.545-4.588-26.633c-35.552-25.104-27.978-19.756-57.479-40.587    c0.239-29.762,0.14-17.415,0.288-35.911c0,0,0-0.001,0-0.002c0.011-2.09,1.712-3.777,3.802-3.771    c2.09,0.006,3.78,1.702,3.78,3.792v18.992l23.385,16.513c2.259,0.217,6.407,0.823,6.931,0.823c3.818,0,7.248-2.275,8.739-5.795    c3.447-8.14,8.635-14.963,15.423-20.28c9.034-7.079,20.172-10.819,32.208-10.818c4.848,0,9.722,0.608,14.534,1.778v-0.147    c0-1.857,1.299-3.462,3.116-3.848s3.656,0.551,4.412,2.248c0.554,1.244,0.898,2.702,0.888,4.4c3.008,1.167,5.97,2.55,8.86,4.154    l26.144-20.483C186.179,148.996,170.21,136.401,150.923,136.401z"></path>
          </g>
        </g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </svg>
      
    </span>
  );
}

export default GroupIcon;