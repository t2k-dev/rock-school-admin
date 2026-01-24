import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { getDisciplineName } from '../../../constants/disciplines';
import { pay } from '../../../services/apiSubscriptionService';
import DateTimeHelper from '../../../utils/DateTimeHelper';
import { toMoneyString } from '../../../utils/moneyUtils';

const PaymentForm = ({ 
  show, 
  onHide, 
  subscription, 
  onPaymentSubmit,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    amount: subscription?.amount || '',
    paidOn: DateTimeHelper.getCurrentDateTime(),
    paymentType: 1
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const paymentTypes = [
    { value: 1, label: 'Наличные' },
    { value: 2, label: 'Удаленная оплата' },
  ];

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

    if (!formData.paidOn) {
      newErrors.paidOn = 'Дата оплаты обязательна';
    }

    if (!formData.paymentType) {
      newErrors.paymentType = 'Тип оплаты обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');

      const paymentData = {
        subscriptionId: subscription.subscriptionId,
        amount: parseFloat(formData.amount),
        paidOn: formData.paidOn,
        paymentType: formData.paymentType
      };

      await pay(subscription.subscriptionId, paymentData);

      // Reset form on success
      setFormData({
        amount: subscription?.amount || '',
        paidOn: DateTimeHelper.getCurrentDateTime(),
        paymentType: 1
      });
      
      // Notify parent component of successful payment
      onPaymentSubmit({
        subscriptionId: subscription.subscriptionId,
        success: true
      });
      
      onHide();
    } catch (error) {
      console.error('Payment submission error:', error);
      setSubmitError(error.message || 'Ошибка при обработке платежа');
    }
  };

  const handleClose = () => {
    setErrors({});
    setSubmitError('');
    setFormData({
      amount: subscription?.amount || '',
      paidOn: DateTimeHelper.getCurrentDateTime(),
      paymentType: 1
    });
    onHide();
  };

console.log('subscription',subscription);

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Оплата абонемента</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {subscription && (
          <div className="mb-3 p-3 bg-light rounded">
            <p className="mb-1"><strong>Студент:</strong> {subscription.student.firstName} {subscription.student.lastName}</p>
            <p className="mb-1"><strong>Дисциплина:</strong> {getDisciplineName(subscription.disciplineId)}</p>
            <p className="mb-0"><strong>Сумма:</strong> {toMoneyString(subscription.amountOutstanding)}</p>
          </div>
        )}

        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Сумма оплаты*</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Введите сумму"
              step="0.01"
              min="0"
              isInvalid={!!errors.amount}
            />
            <Form.Control.Feedback type="invalid">
              {errors.amount}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Дата и время оплаты*</Form.Label>
            <Form.Control
              type="datetime-local"
              name="paidOn"
              value={formData.paidOn}
              onChange={handleInputChange}
              isInvalid={!!errors.paidOn}
            />
            <Form.Control.Feedback type="invalid">
              {errors.paidOn}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Тип оплаты*</Form.Label>
            <Form.Select
              name="paymentType"
              value={formData.paymentType}
              onChange={handleInputChange}
              isInvalid={!!errors.paymentType}
            >
              {paymentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.paymentType}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Отмена
        </Button>
        <Button 
          variant="success" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Обработка...' : 'Оплатить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PaymentForm.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  subscription: PropTypes.object,
  onPaymentSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default PaymentForm;