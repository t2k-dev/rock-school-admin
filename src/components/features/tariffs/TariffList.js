import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { getDisciplineName } from '../../../constants/disciplines';
import { getSubscriptionTypeName } from '../../../constants/SubscriptionType';
import { deleteTariff, getTariffs } from '../../../services/apiTariffService';
import { Loading } from '../../shared/Loading';
import { NoRecords } from '../../shared/NoRecords';

const TariffList = () => {
  const [tariffs, setTariffs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTariffs();
  }, []);

  const loadTariffs = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getTariffs();
      setTariffs(data || []);
    } catch (error) {
      console.error('Error loading tariffs:', error);
      setError('Ошибка при загрузке тарифов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот тариф?')) {
      try {
        await deleteTariff(id);
        setTariffs(prev => prev.filter(tariff => tariff.tariffId !== id));
      } catch (error) {
        console.error('Error deleting tariff:', error);
        setError('Ошибка при удалении тарифа');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch {
      return dateString;
    }
  };

  const isActive = (tariff) => {
    const now = new Date();
    const startDate = new Date(tariff.startDate);
    const endDate = new Date(tariff.endDate);
    return now >= startDate && now <= endDate;
  };

  if (isLoading) {
    return <Loading message="Загрузка тарифов..." />;
  }

  return (
    <Container style={{ marginTop: "40px", paddingBottom: "50px" }}>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Список тарифов</h2>
            <Button as={Link} to="/tariffForm" variant="success">
              Добавить тариф
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {tariffs.length === 0 ? (
            <NoRecords />
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Период действия</th>
                  <th>Тип</th>
                  <th>Дисциплина</th>
                  <th>Занятий</th>
                  <th>Длительность</th>
                  <th>Сумма</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tariffs.map(tariff => (
                  <tr key={tariff.tariffId}>
                    <td>
                      {formatDate(tariff.startDate)} - {formatDate(tariff.endDate)}
                    </td>
                    <td>{getSubscriptionTypeName(tariff.subscriptionType)}</td>
                    <td>
                      {tariff.disciplineId 
                        ? getDisciplineName(tariff.disciplineId) 
                        : "Любая дисциплина"
                      }
                    </td>
                    <td>{tariff.attendanceCount}</td>
                    <td>{tariff.attendanceLength} мин.</td>
                    <td>{tariff.amount} тг.</td>
                    <td>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(tariff.tariffId)}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default TariffList;