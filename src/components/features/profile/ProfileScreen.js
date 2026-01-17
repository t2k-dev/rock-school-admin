import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Avatar } from '../../shared/Avatar';
import { EditIcon } from '../../shared/icons/EditIcon';

const ProfileScreen = () => {
  // Mock user data - in real app this would come from authentication context
  const user = {
    firstName: 'Маржан',
    lastName: 'Администратор',
    email: 'admin@rockschool.kz',
    role: 'Администратор',
    phone: '+7 (701) 123-45-67',
    joinDate: '15 января 2024'
  };

  return (
    <Container style={{ marginTop: "40px", maxWidth: "800px" }}>
      <Row>
        <Col>
          <h2 className="mb-4">Профиль пользователя</h2>
        </Col>
      </Row>

      {/* User Information Card */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={3} className="text-center">
                  <Avatar style={{ width: "120px", height: "120px", marginBottom: "15px" }} />
                  <Button variant="outline-secondary" size="sm">
                    <EditIcon size="14px" />
                    Изменить фото
                  </Button>
                </Col>
                <Col md={9}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="text-muted">Имя</div>
                        <div>{user.firstName}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-muted">Email</div>
                        <div>{user.email}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="text-muted">Роль</div>
                        <div>{user.role}</div>
                      </div>
                      <div className="mb-3">
                        <div className="text-muted">Последний вход</div>
                        <div>{user.joinDate}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Security Settings Card */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="mb-2">Безопасность</h3>
                    <Link 
                    to="/change-password"
                    >
                      Изменить пароль
                    </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;