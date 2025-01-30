// AdminLayout.jsx
import { Outlet } from 'react-router-dom';

export default function AdminOutlet() {
  return (
    <div className="admin-outlet">
      <Outlet />
    </div>
  );
}