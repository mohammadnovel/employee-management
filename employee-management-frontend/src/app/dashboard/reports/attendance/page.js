'use client'
import { Card } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'

export default function AttendanceReportDetailPage() {
  return (
    <DashboardLayout>
      <h2 className="mb-4">Attendance Report Details</h2>
      <Card>
        <Card.Body className="text-center py-5">
          <i className="bi bi-file-earmark-text display-1 text-muted"></i>
          <p className="mt-3">Detailed attendance report will be displayed here</p>
        </Card.Body>
      </Card>
    </DashboardLayout>
  )
}
