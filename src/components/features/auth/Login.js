import { useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { login as loginAPI } from '../../../services/apiAuthService';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();
  const location = useLocation();
  const { login } = useAuth();

  // Get the page user was trying to visit before being redirected to login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.login.trim() || !formData.password.trim()) {
      setError('Пожалуйста, заполните все поля');
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginAPI(formData);
      
      // Use the auth context to handle login
      login(response.token, response.user || { login: formData.login });

      // Redirect to the page user was trying to visit or home
      history.replace(from);
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle different error responses
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Неверный логин или пароль');
            break;
          case 403:
            setError('Доступ запрещен');
            break;
          case 500:
            setError('Ошибка сервера. Попробуйте позже');
            break;
          default:
            setError('Произошла ошибка при входе в систему');
        }
      } else {
        setError('Ошибка сети. Проверьте подключение к интернету');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="mt-4 d-flex align-items-center justify-content-center">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="h4 text-dark mb-1">Вход в систему</h2>
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Логин</Form.Label>
                  <Form.Control
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleChange}
                    placeholder="Введите логин"
                    disabled={isLoading}
                    autoComplete="username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Введите пароль"
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Вход...
                    </>
                  ) : (
                    'Войти'
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Забыли пароль? Обратитесь к администратору
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;