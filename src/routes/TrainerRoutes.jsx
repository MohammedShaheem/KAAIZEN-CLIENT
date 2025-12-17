import { Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute'; 
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import VerifyOTP from '../pages/VerifyOTP.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyResetOtp from '@/pages/VerifyResetOtp';
import ResetPassword from '@/pages/ResetPassword';

export default function TrainerRoutes() {
    return (
        <Routes>
            {/* public Routes */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify-otp' element={<VerifyOTP />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/verify-reset-otp' element={<VerifyResetOtp />} />
            <Route path='/reset-password' element={<ResetPassword />} />


            {/* protected Routes */}
            <Route element= {ProtectedRoute} />
                <Route path="/dashboard" element={<Dashboard />}  
            />


            {/* Default Redirects */}
            <Route path='/' element={<Navigate to="/login" />}/> 
            <Route path='*' element={<Navigate to="/login" />}/> 
        </Routes>

    );
};

