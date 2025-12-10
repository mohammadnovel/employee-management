'use client'
import { Card, Table, Button, Badge } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function MenuManagementPage() {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Menu Management</h2>
        <Button variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Add Menu
        </Button>
      </div>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Order</th>
                <th>Menu Name</th>
                <th>Icon</th>
                <th>URL</th>
                <th>Parent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><strong>Dashboard</strong></td>
                <td><i className="bi bi-speedometer2"></i></td>
                <td>/dashboard</td>
                <td>-</td>
                <td><Badge bg="success">Active</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2">
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button size="sm" variant="outline-danger">
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>User Management</td>
                <td><i className="bi bi-people"></i></td>
                <td>/dashboard/users</td>
                <td>-</td>
                <td><Badge bg="success">Active</Badge></td>
                <td>
                  <Button size="sm" variant="outline-primary" className="me-2">
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button size="sm" variant="outline-danger">
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
