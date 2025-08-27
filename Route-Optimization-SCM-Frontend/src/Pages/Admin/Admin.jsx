import React from "react";

const Admin = () => {
  return (
    <div className="flex h-screen font-nunito bg-gray-100">
      

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-12 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-primary mb-4">Welcome Back, Admin!</h2>
          <p className="text-gray-700 text-lg">
            Here’s what’s happening with your platform today.
          </p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-primary">1,234</h3>
            <p className="text-gray-700">Active Users</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-primary">567</h3>
            <p className="text-gray-700">New Signups</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-primary">89%</h3>
            <p className="text-gray-700">Monthly Growth</p>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="bg-white shadow-md rounded-lg p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Recent Activity</h3>
          <ul className="space-y-4 text-gray-700">
            <li>User John Doe signed up.</li>
            <li>Settings updated by Admin Jane.</li>
            <li>System maintenance scheduled.</li>
            <li>New user support request received.</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Admin;
