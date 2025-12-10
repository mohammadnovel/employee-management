'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Button, Badge, Spinner, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'
import Link from 'next/link'

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees')
      if (response.data.success) {
        const data = response.data.data
        if (Array.isArray(data)) {
          setEmployees(data)
        } else if (data?.employees && Array.isArray(data.employees)) {
          setEmployees(data.employees)
        } else {
          setEmployees([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      toast.error('Failed to fetch employees')
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${selectedEmployee.id}`)
      toast.success('Employee deleted successfully')
      setShowDeleteModal(false)
      setSelectedEmployee(null)
      fetchEmployees() // Refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations']

  // Logic Filtering (sudah baik)
  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp => {
    const matchesSearch = 
      emp.employee_code?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(search.toLowerCase()) ||
      emp.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.first_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase())
    const matchesDept = !department || emp.department === department
    return matchesSearch && matchesDept
  }) : []

  return (
    <DashboardLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-person-badge me-2"></i>
            Employee List
          </h2>
          <p className="text-muted mb-0">Manage all employees in your organization</p>
        </div>
        {/* 💡 PERBAIKAN ROUTING: Menggunakan /dashboard/employees/create */}
        <Link href="/employees/create" className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i>
          Add Employee
        </Link>
      </div>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by code, name, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={4}>
              <Form.Select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-people fs-1 mb-3 d-block"></i>
              <h5>No employees found</h5>
              <p>Try adjusting your search or filter</p>
              {/* 💡 PERBAIKAN ROUTING */}
              <Link href="/dashboard/employees/create" className="btn btn-primary">
                <i className="bi bi-person-plus me-2"></i>
                Add First Employee
              </Link>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td><strong>{employee.employee_code || employee.employee_id}</strong></td>
                    <td>{employee.full_name || `${employee.first_name || ''} ${employee.last_name || ''}`}</td>
                    <td>{employee.email}</td>
                    <td>{employee.position}</td>
                    <td>
                      <Badge bg="info">{employee.department}</Badge>
                    </td>
                    <td>
                      <Badge bg={employee.status === 'Active' ? 'success' : employee.status === 'On Leave' ? 'warning' : 'danger'}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="text-nowrap">
                      {/* 💡 PERBAIKAN ROUTING: View Detail */}
                      <Link 
                        href={`/employees/${employee.id}`} 
                        className="btn btn-sm btn-outline-info me-1"
                        aria-label="View Detail"
                      >
                        <i className="bi bi-file-earmark-person"></i> 
                      </Link>
                      
                      {/* 💡 PERBAIKAN ROUTING: Edit */}
                      <Link 
                        href={`/employees/${employee.id}/edit`} 
                        className="btn btn-sm btn-outline-primary me-1"
                        aria-label="Edit Employee"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      
                      {/* Ikon Delete */}
                      <Button 
                        size="sm" 
                        variant="outline-danger"
                        onClick={() => {
                          setSelectedEmployee(employee)
                          setShowDeleteModal(true)
                        }}
                        aria-label="Delete Employee"
                      >
                        <i className="bi bi-trash3"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete employee{' '}
          <strong>
            {selectedEmployee?.full_name || `${selectedEmployee?.first_name || ''} ${selectedEmployee?.last_name || ''}`}
          </strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={!selectedEmployee}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  )
}