'use client'
import { Card, Table, Button, Form, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function EmployeeReportPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-4">Employee Report</h2>
      
      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Select>
                <option>All Departments</option>
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select>
                <option>All Positions</option>
                <option>Manager</option>
                <option>Developer</option>
                <option>Staff</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button variant="primary" className="w-100">
                <i className="bi bi-download me-2"></i>Export PDF
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table responsive striped>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Hire Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Select filters and click Export to generate report
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
