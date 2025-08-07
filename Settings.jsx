import React, { useState, useEffect } from "react";
import { FaUserEdit, FaUser, FaLock, FaTrash, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import { useAuth } from '../AuthContext';
import DashNav from "./DashNav";
import Footer from "./Footer";

export default function SettingsPage() {
  const { user } = useAuth();
  const [active, setActive] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profile_pic || "/logo192.png");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    profile_pic: user?.profile_pic || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || "",
        profile_pic: user.profile_pic || ""
      }));
      setProfilePic(user.profile_pic || "/logo192.png");
    }
  }, [user]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setFormData(prev => ({ ...prev, profile_pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: formData.username, profile_pic: formData.profile_pic })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword })
      });
      const data = await res.json();
      if (data.success) {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        alert('Password changed successfully!');
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      <main className="flex-1 flex flex-col">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row gap-8 p-6 mt-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-center">Settings</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setActive("profile")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                    ${active === "profile"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                    }
                  `}
                >
                  <span className="text-lg"><FaUser /></span> Profile
                </button>
              <button
                  onClick={() => setActive("account")}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-300 font-medium
                    ${active === "account"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                      }
                `}
              >
                  <span className="text-lg"><FaLock /></span> Password
              </button>
              </div>
            </div>
          </aside>
          {/* Main Section */}
          <section className="flex-1 space-y-6">
            {/* Profile Settings */}
            {active === "profile" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <FaUser className="text-blue-400" /> Profile Settings
                  </h2>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isEditing 
                        ? "bg-gray-600 hover:bg-gray-700 text-white" 
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? <FaTimes /> : <FaUserEdit />}
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img 
                          src={profilePic}
                          alt="Profile" 
                          className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePicChange}
                          className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
                          style={{ zIndex: 2 }}
                        />
                        <button className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-all duration-300 pointer-events-none">
                          <FaCamera className="w-4 h-4" />
                        </button>
                      </div>
                    <div>
                        <h3 className="font-semibold text-lg">{formData.username || "User"}</h3>
                        <p className="text-gray-400">Update your profile picture</p>
                      </div>
                    </div>
                    {/* Username */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input 
                          type="text" 
                          name="username"
                          value={formData.username}
                          onChange={handleFormChange}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                        />
                    </div>
                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <FaSave className="animate-spin" /> : <FaSave />}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <img 
                        src={profilePic}
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover" 
                      />
                    <div>
                        <h3 className="font-bold text-xl">{formData.username}</h3>
                    </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Password Settings */}
            {active === "account" && (
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                  <FaLock className="text-blue-400" /> Change Password
                </h2>
                <div className="space-y-8">
                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password" 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                      />
                      <input 
                        type="password" 
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password" 
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" 
                      />
                  </div>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm New Password" 
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 mb-4" 
                    />
                    <button 
                      onClick={handleChangePassword}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
