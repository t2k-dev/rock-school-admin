
import React from "react";

export class TestComponent2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disciplineId: this.props.location.state.disciplineId,
        };
    }
    render() {
        const { disciplineId } = this.state;
    
        return (
            <>
                {disciplineId}
            </>
        )
    }
}