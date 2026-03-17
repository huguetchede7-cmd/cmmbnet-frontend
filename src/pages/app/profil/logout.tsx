import { routeHelpers } from '@/helpers/routeHelpers';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    logout(user?.token ?? null);

    setTimeout(() => {
        navigate(routeHelpers.auth.login);
    }, 500);

    return null;
};

export default LogoutPage;
