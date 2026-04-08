import React from "react";
import { ListItem } from "../../../components/lists/ListItem";
import { getDisciplineName } from "../../../constants/disciplines";
import { DisciplineIcon } from "../../disciplines/DisciplineIcon";

class TeacherCard extends React.Component{

    render(){
        const disciplines = this.props.item.disciplines || [];

        return(
                <ListItem
                    to={`/teacher/${this.props.item.teacherId}`}
                    avatarType="teacher"
                    className="gap-4"
                    contentClassName="ml-3 grid items-center gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
                >
                        <div className="flex items-center">
                            <h3 className="m-0 text-xl font-semibold">{this.props.item.firstName} {this.props.item.lastName}</h3>
                        </div>
                        <div className="flex flex-nowrap items-center justify-center gap-4 overflow-x-auto">
                            {disciplines.map((item, index) => (
                                <div key={index} className="flex min-w-[72px] flex-col items-center gap-2 text-center">
                                    <DisciplineIcon disciplineId={item.disciplineId} size="32px" />
                                    <span className="text-sm leading-tight">{getDisciplineName(item.disciplineId)}</span>
                                </div>
                            ))}
                        </div>
                </ListItem>
        )
    }
}

export default TeacherCard;