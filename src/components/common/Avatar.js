import React from "react";
import { Image } from 'react-bootstrap';
//import noImage from '../../images/user.jpg';
import noImage from '../../images/user2.png';

export class Avatar extends React.Component{


    render(){
        const imgSrc = noImage;
        return(<Image src={imgSrc} className="avatar" alt="Avatar" style={this.props.style}/>)
    }
}