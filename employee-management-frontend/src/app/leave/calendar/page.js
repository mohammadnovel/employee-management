'use client'
import { Card, Badge, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function LeaveCalendarPage() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  
  const leaves = [
    { date: '2025-01-15', employee: 'John Doe', type: 'Annual' },
    { date: '2025-01-16', employee: 'John Doe', type: 'Annual' },
    { date: '2025-01-20', employee: 'Jane Smith', type: 'Sick' },
  ]

  const getBadgeColor = (type) => {
    const colors = {
      Annual: 'primary',
      Sick: 'danger',
      Personal: 'warning',
      Unpaid: 'secondary'
    }
    return colors[type] || 'info'
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">Leave Calendar</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h4>5</h4>
              <small className="text-muted">On Leave Today</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h4>12</h4>
              <small className="text-muted">This Week</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h4>35</h4>
              <small className="text-muted">This Month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body className="text-center">
              <h4>4</h4>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">{currentMonth}</h5>
        </Card.Header>
        <Card.Body>
          <div className="calendar-placeholder text-center py-5">
            <i className="bi bi-calendar3 display-1 text-muted mb-3"></i>
            <p className="text-muted">Calendar view will be displayed here</p>
            <small className="text-muted">Shows all employee leaves for the month</small>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Upcoming Leaves</h5>
        </Card.Header>
        <Card.Body>
          <div className="list-group list-group-flush">
            {leaves.map((leave, index) => (
              <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{leave.employee}</strong>
                  <br />
                  <small className="text-muted">{leave.date}</small>
                </div>
                <Badge bg={getBadgeColor(leave.type)}>
                  {leave.type} Leave
                </Badge>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
