'use client'
import { useState } from 'react'
import { Card, Form, Button, Row, Col, Table } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { toast } from 'react-toastify'

export default function MarkAttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedEmployees, setSelectedEmployees] = useState([])

  const employees = [
    { id: 1, name: 'John Doe', code: 'EMP001', department: 'IT' },
    { id: 2, name: 'Jane Smith', code: 'EMP002', department: 'HR' },
    // Add more...
  ]

  const handleMarkAll = (status) => {
    toast.success(`Marked all as ${status}`)
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">Mark Attendance</h2>

      <Card className="mb-3">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Select>
                  <option>All Departments</option>
                  <option>IT</option>
                  <option>HR</option>
                  <option>Finance</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end gap-2">
              <Button variant="success" onClick={() => handleMarkAll('Present')}>
                Mark All Present
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
                <th>
                  <Form.Check type="checkbox" />
                </th>
                <th>Code</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <Form.Check type="checkbox" />
                  </td>
                  <td>{emp.code}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>
                    <Form.Control type="time" size="sm" />
                  </td>
                  <td>
                    <Form.Control type="time" size="sm" />
                  </td>
                  <td>
                    <Form.Select size="sm">
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Leave">Leave</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Button size="sm" variant="primary">
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save All</Button>
          </div>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
