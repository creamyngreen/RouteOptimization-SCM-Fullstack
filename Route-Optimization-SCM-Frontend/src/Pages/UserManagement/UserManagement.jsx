/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { useSelector } from "react-redux";
import "./UserManagement.css";

const UserManagement = () => {
  const user = useSelector((state) => state.account.userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [memberInfo, setMemberInfo] = useState({
    email: "",
    password: "********",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    username: "",
    phone: "",
    marketingAgreement: true,
  });

  const [companyInfo, setCompanyInfo] = useState({
    companyName: "EffiRoute",
    registrationNumber: "",
    sector: "Route Optimization",
  });

  useEffect(() => {
    if (user) {
      setMemberInfo({
        email: user.email || "",
        password: "********",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        username: user.username || "",
        phone: user.phone || "",
        marketingAgreement: true,
      });
    }
  }, [user]);

  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMemberInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    if (memberInfo.newPassword || memberInfo.confirmPassword) {
      if (!memberInfo.oldPassword) {
        alert("Please enter your current password");
        return;
      }
      if (memberInfo.newPassword !== memberInfo.confirmPassword) {
        alert("New passwords do not match");
        return;
      }
      if (memberInfo.newPassword.length < 6) {
        alert("New password must be at least 6 characters long");
        return;
      }
    }
    // TODO: Add API call to update user information
    setIsEditing(false);
    setMemberInfo((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCompanyChanges = () => {
    setIsEditingCompany(false);
  };

  useEffect(() => {
    if (!isEditing) {
      setMemberInfo((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="w-full md:w-64 lg:w-80 border-b md:border-r bg-white p-4">
        <h3 className="text-lg font-semibold text-gray-500 mb-4">
          Account & Company Information
        </h3>
        <ul className="space-y-2">
          <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">
            Manage Account Information
          </li>
          <li className="hover:bg-gray-200 p-2 rounded cursor-pointer">
            Payment Management
          </li>
        </ul>
      </aside>

      <div className="flex-1 p-6">
        <InfoSection
          title="Member Information"
          icon={<FaUser className="text-primary bg-orange-100 rounded-lg w-10 h-10 p-2 mr-2" />}
          isEditing={isEditing}
          onToggleEdit={handleEditToggle}
          onSaveChanges={handleSaveChanges}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Email" value={memberInfo.email} name="email" isEditing={isEditing} onChange={handleInputChange} />
            <PasswordField memberInfo={memberInfo} isEditing={isEditing} onChange={handleInputChange} />
            <InfoField label="Name" value={memberInfo.username} name="username" isEditing={isEditing} onChange={handleInputChange} />
            <InfoField label="Phone Number" value={memberInfo.phone} name="phone" isEditing={isEditing} onChange={handleInputChange} />
            <CheckboxField label="Receive Marketing Info" checked={memberInfo.marketingAgreement} isEditing={isEditing} onChange={() => setMemberInfo((prev) => ({ ...prev, marketingAgreement: !prev.marketingAgreement }))} />
          </div>
        </InfoSection>

        <InfoSection
          title="Company Information"
          icon={<IoIosBusiness className="text-green-500 bg-green-100 rounded-lg w-10 h-10 p-2 mr-2" />}
          isEditing={isEditingCompany}
          onToggleEdit={() => setIsEditingCompany(!isEditingCompany)}
          onSaveChanges={handleSaveCompanyChanges}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField label="Company Name" value={companyInfo.companyName} name="companyName" isEditing={isEditingCompany} onChange={handleCompanyInputChange} />
            <InfoField label="Business Registration Number" value={companyInfo.registrationNumber} name="registrationNumber" isEditing={isEditingCompany} onChange={handleCompanyInputChange} />
            <InfoField label="Industrial Sector" value={companyInfo.sector} name="sector" isEditing={isEditingCompany} onChange={handleCompanyInputChange} />
          </div>
        </InfoSection>
      </div>
    </div>
  );
};

const InfoSection = ({ title, icon, isEditing, onToggleEdit, onSaveChanges, children }) => (
  <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {icon}
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="flex">
        <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded hover:bg-gray-300 mr-2" onClick={onToggleEdit}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && (
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600" onClick={onSaveChanges}>
            Save Changes
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);

const InfoField = ({ label, value, name, isEditing, onChange }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 mb-1">{label}</label>
    {isEditing ? (
      <input type="text" name={name} value={value} onChange={onChange} className="w-full p-2 border rounded" />
    ) : (
      <span className="text-gray-800 font-medium">{value}</span>
    )}
  </div>
);

const PasswordField = ({ memberInfo, isEditing, onChange }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 mb-1">Password</label>
    {isEditing ? (
      <div className="space-y-2">
        <input type="password" name="oldPassword" placeholder="Current Password" value={memberInfo.oldPassword} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="password" name="newPassword" placeholder="New Password" value={memberInfo.newPassword} onChange={onChange} className="w-full p-2 border rounded" />
        <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={memberInfo.confirmPassword} onChange={onChange} className="w-full p-2 border rounded" />
      </div>
    ) : (
      <span className="text-gray-800 font-medium">********</span>
    )}
  </div>
);

const CheckboxField = ({ label, checked, isEditing, onChange }) => (
  <div className="flex items-center">
    <label className="text-gray-600 mr-2">{label}</label>
    {isEditing ? (
      <input type="checkbox" checked={checked} onChange={onChange} className="w-5 h-5" />
    ) : (
      <span className="text-gray-800 font-medium">{checked ? "Yes" : "No"}</span>
    )}
  </div>
);

export default UserManagement;
