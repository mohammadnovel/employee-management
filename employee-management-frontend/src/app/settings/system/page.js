'use client'
import { Card, Form, Button, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function SystemSettingsPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-4">System Settings</h2>

      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">General Settings</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Application Name</Form.Label>
                  <Form.Control defaultValue="Employee Management System" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control defaultValue="Your Company" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select>
                    <option>Asia/Jakarta (GMT+7)</option>
                    <option>Asia/Singapore (GMT+8)</option>
                    <option>UTC (GMT+0)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date Format</Form.Label>
                  <Form.Select>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>
          <h5 className="mb-0">Email Settings</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Host</Form.Label>
                  <Form.Control placeholder="smtp.gmail.com" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>SMTP Port</Form.Label>
                  <Form.Control defaultValue="587" />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Encryption</Form.Label>
                  <Form.Select>
                    <option>TLS</option>
                    <option>SSL</option>
                    <option>None</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Username</Form.Label>
                  <Form.Control type="email" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Backup Settings</h5>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Check
              type="switch"
              label="Enable Automatic Backup"
              className="mb-3"
            />
            <Form.Group className="mb-3">
              <Form.Label>Backup Frequency</Form.Label>
              <Form.Select>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success">
              <i className="bi bi-download me-2"></i>
              Backup Now
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-3">
        <Button variant="primary">Save Settings</Button>
      </div>
    </DashboardLayout>
  )
}
