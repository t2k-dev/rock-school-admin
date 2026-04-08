import type { CSSProperties } from "react";
import { StudentIcon } from "./icons/SideBarIcons/StudentIcon";
import { TeacherIcon } from "./icons/SideBarIcons/TeacherIcon";

interface AvatarProps {
    style?: CSSProperties;
    type: "student" | "teacher";
    size?: CSSProperties["width"];
}

export const Avatar = ({ style, type = "student", size = 100 }: AvatarProps) => {
    const Icon = type === "teacher" ? TeacherIcon : StudentIcon;

    return (
        <div
            className="inline-flex items-center justify-center rounded-full p-2"
            style={{
                width: size,
                height: size,
                border: "2px solid #9ba1ba",
                ...style,
            }}
            aria-hidden="true"
        >
            <Icon className="h-full w-full" />
        </div>
    );
};