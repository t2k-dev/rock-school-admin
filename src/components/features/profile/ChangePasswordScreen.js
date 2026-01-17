import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { changePassword } from '../../../services/apiAccountService';

const ChangePasswordScreen = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showAlert, setShowAlert] = useState({ show: false, variant: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Mock user data - in real app this would come from authentication context
  const user = {
    email: 'admin@rockschool.kz'
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
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
    <Container style={{ marginTop: "40px", maxWidth: "600px" }}>
      <Row>
        <Col>
          <h2 className="mb-4">Изменение пароля</h2>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Смена пароля</h5>
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
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Текущий пароль</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPasswords.currentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Введите текущий пароль"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                          style={{ borderLeft: 0 }}
                        >
                          {showPasswords.currentPassword ? (
                            <i className="fa fa-eye-slash"></i>
                          ) : (
                            <i className="fa fa-eye"></i>
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Новый пароль</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Введите новый пароль"
                          minLength="6"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => togglePasswordVisibility('newPassword')}
                          style={{ borderLeft: 0 }}
                        >
                          {showPasswords.newPassword ? (
                            <i className="fa fa-eye-slash"></i>
                          ) : (
                            <i className="fa fa-eye"></i>
                          )}
                        </Button>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Пароль должен содержать минимум 6 символов
                      </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Подтверждение нового пароля</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Повторите новый пароль"
                          required
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          style={{ borderLeft: 0 }}
                        >
                          {showPasswords.confirmPassword ? (
                            <i className="fa fa-eye-slash"></i>
                          ) : (
                            <i className="fa fa-eye"></i>
                          )}
                        </Button>
                      </InputGroup>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Изменение...' : 'Изменить пароль'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline-secondary"
                        onClick={() => window.history.back()}
                      >
                        Отмена
                      </Button>
                    </div>
                  </Col>
                  <Col md={4}>
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

export default ChangePasswordScreen;