'use client'
import { Card } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function LeaveReportPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-4">Leave Report</h2>
      <Card>
        <Card.Body className="text-center py-5">
          <i className="bi bi-calendar-x display-1 text-muted"></i>
          <p className="mt-3">Leave report will be displayed here</p>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
