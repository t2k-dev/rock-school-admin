import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { Button, Modal, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { DisciplineIcon } from '../../common/DisciplineIcon';
import { Loading } from '../Loading';
import { AttendanceStatusBadge } from '../slots/AttendanceStatusBadge';

import AttendanceStatus from '../../../constants/AttendanceStatus';
import { getDisciplineName } from '../../../constants/disciplines';
import { getRoomName } from '../../../constants/rooms';

const SubscriptionAttendancesModal = ({
  show,
  onHide,
  subscription,
  attendances = [],
  isLoading = false,
  onAttendanceClick
}) => {
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

  const getStatusVariant = (status) => {
    switch (status) {
      case AttendanceStatus.ATTENDED:
        return 'success';
      case AttendanceStatus.MISSED:
        return 'danger';
      case AttendanceStatus.CANCELLED:
        return 'secondary';
      case AttendanceStatus.RESCHEDULED:
        return 'warning';
      default:
        return 'primary';
    }
  };

  const handleAttendanceRowClick = (attendance) => {
    if (onAttendanceClick) {
      onAttendanceClick(attendance);
    }
  };

  if (!subscription) {
    return null;
  }

    const sortedAttendances = attendances.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB - dateA; // Descending order
    });

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center">
          <DisciplineIcon disciplineId={subscription.disciplineId} size="24px" />
          <span className="ms-2">
            Занятия по абонементу - {getDisciplineName(subscription.disciplineId)}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {/* Subscription Info */}
        <div className="mb-3 p-3 bg-light rounded">
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
              <strong>Всего занятий:</strong> {subscription.attendanceCount}
            </div>
            <div className="col-md-6">
              <strong>Осталось:</strong> {subscription.attendancesLeft}
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loading message="Загрузка занятий..." />
        ) : (
          <>
            {sortedAttendances && sortedAttendances.length > 0 ? (
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
                        cursor: attendance.isCompleted ? 'default' : 'pointer',
                        opacity: attendance.isCompleted ? 0.8 : 1 
                      }}
                      onClick={() => !attendance.isCompleted && handleAttendanceRowClick(attendance)}
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
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div>
          </div>
          <div>
            <Button variant="secondary" onClick={onHide}>
              Закрыть
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

SubscriptionAttendancesModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
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
};

export default SubscriptionAttendancesModal;