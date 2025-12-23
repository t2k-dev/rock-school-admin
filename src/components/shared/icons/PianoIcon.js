
export function PianoIcon({ onIconClick, color = "#000000", size = "24px" }) {
  return (
    <span title="Вокал">
      <svg xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      version="1.1" 
      style= {{shapeRendering:"geometricPrecision", textRendering:"geometricPrecision", imageRendering:"optimizeQuality", fillRule:"evenodd", clipRule:"evenodd"}}
viewBox="0 0 3.483 4.004"
 >
 <g id="Слой_x0020_1">
  <metadata id="CorelCorpID_0Corel-Layer"/>
  <path 
    className="fil0 str0" 
    fill={color}
    d="M0.004 1.996l2.905 0 0 0.554 0.37 0c0.11,0 0.2,0.09 0.2,0.201l0 0.354 -0.57 0 -0.283 0 -0.119 0.894 -0.259 0 0 -0.894 -1.682 0 0 0.894 -0.259 0 -0.119 -0.894 -0.184 0 0 -1.109zm1.878 -1.486l0 -0.506 0.989 0 0 1.327c0.003,0.022 0.004,0.043 0.004,0.062 0,0.109 -0.05,0.212 -0.14,0.304l-2.337 0c-0.197,-0.172 -0.312,-0.38 -0.297,-0.576 0.032,-0.453 1.354,-0.151 1.781,-0.611z"/>
 </g>
</svg>
    </span>
  );
}
