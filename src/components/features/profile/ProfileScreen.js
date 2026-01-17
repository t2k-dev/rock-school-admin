import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { changePassword } from '../../../services/apiAccountService';
import { Avatar } from '../../shared/Avatar';
import { EditIcon } from '../../shared/icons/EditIcon';

const ProfileScreen = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showAlert, setShowAlert] = useState({ show: false, variant: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data - in real app this would come from authentication context
  const user = {
    firstName: 'Маржан',
    lastName: 'Администратор',
    email: 'admin@rockschool.kz',
    role: 'Администратор',
    phone: '+7 (701) 123-45-67',
    joinDate: '15 января 2024'
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setShowAlert({
        show: true,
        variant: 'danger',
        message: 'Пожалуйста, заполните все поля'
      });
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setShowAlert({
        show: true,
        variant: 'danger',
        message: 'Новый пароль и подтверждение не совпадают'
      });
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setShowAlert({
        show: true,
        variant: 'danger',
        message: 'Пароль должен содержать минимум 6 символов'
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Make API call to change password
      await changePassword({
        email: user.email,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setShowAlert({
        show: true,
        variant: 'success',
        message: 'Пароль успешно изменен'
      });

      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Ошибка при изменении пароля. Попробуйте еще раз.';
      
      // Handle different error responses
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Неверный текущий пароль';
            break;
          case 401:
            errorMessage = 'Сессия истекла. Войдите в систему заново';
            break;
          case 500:
            errorMessage = 'Ошибка сервера. Попробуйте позже';
            break;
          default:
            errorMessage = error.response.data?.message || 'Произошла ошибка при изменении пароля';
        }
      }
      
      setShowAlert({
        show: true,
        variant: 'danger',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Card.Header>
              <h5 className="mb-0">Информация о пользователе</h5>
            </Card.Header>
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
                        <strong>Имя:</strong>
                        <div className="text-muted">{user.firstName}</div>
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong>
                        <div className="text-muted">{user.email}</div>
                      </div>
                      <div className="mb-3">
                        <strong>Дата регистрации:</strong>
                        <div className="text-muted">{user.joinDate}</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <strong>Роль:</strong>
                        <div>
                          <span className="badge bg-primary">{user.role}</span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <strong>Телефон:</strong>
                        <div className="text-muted">{user.phone}</div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Change Password Card */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Изменение пароля</h5>
            </Card.Header>
            <Card.Body>
              {showAlert.show && (
                <Alert 
                  variant={showAlert.variant}
                  dismissible
                  onClose={() => setShowAlert({ show: false, variant: '', message: '' })}
                >
                  {showAlert.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Текущий пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите текущий пароль"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Новый пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите новый пароль"
                        minLength="6"
                        required
                      />
                      <Form.Text className="text-muted">
                        Пароль должен содержать минимум 6 символов
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Подтверждение нового пароля</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Повторите новый пароль"
                        required
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Изменение...' : 'Изменить пароль'}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light p-3 rounded">
                      <h6>Требования к паролю:</h6>
                      <ul className="small text-muted mb-0">
                        <li>Минимум 6 символов</li>
                        <li>Рекомендуется использовать буквы и цифры</li>
                        <li>Избегайте простых паролей типа "123456"</li>
                        <li>Не используйте личную информацию</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;