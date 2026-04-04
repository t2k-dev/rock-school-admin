import React from "react";
import { StudentIcon } from "./icons/SideBarIcons/StudentIcon";
import { TeacherIcon } from "./icons/SideBarIcons/TeacherIcon";

export class Avatar extends React.Component {
    render() {
        const { style, type = "student" } = this.props;
        const Icon = type === "teacher" ? TeacherIcon : StudentIcon;

        return (
            <span
                className="avatar"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}
                aria-hidden="true"
            >
                <Icon style={{ width: "100%", height: "100%" }} />
            </span>
        );
    }
}