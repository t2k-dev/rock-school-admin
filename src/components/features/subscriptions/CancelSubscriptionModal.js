import { format } from 'date-fns';
import { useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';

const CancelSubscriptionModal = ({ 
  show, 
  onHide, 
  subscription, 
  onConfirm,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    cancelDate: format(new Date(), 'yyyy-MM-dd'),
    cancelReason: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

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

    if (!formData.cancelDate) {
      newErrors.cancelDate = 'Дата отмены обязательна';
    }

    if (!formData.cancelReason.trim()) {
      newErrors.cancelReason = 'Причина отмены обязательна';
    } else if (formData.cancelReason.trim().length < 3) {
      newErrors.cancelReason = 'Причина должна содержать минимум 3 символа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      await onConfirm({
        subscriptionId: subscription.subscriptionId,
        cancelDate: formData.cancelDate,
        cancelReason: formData.cancelReason.trim()
      });
      
      // Reset form on success
      handleClose();
    } catch (error) {
      setSubmitError(error.message || 'Произошла ошибка при отмене абонемента');
    }
  };

  const handleClose = () => {
    setFormData({
      cancelDate: format(new Date(), 'yyyy-MM-dd'),
      cancelReason: ''
    });
    setErrors({});
    setSubmitError('');
    onHide();
  };

  const reasonOptions = [
    'Переезд',
    'Финансовые трудности', 
    'Недовольство качеством обучения',
    'Смена расписания',
    'Потеря интереса',
    'Проблемы со здоровьем',
    'Другое'
  ];

  const isCustomReason = formData.cancelReason === 'Другое';

  return (
    <Modal show={show} onHide={handleClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Отмена абонемента</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {submitError && (
          <Alert variant="danger" className="mb-3">
            {submitError}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Дата отмены*</Form.Label>
            <Form.Control
              type="date"
              name="cancelDate"
              value={formData.cancelDate}
              onChange={handleInputChange}
              isInvalid={!!errors.cancelDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.cancelDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Причина отмены*</Form.Label>
            <Form.Select
              name="cancelReason"
              value={isCustomReason ? 'Другое' : formData.cancelReason}
              onChange={handleInputChange}
              isInvalid={!!errors.cancelReason && !isCustomReason}
            >
              <option value="">Выберите причину...</option>
              {reasonOptions.map(reason => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </Form.Select>
            {!isCustomReason && (
              <Form.Control.Feedback type="invalid">
                {errors.cancelReason}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {isCustomReason && (
            <Form.Group className="mb-3">
              <Form.Label>Уточните причину*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="cancelReason"
                value={formData.cancelReason}
                onChange={(e) => setFormData(prev => ({ ...prev, cancelReason: e.target.value }))}
                placeholder="Введите причину отмены..."
                isInvalid={!!errors.cancelReason}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cancelReason}
              </Form.Control.Feedback>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Отменяем...
            </>
          ) : (
            'Подтвердить отмену'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelSubscriptionModal;