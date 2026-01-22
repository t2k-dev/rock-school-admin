import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { SELECTABLE_DISCIPLINES } from '../../../constants/disciplines';
import SubscriptionType, { getSubscriptionTypeName } from '../../../constants/SubscriptionType';
import { createTariff } from '../../../services/apiTariffService';
import { Loading } from '../../shared/Loading';

const TariffForm = ({ history, type = "New" }) => {
  const [formData, setFormData] = useState({
    tariffId: '',
    amount: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    disciplineId: '',
    attendanceLength: '',
    attendanceCount: '',
    subscriptionType: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isNew = type === "New";

  const subscriptionTypeOptions = Object.keys(SubscriptionType).map(key => ({
    value: SubscriptionType[key],
    label: getSubscriptionTypeName(SubscriptionType[key])
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна';
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала';
    }

    if (!formData.attendanceLength || formData.attendanceLength === '') {
      newErrors.attendanceLength = 'Длительность урока обязательна';
    }

    if (!formData.attendanceCount || parseInt(formData.attendanceCount) <= 0) {
      newErrors.attendanceCount = 'Количество занятий должно быть больше 0';
    }

    if (formData.subscriptionType === '') {
      newErrors.subscriptionType = 'Тип подписки обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSubmitError('');

    try {
      const tariffData = {
        amount: parseFloat(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        disciplineId: formData.disciplineId ? parseInt(formData.disciplineId) : null,
        attendanceLength: parseInt(formData.attendanceLength),
        attendanceCount: parseInt(formData.attendanceCount),
        subscriptionType: parseInt(formData.subscriptionType)
      };

      await createTariff(tariffData);
      
      // Redirect to tariffs list or home page on success
      history.push('/tariffList');
    } catch (error) {
      console.error('Tariff creation error:', error);
      setSubmitError(error.message || 'Ошибка при создании тарифа');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading message="Загрузка данных..." />;
  }

  return (
    <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
      <Row>
        <Col md="4"></Col>
        <Col md="4">
          <h2 className="mb-4 text-center">{isNew ? "Новый тариф" : "Редактировать тариф"}</h2>

          {submitError && (
            <Alert variant="danger" className="mb-3">
              {submitError}
            </Alert>
          )}

        <Form.Group className="mb-4">
            <Form.Label>Тип подписки</Form.Label>
            <Form.Select 
            name="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleInputChange}
            isInvalid={!!errors.subscriptionType}
            >
            <option value="">Выберите тип подписки...</option>
            {subscriptionTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
            {errors.subscriptionType}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Количество занятий</Form.Label>
            <Form.Select 
            name="attendanceCount"
            value={formData.attendanceCount}
            onChange={handleInputChange}
            isInvalid={!!errors.attendanceCount}
            >
            <option value="">Выберите количество...</option>
            <option value="1">1</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="20">20</option>
            <option value="24">24</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
            {errors.attendanceCount}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="AttendanceLength">
            <Form.Label>Длительность урока</Form.Label>
            <Form.Select 
            aria-label="Выберите..." 
            name="attendanceLength"
            value={formData.attendanceLength} 
            onChange={handleInputChange}
            isInvalid={!!errors.attendanceLength}
            >
            <option value="">выберите...</option>
            <option value="1">Час</option>
            <option value="2">Полтора часа</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
            {errors.attendanceLength}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Дисциплина</Form.Label>
            <Form.Select 
            name="disciplineId"
            value={formData.disciplineId}
            onChange={handleInputChange}
            isInvalid={!!errors.disciplineId}
            >
            <option value="">Выберите дисциплину (необязательно)</option>
            {SELECTABLE_DISCIPLINES.map(discipline => (
                <option key={discipline.id} value={discipline.id}>
                {discipline.name}
                </option>
            ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
            {errors.disciplineId}
            </Form.Control.Feedback>
        </Form.Group>


        <Form.Group className="mb-3">
            <Form.Label>Дата начала*</Form.Label>
            <Form.Control
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            isInvalid={!!errors.startDate}
            />
            <Form.Control.Feedback type="invalid">
            {errors.startDate}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>Дата окончания*</Form.Label>
            <Form.Control
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            isInvalid={!!errors.endDate}
            />
            <Form.Control.Feedback type="invalid">
            {errors.endDate}
            </Form.Control.Feedback>
        </Form.Group>

        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>Сумма*</Form.Label>
            <Form.Control
            type="number"
            name="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleInputChange}
            isInvalid={!!errors.amount}
            placeholder="Введите сумму"
            />
            <Form.Control.Feedback type="invalid">
            {errors.amount}
            </Form.Control.Feedback>
        </Form.Group>
        
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit"
                disabled={isSaving}
                size="lg"
              >
                {isSaving ? 'Сохранение...' : (isNew ? 'Создать тариф' : 'Сохранить изменения')}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => history.goBack()}
                disabled={isSaving}
              >
                Отмена
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

TariffForm.propTypes = {
  history: PropTypes.object.isRequired,
  type: PropTypes.string
};

export default withRouter(TariffForm);