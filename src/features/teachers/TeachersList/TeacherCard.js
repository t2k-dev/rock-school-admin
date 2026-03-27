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
                    className="gap-4"
                    contentClassName="ml-3 grid items-start gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]"
                >
                        <div className="pt-1">
                            <h3 className="m-0 text-xl font-semibold">{this.props.item.firstName} {this.props.item.lastName}</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                            {disciplines.map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <DisciplineIcon disciplineId={item.disciplineId} />
                                    <span className="whitespace-nowrap">{getDisciplineName(item.disciplineId)}</span>
                                </div>
                            ))}
                        </div>
                </ListItem>
        )
    }
}

export default TeacherCard;