import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Avatar } from "../Avatar";
import { HoverCard } from "../ui";

export const ListItem = ({
	to,
	children,
	avatarType = "student",
	className = "",
	contentClassName = "",
}) => {
	const cardClassName = [
		"mb-2 grid gap-4 no-underline text-inherit",
		"grid-cols-[70px_minmax(0,1fr)]",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<HoverCard as={Link} to={to} className={cardClassName}>
			<div>
				<Avatar type={avatarType} style={{ width: "70px", height: "70px" }} />
			</div>
			<div className={contentClassName}>{children}</div>
		</HoverCard>
	);
};

ListItem.propTypes = {
	to: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	avatarType: PropTypes.oneOf(["student", "teacher"]),
	className: PropTypes.string,
	contentClassName: PropTypes.string,
};
