import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { LandingPage } from '../pages/LandingPage'
import Login from '../pages/Login'
import { Register } from '../pages/Register'
import { RecuperarContrasena } from '../pages/RecuperarContrasena'
import { Dashboard } from '../pages/Dashboard'
import AdmonMain from '../pages/AdmonMain'
import ProfesorDashboard from '../pages/dashboard/ProfesorDashboard'
import EstudianteDashboard from '../pages/dashboard/EstudianteDashboard'
import { Logout } from '../pages/dashboard/Logout'
import { DeleteAccount } from '../pages/dashboard/DeleteAccount'
import { FormProfesor } from '../pages/completar/FormProfesor'
import { FormEstudiante } from '../pages/completar/FormEstudiante'
import { FormAdministrador } from '../pages/completar/FormAdministrador'
import NotFound from '../components/NotFound'

const router = createBrowserRouter([
  // Rutas públicas con Layout principal
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'dashboard/profesor',
        element: <ProfesorDashboard />
      },
      {
        path: 'dashboard/estudiante',
        element: <EstudianteDashboard />
      },
      {
        path: 'dashboard/logout',
        element: <Logout />
      },
      {
        path: 'dashboard/eliminar-cuenta',
        element: <DeleteAccount />
      },
      {
        path: 'admonMain',
        element: <AdmonMain />
      }
    ]
  },
  // Rutas de autenticación con Layout específico
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/registrar',
        element: <Register />
      },
      {
        path: '/recuperar-contrasena',
        element: <RecuperarContrasena />
      }
    ]
  },
  // Rutas para completar perfil
  {
    path: '/completar-perfil',
    children: [
      {
        path: 'profesor/:token',
        element: <FormProfesor />
      },
      {
        path: 'estudiante/:token',
        element: <FormEstudiante />
      },
      {
        path: 'administrador/:token',
        element: <FormAdministrador />
      }
    ]
  },
  // Ruta 404 - Not Found
  {
    path: '*',
    element: <NotFound />
  }
])

export default router