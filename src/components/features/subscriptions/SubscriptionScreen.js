import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Row, Stack, Tab, Tabs } from 'react-bootstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import { getDisciplineName } from '../../../constants/disciplines';
import SubscriptionStatus from '../../../constants/SubscriptionStatus';
import SubscriptionType from '../../../constants/SubscriptionType';
import { getSubscriptionScreenData } from '../../../services/apiSubscriptionService';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { DisciplineIcon } from '../../shared/discipline/DisciplineIcon';
import { CalendarIcon, CancelIcon, CoinsIcon, CountIcon } from '../../shared/icons';
import { Loading } from '../../shared/Loading';
import { AttendanceList } from './AttendanceList';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';

const SubscriptionScreen = ({
  onAttendanceClick,
  onEditSchedules,
  onPayClick,
  onCancelClick
}) => {
  const [subscription, setSubscription] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('attendances');
  
  const history = useHistory();
  const { id } = useParams(); // Get subscription ID from URL

  // Load subscription data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading subscription data for ID:', id);
        const data = await getSubscriptionScreenData(id);
        
        console.log('Received subscription data:', data);
        
        if (data) {
          setSubscription(data.subscription || data);
          setAttendances(data.subscription.attendances || []);
        } else {
          setError('Subscription not found');
        }
      } catch (err) {
        console.error('Error loading subscription data:', err);
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleAttendanceRowClick = (attendance) => {
    if (onAttendanceClick) {
      onAttendanceClick(attendance);
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  const renderSubscriptionTitle = () => {
    switch (subscription.subscriptionType) {
      case SubscriptionType.LESSON: // Regular subscription
        return (
          <>
            
            <div className="text-center mt-2" style={{fontSize: '24px', fontWeight: 'bold'}}>
              <DisciplineIcon disciplineId={subscription.disciplineId} size="32px" /> 
              <div className='mt-1'>{getDisciplineName(subscription.disciplineId)}</div>
            </div>
            <div className='text-center mt-2'><SubscriptionStatusBadge status={subscription.status} /></div>
          </>
        );
        break;
      case SubscriptionType.RENT:
        return (
          <>
            <div className="text-center mt-2" style={{fontSize: '24px', fontWeight: 'bold'}}>
              Аренда Комнаты 
            </div>
            <div className='text-center mt-2'><SubscriptionStatusBadge status={subscription.status} /></div>
          </>
        );
        break;
      default:
        return (
          <>
            <DisciplineIcon disciplineId={subscription.disciplineId} size="32px" />
            <span className="ms-2">
              Абонемент {getDisciplineName(subscription.disciplineId)} <SubscriptionStatusBadge status={subscription.status} />
            </span>
          </>
        );
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <Loading message="Загрузка данных абонемента..." />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <div className="alert alert-danger">
          <h4>Ошибка</h4>
          <p>{error}</p>
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
        </div>
      </Container>
    );
  }

  // No subscription found
  if (!subscription) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <div className="alert alert-warning">
          <h4>Абонемент не найден</h4>
          <Button variant="secondary" onClick={handleBack}>
            Назад
          </Button>
        </div>
      </Container>
    );
  }

  const sortedAttendances = attendances
    .filter(attendance => showCompleted || !attendance.isCompleted)
    .sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA - dateB;
    });

  return (
    <Container >
      {/* Header with back button */}
      <Row className="mb-3">
        <Col>
         { /*<div>
            <Button variant="outline-secondary" onClick={handleBack} className="me-3">
              Назад
            </Button>
          </div>*/}

        </Col>
      </Row>

      {/* Subscription Info Card */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center" style={{ flexDirection: "row" }}>  
                <div className='flex-grow-1'>
                  <Row>
                    <Col size="md-6">
                      {renderSubscriptionTitle()}
                    </Col>
                    <Col size="md-3">
                      <div className="text-muted small">Ученик</div>
                      <Link to={`/student/${subscription.student.studentId}`}>
                        {subscription.student.firstName} {subscription.student.lastName}
                      </Link>

                      {subscription.teacher &&
                      <>
                        <div className="text-muted small mt-3">Преподаватель</div>
                        <Link to={`/teacher/${subscription.teacher.teacherId}`}>
                          {subscription.teacher.firstName} {subscription.teacher.lastName}
                        </Link>
                      </>
                      }
                    </Col>
                    <Col size="md-3">
                      <div>
                        <span className="text-muted small"><CalendarIcon color="gray"/> Начало </span>
                        <span className='small'>
                          {formatDateWithLetters(subscription.startDate)}
                        </span>
                      </div>
                      <div className='mt-2'>
                        <span className='text-muted small'><CountIcon color="gray"/> Осталось занятий </span>
                        <span className='small'>
                          {subscription.attendancesLeft} из {subscription.attendanceCount}
                        </span>
                      </div>
                      <div className='mt-2'>
                        <span className='text-muted small'><CoinsIcon color="gray"/> Статус оплаты </span>
                        {subscription.paymentId 
                          ? <> <span className='small'>Оплачено:</span> 25 дек. 2025</> 
                          : <span className='small'>Не оплачено</span>}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Stack gap={2} style={{ width: "250px" }}>
                    
                    <Button variant="primary" onClick={() => onPayClick && onPayClick(subscription)}>
                        <CoinsIcon color="white" enableHover={false}/>
                        Оплатить
                    </Button>

                    <Button variant="secondary" onClick={() => onEditSchedules && onEditSchedules(subscription)}>
                        <CalendarIcon color="white"/>
                        Расписание
                    </Button>
                    {(subscription.status === SubscriptionStatus.ACTIVE ||  subscription.status === SubscriptionStatus.DRAFT) &&
                    <Button variant='danger' onClick={() => onCancelClick && onCancelClick(subscription)}>
                      <CancelIcon color="white" />
                      Отменить
                    </Button>
                    }
                  </Stack>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Attendances Table */}
      <Row>
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="attendances" title="Занятия">
              <AttendanceList
                attendances={sortedAttendances}
                onAttendanceClick={handleAttendanceRowClick}
              />
            </Tab>
            <Tab eventKey="payments" title="Платежи">
              {subscription.tenders && subscription.tenders.length > 0 ? (
                <Row>
                  {subscription.tenders.map((tender, index) => (
                    <Col key={index} md={6} lg={4} className="mb-3">
                      <Card>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">
                              Платеж #{index + 1}
                            </h6>
                            <div 
                              className={`badge ${
                                tender.isPaid 
                                  ? 'bg-success' 
                                  : tender.isOverdue 
                                    ? 'bg-danger' 
                                    : 'bg-warning'
                              }`}
                            >
                              {tender.isPaid 
                                ? 'Оплачено' 
                                : tender.isOverdue 
                                  ? 'Просрочено' 
                                  : 'Не оплачено'
                              }
                            </div>
                          </div>
                          
                          {tender.amount && (
                            <div className="mb-2">
                              <span className="text-muted small">Сумма: </span>
                              <span className="fw-bold">{tender.amount} ₽</span>
                            </div>
                          )}
                          
                          {tender.dueDate && (
                            <div className="mb-2">
                              <span className="text-muted small">Срок оплаты: </span>
                              <span>{formatDateWithLetters(tender.dueDate)}</span>
                            </div>
                          )}
                          
                          {tender.paymentDate && tender.isPaid && (
                            <div className="mb-2">
                              <span className="text-muted small">Дата оплаты: </span>
                              <span>{formatDateWithLetters(tender.paymentDate)}</span>
                            </div>
                          )}
                          
                          {tender.description && (
                            <div className="mb-2">
                              <span className="text-muted small">Описание: </span>
                              <span>{tender.description}</span>
                            </div>
                          )}
                          
                          {tender.paymentMethod && tender.isPaid && (
                            <div className="mb-2">
                              <span className="text-muted small">Способ оплаты: </span>
                              <span>{tender.paymentMethod}</span>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="p-4 text-center">
                  <h5>Платежи</h5>
                  <p className="text-muted">Платежей не найдено</p>
                </div>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

SubscriptionScreen.propTypes = {
  onAttendanceClick: PropTypes.func,
  onEditSchedules: PropTypes.func,
  onPayClick: PropTypes.func,
  onCancelClick: PropTypes.func,
};

export default SubscriptionScreen;