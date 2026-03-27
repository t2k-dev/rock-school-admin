import React from "react";
import { ListItem } from "../../../components/lists/ListItem";

class StudentCard extends React.Component{

    render(){
        return(
            <ListItem 
                to={`/student/${this.props.item.studentId}`}
                className="items-center gap-3"
            >
                <h3 className="m-0 text-xl font-semibold">{this.props.item.firstName} {this.props.item.lastName}</h3>
            </ListItem>
        )
    }
}

export default StudentCard;