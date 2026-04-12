import React from "react";
import ScreenHeader from "../../../components/screens/ScreenHeader";
import { Avatar } from "../../../components/Avatar";
import { InstagramIcon } from "../../../components/icons";
import BandList from "../BandList";

const LEVEL_MAP: Record<number | string, string> = {
  0: "Начинающий (0)",
  1: "Продолжающий (1)",
  2: "Продвинутый",
  4: "Продолжающий (4)",
  10: "Бог (10)",
};

interface StudentScreenCardProps {
  item: {
    studentId: string | number;
    firstName: string;
    lastName: string;
    level: number | string;
  };
  bands: any[];
  history: any;
}

class StudentScreenCard extends React.Component<StudentScreenCardProps> {
  handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.history.push(`/student/edit/${this.props.item.studentId}`);
  };

  render() {
    const { item, bands } = this.props;
    const currentLevel = LEVEL_MAP[item.level] || "Уровень не указан";

    return (
      <ScreenHeader
        className="mb-6"
        avatar={<Avatar size="90px" type="student" />}
        title={`${item.firstName} ${item.lastName}`}
        titleClassName="text-[24px]"
        subtitle={currentLevel}
        onEdit={this.handleEditClick}
        meta={
          <div className="flex items-center gap-2">
            <InstagramIcon size="20px" title="Instagram" />
          </div>
        }
        aside={
          <div className="flex flex-col gap-3">
            <BandList bands={bands} />
          </div>
        }
      />
    );
  }
}

export default StudentScreenCard;
