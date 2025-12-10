'use client'
import { useState, useEffect } from 'react'
import { Card, Table, Badge, Spinner, Tabs, Tab } from 'react-bootstrap'
import DashboardLayout from '@/components/Layout/DashboardLayout'
import api from '@/lib/api'
import { toast } from 'react-toastify'

export default function RolesPermissionsPage() {
  const [permissions, setPermissions] = useState([])
  const [rolesSummary, setRolesSummary] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [permsRes, rolesRes] = await Promise.all([
        api.get('/permissions'),
        api.get('/permissions/roles/summary')
      ])
      
      if (permsRes.data.success) {
        setPermissions(permsRes.data.data)
      }
      if (rolesRes.data.success) {
        setRolesSummary(rolesRes.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      super_admin: 'danger',
      admin: 'primary',
      manager: 'warning',
      user: 'secondary'
    }
    return badges[role] || 'secondary'
  }

  return (
    <DashboardLayout>
      <h2 className="mb-4">Roles & Permissions</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="Roles Summary">
            <Card>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Permissions Count</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesSummary.map(role => (
                      <tr key={role.role}>
                        <td>
                          <Badge bg={getRoleBadge(role.role)} className="me-2">
                            {role.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </td>
                        <td>
                          <strong>{role.permissions_count}</strong> permissions
                        </td>
                        <td>
                          <Badge bg="success">Active</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="permissions" title="All Permissions">
            <Card>
              <Card.Body>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Permission</th>
                      <th>Module</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(perm => (
                      <tr key={perm.id}>
                        <td>{perm.id}</td>
                        <td><code>{perm.permission_name}</code></td>
                        <td>
                          <Badge bg="info">{perm.module}</Badge>
                        </td>
                        <td>{perm.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      )}
    </DashboardLayout>
  )
}
