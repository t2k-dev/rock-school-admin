import AttendanceStatus from "../constants/AttendanceStatus";

export function applyCalendarStyle(event) {
  const cancelStatuses = [4, 5, 6];

  if (event.isNew) {
    // Custom style for new events
    return {
      style: {
        backgroundColor: "#ffc839",
        color: "black", // Text color
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  }

  // Trial
  if (event.isTrial === true) {
    if (cancelStatuses.includes(event.status)) {
      return {
        style: {
          backgroundColor: "#a8a24d",
          color: "black",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }

    if (event.status === AttendanceStatus.ATTENDED) {
      return {
        style: {
          backgroundColor: "#f5ee87",
          color: "black",
          borderRadius: "5px",
          border: "0",
          textAlign: "center",
        },
      };
    }

    return {
      style: {
        backgroundColor: "#e1da77",
        color: "black",
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  }

  if (event.status === AttendanceStatus.NEW) {
    return {
      style: {
        backgroundColor: "#697ac9",
        color: "white",
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  }

  if (event.status === AttendanceStatus.ATTENDED) {
    return {
      style: {
        backgroundColor: "#44c072",
        color: "white",
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  }

  if (event.status === AttendanceStatus.MISSED) {
    return {
      style: {
        backgroundColor: "#ce6868",
        color: "white",
        borderRadius: "5px",
        border: "0",
        textAlign: "center",
      },
    };
  }

  // Default style for other events
  return {
    style: {
      backgroundColor: "#acacac",
      color: "white",
      borderRadius: "5px",
      border: "0",
      textAlign: "center",
    },
  };
}
