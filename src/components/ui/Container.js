import PropTypes from "prop-types";
import { Colors } from "../../constants/Colors";

export const Container = ({ children, className = "", style = {}, as: Component = "div", ...props }) => {
	const containerClassName = ["bg-[var(--container-bg)] p-10 rounded-[30px]", className].filter(Boolean).join(" ");
	const containerStyle = {
		"--container-bg": Colors.cardBg,
		...style,
	};

	return (
		<Component className={containerClassName} style={containerStyle} {...props}>
			{children}
		</Component>
	);
};

Container.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
	style: PropTypes.object,
	as: PropTypes.elementType,
};
