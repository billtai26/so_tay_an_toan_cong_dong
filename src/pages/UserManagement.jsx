/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip, IconButton,
  Alert, CircularProgress, Stack
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { getAllUsers, updateUserRole, deleteUser } from '../services/userService'
import PageTransition from '../components/PageTransition'

const UserManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const result = await getAllUsers()
      if (result.success) setUsers(result.data)
    } catch (err) {
      setError('Không thể tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const result = await updateUserRole(user._id, newRole)
      if (result.success) {
        setSuccess('Cập nhật quyền thành công')
        loadUsers()

        // --- HIỂN THỊ TRONG 5 GIÂY RỒI TẮT ---
        setTimeout(() => {
          setSuccess('')
        }, 5000)
      }
    } catch (err) {
      setError('Lỗi khi cập nhật quyền')
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const result = await deleteUser(id)
        if (result.success) {
          setSuccess('Đã xóa người dùng thành công')
          loadUsers()

          // --- HIỂN THỊ TRONG 5 GIÂY RỒI TẮT ---
          setTimeout(() => {
            setSuccess('')
          }, 5000)
        }
      } catch (err) {
        setError('Lỗi khi xóa người dùng')
        setTimeout(() => setError(''), 5000)
      }
    }
  }

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', py: 8 }}>
        <Container maxWidth="xl">
          {/* Header & Back Button */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                textTransform: 'none', borderRadius: 2,
                borderColor: 'rgba(255,255,255,0.3)', color: '#fff',
                height: '40px', '&:hover': { borderColor: '#10b981', bgcolor: 'rgba(16, 185, 129, 0.1)' }
              }}
            >
              Quay lại
            </Button>
            <Box sx={{ width: '1px', height: '32px', bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#06b6d4' }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#e2e8f0' }}>
                Quản Lý Người Dùng
              </Typography>
            </Box>
          </Box>

          {/* Alerts */}
          {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#06b6d4' }} />
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#0f172a' }}>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Tên người dùng</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Quyền hạn</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Ngày tham gia</TableCell>
                    <TableCell sx={{ color: '#e2e8f0', fontWeight: 700 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} sx={{ '&:hover': { bgcolor: '#334155' }, borderBottom: '1px solid #475569' }}>
                      {/* Tên màu trắng */}
                      <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{user?.username}</TableCell>
                      {/* Email màu trắng/xám nhạt */}
                      <TableCell sx={{ color: '#f1f5f9' }}>{user?.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user?.role.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            // --- CHỮ USER MÀU TRẮNG VÀ NỀN TƯƠNG PHẢN ---
                            color: '#fff',
                            bgcolor: user.role === 'admin' ? '#ef4444' : '#475569',
                            border: '1px solid rgba(255,255,255,0.2)'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1' }}>
                        {new Date(user?.createdAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleToggleRole(user)}
                          sx={{ color: '#f59e0b', mr: 1, '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.1)' } }}
                          title="Chuyển đổi quyền Admin/User"
                        >
                          <AdminPanelSettingsIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteUser(user._id)}
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
                          title="Xóa người dùng"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </PageTransition>
  )
}

export default UserManagement