import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import AnnouncementsList from './pages/AnnouncementsList';
import AnnouncementsDetail from './pages/AnnouncementsDetail';
import MembersDirectory from './pages/MembersDirectory';
import MemberProfile from './pages/MemberProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/Contact';
import DemoPage from './pages/DemoPage';
import AdminLayout from './components/AdminLayout';
import PlatformAdminLayout from './components/PlatformAdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminMembers from './pages/admin/AdminMembers';
import { useAuth } from './context/AuthContext';

function AdminRoute({ children }) {
  const { isContentAdmin, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary">Yükleniyor...</div></div>;
  if (!isAuthenticated) return <Navigate to="/login?redirect=/admin" replace />;
  if (!isContentAdmin) return <Navigate to="/" replace />;
  return children;
}

function PlatformAdminRoute({ children }) {
  const { isPlatformAdmin, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-primary">Yükleniyor...</div></div>;
  if (!isAuthenticated) return <Navigate to="/login?redirect=/platform-admin" replace />;
  if (!isPlatformAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="news" element={<NewsList />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="announcements" element={<AnnouncementsList />} />
        <Route path="announcements/:id" element={<AnnouncementsDetail />} />
        <Route path="members" element={<MembersDirectory />} />
        <Route path="members/:id" element={<MemberProfile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="contact" element={<Contact />} />
        <Route path="demo" element={<DemoPage />} />
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="members" element={<AdminMembers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
