'use client'
import { Card, Table, Button, Badge } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Documents</h2>
        <Button variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Upload Document
        </Button>
      </div>

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Size</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No documents uploaded yet
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
