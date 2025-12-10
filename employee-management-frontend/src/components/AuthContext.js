'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, removeAuth } from '@/lib/auth'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
// 💡 PERBAIKAN 1: Import js-cookie di sini sebagai standar ES Module
import Cookies from 'js-cookie' 

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [menus, setMenus] = useState([])
  const router = useRouter()

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = getUser()
      if (currentUser) {
        setUser(currentUser)
        // Bungkus fetchMenus di sini dengan try/catch agar tidak crash saat init
        try {
          await fetchMenus()
        } catch (e) {
          console.error('Error fetching menus during initialization:', e)
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      if (response.data.success) {
        setMenus(response.data.data.menus || [])
      }
    } catch (error) {
      console.error('Failed to fetch menus:', error)
      // Throw error agar pemanggil (misal: initAuth) tahu ada kegagalan,
      // tapi kita akan menangani ini secara spesifik di fungsi login.
      throw error 
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      
      // Cek apakah server merespons sukses (HTTP 200) DAN response body success: true
      if (response.data.success) {
        const { user, token } = response.data.data
        setUser(user)
        
        // 💡 PERBAIKAN 1: Menggunakan Cookies yang diimport di atas
        Cookies.set('token', token, { expires: 7 })
        Cookies.set('user', JSON.stringify(user), { expires: 7 })
        
        // 💡 PERBAIKAN 2: JANGAN gunakan AWAIT pada fetchMenus
        // Biarkan fetchMenus berjalan di background. Jika fetchMenus gagal,
        // fungsi login() utama sudah selesai dan tidak akan mengembalikan 'undefined'.
        // Ini mengatasi kegagalan runtime internal.
        fetchMenus().catch(e => {
            console.warn('Menu fetch failed after successful login, proceeding to dashboard.')
        })
        
        toast.success('Login successful!')
        router.push('/dashboard')
        return { success: true }
      }
      
      // Jika response.data.success adalah false (misal, custom error API)
      return { 
        success: false, 
        message: response.data.message || 'Login failed: Server rejected credentials.' 
      }

    } catch (error) {
      // Menangkap error jaringan, 401, 500, atau error saat token/user tidak ada
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed due to connection or server error.' 
      }
    }
  }

  const logout = () => {
    removeAuth()
    setUser(null)
    setMenus([])
    router.push('/login')
    toast.info('Logged out successfully')
  }

  const checkPermission = async (permissionName) => {
    try {
      const response = await api.post('/permissions/check', {
        permission_name: permissionName
      })
      return response.data.data.has_permission
    } catch (error) {
      return false
    }
  }

  const value = {
    user,
    loading,
    menus,
    login,
    logout,
    checkPermission,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    isManager: user?.role === 'manager'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}