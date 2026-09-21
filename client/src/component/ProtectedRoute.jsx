import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from 'react-router-dom'


const ProtectedRoute = () => {
  
    const { user, loading } = useAuth();

    if (loading) {
        <h1>Loading...</h1>
    }

    if (!user) {
        return <Navigate to='/login' replace/>
    } 

    return <Outlet />
}

export default ProtectedRoute