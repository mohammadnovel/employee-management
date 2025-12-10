'use client'
import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import { useAuth } from '@/components/AuthContext'
import api from '@/lib/api'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalDepartments: 0,
    pendingLeave: 0,
    departments: [],
    recentEmployees: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch employee stats
      const response = await api.get('/employees/stats')
      if (response.data.success) {
        const data = response.data.data
        setStats({
          totalEmployees: data.total || 22,
          activeEmployees: data.statusStats?.find(s => s.status === 'Active')?.count || 20,
          totalDepartments: data.departmentStats?.length || 6,
          pendingLeave: 4, // Hardcoded for demo
          departments: data.departmentStats || [],
          recentEmployees: []
        })
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Use demo data
      setStats({
        totalEmployees: 22,
        activeEmployees: 20,
        totalDepartments: 6,
        pendingLeave: 4,
        departments: [
          { department: 'IT', count: 5 },
          { department: 'HR', count: 3 },
          { department: 'Finance', count: 3 },
          { department: 'Marketing', count: 3 },
          { department: 'Sales', count: 3 },
          { department: 'Operations', count: 3 }
        ],
        recentEmployees: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Chart configurations
  const employeeTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'New Employees',
        data: [2, 3, 2, 4, 3, 2, 3, 4, 2, 1, 3, 2],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const departmentData = {
    labels: stats.departments.map(d => d.department),
    datasets: [
      {
        label: 'Employees',
        data: stats.departments.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(99, 102, 241)',
          'rgb(6, 182, 212)'
        ],
        borderWidth: 2
      }
    ]
  }

  const attendanceData = {
    labels: ['Present', 'Late', 'Absent', 'Leave'],
    datasets: [
      {
        data: [85, 8, 4, 3],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(99, 102, 241, 0.8)'
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(99, 102, 241)'
        ],
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="page-header mb-4">
        <Row className="align-items-center">
          <Col>
            <h1 className="page-title">
              {getGreeting()}, {user?.full_name}! 👋
            </h1>
            <p className="page-subtitle mb-0">
              Here's what's happening with your employees today.
            </p>
          </Col>
          <Col xs="auto">
            <div className="text-muted small">
              <i className="bi bi-calendar3 me-2"></i>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </Col>
        </Row>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col lg={3} md={6}>
          <div className="stat-card fade-in">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-white-50 mb-2">Total Employees</div>
                <h2 className="mb-0 fw-bold">{stats.totalEmployees}</h2>
                <small className="text-white-50">
                  <i className="bi bi-arrow-up me-1"></i>
                  +2 this month
                </small>
              </div>
              <div className="stat-icon">
                <i className="bi bi-people"></i>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6}>
          <div className="stat-card success fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-white-50 mb-2">Active Employees</div>
                <h2 className="mb-0 fw-bold">{stats.activeEmployees}</h2>
                <small className="text-white-50">
                  {((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% of total
                </small>
              </div>
              <div className="stat-icon">
                <i className="bi bi-person-check"></i>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6}>
          <div className="stat-card warning fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-white-50 mb-2">Departments</div>
                <h2 className="mb-0 fw-bold">{stats.totalDepartments}</h2>
                <small className="text-white-50">
                  Across organization
                </small>
              </div>
              <div className="stat-icon">
                <i className="bi bi-building"></i>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={3} md={6}>
          <div className="stat-card danger fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="text-white-50 mb-2">Pending Leave</div>
                <h2 className="mb-0 fw-bold">{stats.pendingLeave}</h2>
                <small className="text-white-50">
                  Requires approval
                </small>
              </div>
              <div className="stat-icon">
                <i className="bi bi-calendar-x"></i>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row className="g-4 mb-4">
        <Col lg={8}>
          <Card className="fade-in" style={{ animationDelay: '0.4s' }}>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Employee Growth Trend</h5>
                  <small className="text-muted">New employees over the past 12 months</small>
                </div>
                <div className="text-success small">
                  <i className="bi bi-arrow-up"></i> 15% increase
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={employeeTrendData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="fade-in" style={{ animationDelay: '0.5s' }}>
            <Card.Header>
              <h5 className="mb-0">Attendance Overview</h5>
              <small className="text-muted">Last 30 days</small>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Doughnut data={attendanceData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Department Distribution */}
      <Row className="g-4 mb-4">
        <Col lg={6}>
          <Card className="fade-in" style={{ animationDelay: '0.6s' }}>
            <Card.Header>
              <h5 className="mb-0">Employees by Department</h5>
              <small className="text-muted">Current distribution</small>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Bar data={departmentData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card className="fade-in" style={{ animationDelay: '0.7s' }}>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
              <small className="text-muted">Common tasks</small>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <a href="/employees/create" className="btn btn-outline-primary btn-lg text-start">
                  <i className="bi bi-person-plus me-3"></i>
                  Add New Employee
                </a>
                <a href="/attendance/create" className="btn btn-outline-success btn-lg text-start">
                  <i className="bi bi-calendar-check me-3"></i>
                  Mark Attendance
                </a>
                <a href="/leave" className="btn btn-outline-warning btn-lg text-start">
                  <i className="bi bi-calendar-x me-3"></i>
                  Manage Leave Requests
                  {stats.pendingLeave > 0 && (
                    <span className="badge bg-danger ms-2">{stats.pendingLeave}</span>
                  )}
                </a>
                <a href="/reports/employees" className="btn btn-outline-info btn-lg text-start">
                  <i className="bi bi-graph-up me-3"></i>
                  View Reports
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col>
          <Card className="fade-in" style={{ animationDelay: '0.8s' }}>
            <Card.Header>
              <h5 className="mb-0">Recent Activity</h5>
              <small className="text-muted">Latest updates</small>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-primary bg-opacity-10 p-2 rounded">
                      <i className="bi bi-person-plus text-primary"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">New employee added</div>
                    <small className="text-muted">John Doe joined IT Department</small>
                  </div>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-success bg-opacity-10 p-2 rounded">
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Leave approved</div>
                    <small className="text-muted">Sarah's annual leave request approved</small>
                  </div>
                  <small className="text-muted">5 hours ago</small>
                </div>
                <div className="list-group-item d-flex align-items-center">
                  <div className="me-3">
                    <div className="bg-warning bg-opacity-10 p-2 rounded">
                      <i className="bi bi-clock text-warning"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-medium">Attendance marked</div>
                    <small className="text-muted">15 employees checked in today</small>
                  </div>
                  <small className="text-muted">1 day ago</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  )
}
