'use client'
import { useState } from 'react'
import { Card, Tabs, Tab, Form, Button, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { useAuth } from '@/components/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  return (
    <DashboardLayout>
      <h2 className="mb-4">Settings</h2>

      <Tabs defaultActiveKey="profile" className="mb-3">
        <Tab eventKey="profile" title="Profile Settings">
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={user?.full_name}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={user?.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={user?.username}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        type="text"
                        defaultValue={user?.role}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" disabled={loading}>
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="password" title="Change Password">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" />
                </Form.Group>

                <Button variant="primary">
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="system" title="System Settings">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Application Name</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue="Employee Management System"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Select>
                    <option>Asia/Jakarta (GMT+7)</option>
                    <option>Asia/Singapore (GMT+8)</option>
                    <option>UTC (GMT+0)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Date Format</Form.Label>
                  <Form.Select>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary">
                  Save Settings
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="notifications" title="Notifications">
          <Card>
            <Card.Body>
              <Form>
                <Form.Check
                  type="switch"
                  label="Email notifications"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  label="Leave request notifications"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  label="Attendance reminders"
                  defaultChecked
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  label="System announcements"
                  defaultChecked
                  className="mb-3"
                />

                <Button variant="primary" className="mt-3">
                  Save Preferences
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </DashboardLayout>
  )
}
