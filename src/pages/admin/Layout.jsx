import React from 'react';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-layout__content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;