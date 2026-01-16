import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Card, Col, Container, Row, Stack, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { getDisciplineName } from '../../../constants/disciplines';
import { getRoomName } from '../../../constants/rooms';
import SubscriptionStatus from '../../../constants/SubscriptionStatus';
import SubscriptionType from '../../../constants/SubscriptionType';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { DisciplineIcon } from '../../shared/discipline/DisciplineIcon';
import { CalendarIcon } from '../../shared/icons/CalendarIcon';
import { CancelIcon } from '../../shared/icons/CancelIcon';
import { CoinsIcon } from '../../shared/icons/CoinsIcon';
import { CountIcon } from '../../shared/icons/CountIcon';
import { Loading } from '../../shared/Loading';
import { AttendanceStatusBadge } from '../../shared/modals/AttendanceStatusBadge';
import { NoRecords } from '../../shared/NoRecords';
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge';

const SubscriptionScreen = ({
  subscription,
  attendances = [],
  onAttendanceClick,
  onEditSchedules,
  onPayClick,
  onCancelClick
}) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const history = useHistory();

  const formatTime = (date) => {
    try {
      return format(new Date(date), 'HH:mm');
    } catch (error) {
      return '--:--';
    }
  };
  
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

  if (!subscription) {
    return (
      <Container style={{ marginTop: "40px" }}>
        <Loading message="Загрузка данных абонемента..." />
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
                        <span className='text-muted small'>Статус оплаты </span>
                        {subscription.paymentId ? <> <strong>Оплачено:</strong> 45 000 тг, 25 дек. 2025</> : <span className='small'>Не оплачено</span>}
                      </div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Stack gap={2} style={{ width: "250px" }}>
                    {subscription.paymentId === null &&
                    <Button variant="primary" onClick={() => onPayClick && onPayClick(subscription)}>
                        <CoinsIcon color="white" enableHover={false}/>
                        Оплатить
                    </Button>
                    }
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
          <h4 className="mb-2">Список занятий</h4>
            
                {sortedAttendances && sortedAttendances.length > 0 ? (
                  <>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className='date-column' >Дата</th>
                          <th style={{ width: '120px' }}>Время</th>
                          <th style={{ width: '100px' }}>Комната</th>
                          <th>Комментарий</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAttendances.map((attendance) => (
                          <tr 
                            key={attendance.attendanceId}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleAttendanceRowClick(attendance)}
                          >
                            <td>{formatDateWithLetters(attendance.startDate)}</td>
                            <td>
                              {formatTime(attendance.startDate)} - {formatTime(attendance.endDate)}
                            </td>
                            <td>{getRoomName(attendance.roomId)}</td>
                            <td>
                              {attendance.comment && (
                                <span 
                                  title={attendance.comment}
                                  style={{ 
                                    display: 'inline-block',
                                    maxWidth: '200px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {attendance.comment}
                                </span>
                              )}
                            </td>
                            <td>
                              <AttendanceStatusBadge status={attendance.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      <NoRecords />
                    </p>
                  </div>
                )}

        </Col>
      </Row>
    </Container>
  );
};

SubscriptionScreen.propTypes = {
  subscription: PropTypes.shape({
    subscriptionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disciplineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    attendanceCount: PropTypes.number,
    attendancesLeft: PropTypes.number,
    teacher: PropTypes.shape({
      teacherId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    })
  }),
  attendances: PropTypes.arrayOf(
    PropTypes.shape({
      attendanceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      roomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      status: PropTypes.number,
      isCompleted: PropTypes.bool,
      comment: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  onAttendanceClick: PropTypes.func,
  onEditSchedules: PropTypes.func,
  onPayClick: PropTypes.func,
};

export default SubscriptionScreen;