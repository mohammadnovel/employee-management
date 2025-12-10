'use client'
import { Card, Table, Badge, Form, Row, Col, Button } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function ActivityLogsPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-4">Activity Logs</h2>

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Control type="date" />
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Users</option>
                <option>Super Admin</option>
                <option>Admin</option>
                <option>Manager</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Actions</option>
                <option>Login</option>
                <option>Create</option>
                <option>Update</option>
                <option>Delete</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="primary" className="w-100">
                <i className="bi bi-search me-2"></i>
                Search
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <small>2025-01-10 14:30:25</small>
                </td>
                <td>Super Admin</td>
                <td>
                  <Badge bg="success">Login</Badge>
                </td>
                <td>Authentication</td>
                <td>User logged in successfully</td>
                <td>192.168.1.100</td>
              </tr>
              <tr>
                <td>
                  <small>2025-01-10 14:25:10</small>
                </td>
                <td>Admin</td>
                <td>
                  <Badge bg="primary">Create</Badge>
                </td>
                <td>Employees</td>
                <td>Created new employee: EMP023</td>
                <td>192.168.1.101</td>
              </tr>
              <tr>
                <td>
                  <small>2025-01-10 14:20:45</small>
                </td>
                <td>Manager</td>
                <td>
                  <Badge bg="warning">Update</Badge>
                </td>
                <td>Leave</td>
                <td>Approved leave request #45</td>
                <td>192.168.1.102</td>
              </tr>
              <tr>
                <td>
                  <small>2025-01-10 14:15:30</small>
                </td>
                <td>Admin</td>
                <td>
                  <Badge bg="danger">Delete</Badge>
                </td>
                <td>Users</td>
                <td>Deleted inactive user account</td>
                <td>192.168.1.101</td>
              </tr>
            </tbody>
          </Table>

          <div className="text-center mt-3">
            <Button variant="outline-primary" size="sm">
              Load More
            </Button>
          </div>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
