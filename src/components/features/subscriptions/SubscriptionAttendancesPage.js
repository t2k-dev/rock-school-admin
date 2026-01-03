import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import { DisciplineIcon } from '../../shared/discipline/DisciplineIcon';
import { CoinsIcon } from '../../shared/icons/CoinsIcon';
import { Loading } from '../../shared/Loading';
import { AttendanceStatusBadge } from '../../shared/modals/AttendanceStatusBadge';

import { getDisciplineName } from '../../../constants/disciplines';
import { getRoomName } from '../../../constants/rooms';
import { CalendarIcon } from '../../shared/icons/CalendarIcon';

const SubscriptionAttendancesPage = ({
  subscription,
  attendances = [],
  isLoading = false,
  onAttendanceClick,
  onEditSchedules,
  onPayClick
}) => {
  const [showCompleted, setShowCompleted] = useState(true);
  const history = useHistory();

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'd MMM yyyy', { locale: ru });
    } catch (error) {
      return 'Неверная дата';
    }
  };

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
console.log('subscription', subscription);
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
    <Container style={{ marginTop: "40px" }}>
      {/* Header with back button */}
      <Row className="mb-3">
        <Col>
         { /*<div>
            <Button variant="outline-secondary" onClick={handleBack} className="me-3">
              Назад
            </Button>
          </div>*/}
          <div className="d-flex align-items-center mt-4">
            
            <h2 className="d-flex align-items-center mb-0">
              <DisciplineIcon disciplineId={subscription.disciplineId} size="32px" />
              <span className="ms-2">
                Абонемент {getDisciplineName(subscription.disciplineId)}
              </span>
            </h2>
          </div>
        </Col>
      </Row>

      {/* Subscription Info Card */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-md-6">
                  <strong>Начало:</strong> {formatDate(subscription.startDate)}
                </div>
                <div className="col-md-6">
                  <strong>Преподаватель:</strong>{' '}
                  <Link to={`/teacher/${subscription.teacher.teacherId}`}>
                    {subscription.teacher.firstName} {subscription.teacher.lastName}
                  </Link>
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-6">
                  <strong>Осталось занятий:</strong> {subscription.attendancesLeft} из {subscription.attendanceCount}
                </div>
                <div className="col-md-6">
                  {subscription.paymentId &&<> <strong>Оплачено:</strong> 45 000 тг, 25 дек. 2025</>}
                </div>
              </div>
              <div className='row mt-3'>
                <Col>
                    {subscription.paymentId === null &&
                    <Button variant="primary" onClick={() => onPayClick && onPayClick(subscription)}>
                        <CoinsIcon color="white" enableHover={false}/>
                        Оплатить
                    </Button>
                    }

                    <Button style={{ marginLeft: '8px' }} variant="secondary" onClick={() => onEditSchedules && onEditSchedules(subscription)}>
                        <CalendarIcon color="white"/>
                        Редактировать расписание
                    </Button>

                </Col>
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
                          <th style={{ width: '120px' }}>Дата</th>
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
                            style={{ 
                              cursor: 'pointer',
                              opacity: attendance.isCompleted ? 0.8 : 1 
                            }}
                            onClick={() => handleAttendanceRowClick(attendance)}
                          >
                            <td>{formatDate(attendance.startDate)}</td>
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
                      {subscription.attendanceCount > 0 
                        ? "Занятия еще не запланированы"
                        : "Нет занятий для этого абонемента"
                      }
                    </p>
                  </div>
                )}

        </Col>
      </Row>
    </Container>
  );
};

SubscriptionAttendancesPage.propTypes = {
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

export default SubscriptionAttendancesPage;