'use client'
import { Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap'
import { useState } from 'react'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { toast } from 'react-toastify'

export default function LeaveApprovalPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [action, setAction] = useState('')
  const [remarks, setRemarks] = useState('')

  const pendingLeaves = [
    {
      id: 1,
      employee: 'John Doe',
      type: 'Annual',
      start: '2025-01-15',
      end: '2025-01-20',
      days: 5,
      reason: 'Family vacation',
      status: 'Pending'
    },
    // Add more...
  ]

  const handleAction = (leave, actionType) => {
    setSelectedLeave(leave)
    setAction(actionType)
    setShowModal(true)
  }

  const handleSubmit = () => {
    toast.success(`Leave request ${action}ed successfully!`)
    setShowModal(false)
    setRemarks('')
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">Leave Approval</h2>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Pending Approvals</h5>
          <Badge bg="warning">{pendingLeaves.length} Pending</Badge>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map(leave => (
                <tr key={leave.id}>
                  <td><strong>{leave.employee}</strong></td>
                  <td>
                    <Badge bg="info">{leave.type}</Badge>
                  </td>
                  <td>
                    <small>
                      {leave.start}<br/>to {leave.end}
                    </small>
                  </td>
                  <td>{leave.days} days</td>
                  <td>{leave.reason}</td>
                  <td>
                    <Badge bg="warning">{leave.status}</Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => handleAction(leave, 'Approve')}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleAction(leave, 'Reject')}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{action} Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLeave && (
            <>
              <p><strong>Employee:</strong> {selectedLeave.employee}</p>
              <p><strong>Type:</strong> {selectedLeave.type} Leave</p>
              <p><strong>Duration:</strong> {selectedLeave.days} days</p>
              <p><strong>Reason:</strong> {selectedLeave.reason}</p>
              
              <Form.Group>
                <Form.Label>Remarks</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add your remarks (optional)..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={action === 'Approve' ? 'success' : 'danger'}
            onClick={handleSubmit}
          >
            Confirm {action}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}
