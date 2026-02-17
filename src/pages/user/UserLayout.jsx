import { Outlet } from 'react-router-dom';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import './UserLayout.css';

const UserLayout = () => {
    return (
        <div className="user-layout">
            <Header />
            <main className="user-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
