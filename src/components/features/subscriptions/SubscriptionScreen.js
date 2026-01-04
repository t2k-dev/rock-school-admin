import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Card, Col, Container, Row, Stack, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { getDisciplineName } from '../../../constants/disciplines';
import { getRoomName } from '../../../constants/rooms';
import SubscriptionStatus from '../../../constants/SubscriptionStatus';
import { formatDateWithLetters } from '../../../utils/dateTime';
import { DisciplineIcon } from '../../shared/discipline/DisciplineIcon';
import { CalendarIcon } from '../../shared/icons/CalendarIcon';
import { CancelIcon } from '../../shared/icons/CancelIcon';
import { CoinsIcon } from '../../shared/icons/CoinsIcon';
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
          <div className="d-flex align-items-center mt-4">
            
            <h2 className="d-flex align-items-center mb-0">
              <DisciplineIcon disciplineId={subscription.disciplineId} size="32px" />
              <span className="ms-2">
                Абонемент {getDisciplineName(subscription.disciplineId)} <SubscriptionStatusBadge status={subscription.status} />
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
              <div className="d-flex justify-content-between align-items-center" style={{ flexDirection: "row" }}>  
                <div className='flex-grow-1'>
                  <Row>
                    <Col size="md-6">
                      <strong>Начало:</strong> {formatDateWithLetters(subscription.startDate)}
                    </Col>
                    <Col size="md-6">
                      <strong>Преподаватель:</strong>{' '}
                      <Link to={`/teacher/${subscription.teacher.teacherId}`}>
                        {subscription.teacher.firstName} {subscription.teacher.lastName}
                      </Link>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col size="md-6">
                      <strong>Осталось занятий:</strong> {subscription.attendancesLeft} из {subscription.attendanceCount}
                    </Col>
                    <Col size="md-6">
                      <strong>Оплата:</strong>
                      {subscription.paymentId &&<> <strong>Оплачено:</strong> 45 000 тг, 25 дек. 2025</>}
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