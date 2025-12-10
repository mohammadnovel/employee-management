'use client'
import { useState } from 'react'
import { Card, Table, Badge, Button, Tabs, Tab, Form, Row, Col } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function LeavePage() {
  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Leave Management</h2>
        <Button variant="primary">
          <i className="bi bi-plus-circle me-2"></i>
          Apply Leave
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0">15</h3>
              <small className="text-muted">Total Leave Days</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-success">8</h3>
              <small className="text-muted">Available</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-primary">7</h3>
              <small className="text-muted">Used</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="mb-0 text-warning">4</h3>
              <small className="text-muted">Pending</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs defaultActiveKey="all" className="mb-3">
            <Tab eventKey="all" title="All Requests">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No leave requests found
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="pending" title={<span>Pending <Badge bg="warning">4</Badge></span>}>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No pending requests
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="approved" title="Approved">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Approved By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No approved requests
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
