import { useState } from "react";

export function BackIcon({onIconClick, title, size="20px", color: propColor}) {
    
    const [isHovered, setIsHovered] = useState(false);
    
    const handleClick = (e) => {
        if(onIconClick) {
          onIconClick(e);
        }
    }

    const currentColor = isHovered ? '#ff6100' : (propColor || '#000000');

    return(
        <span title={title || "Назад"}>
            <svg 
                style={{cursor: onIconClick ? 'pointer' : 'default'}}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)} 
                onMouseLeave={() => setIsHovered(false)}
                width={size}
                height={size}
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                >
                <path fill={currentColor} d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
        </span>
    )
}