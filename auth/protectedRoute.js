import { useSelector } from 'react-redux'
import LoginScreen from '../screens/LoginScreen';

const ProtectedRoute = ({ children }) => {
    const accessToken = useSelector((state) => state.auth.accessToken);

    if (accessToken === null) {
        return <LoginScreen />;
    }

    return children;
};

export default ProtectedRoute;