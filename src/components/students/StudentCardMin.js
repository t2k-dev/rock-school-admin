import { Card, Col, Image, Row } from 'react-bootstrap';
import noImage from '../../images/user.jpg';

export const StudentCardMin = ({
  item,
  handleClick
}) => {
  return (
    <Card className="ms-col-2 mb-2" onClick={handleClick}>
      <Card.Body className="p-1">
        <Row>
          <Col md="1">
            <Image src={noImage} className='img-preview' fluid='true'/>
          </Col>
          <Col>
            <h3>{item.firstName} {item.lastName}</h3>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}