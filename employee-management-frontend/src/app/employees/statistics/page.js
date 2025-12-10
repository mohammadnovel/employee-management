'use client'
import { Card, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

export default function StatisticsPage() {
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Employees',
      data: [12, 15, 18, 20, 22, 22],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  const barData = {
    labels: ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'],
    datasets: [{
      label: 'Employees by Department',
      data: [5, 3, 3, 3, 3, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ]
    }]
  }

  const doughnutData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [20, 2],
      backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)']
    }]
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">Employee Statistics</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0">22</h3>
              <small className="text-muted">Total Employees</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-success">20</h3>
              <small className="text-muted">Active</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-danger">2</h3>
              <small className="text-muted">Inactive</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-info">6</h3>
              <small className="text-muted">Departments</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Employee Growth</h5>
            </Card.Header>
            <Card.Body>
              <Line data={lineData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Active vs Inactive</h5>
            </Card.Header>
            <Card.Body>
              <Doughnut data={doughnutData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Employees by Department</h5>
            </Card.Header>
            <Card.Body>
              <Bar data={barData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
