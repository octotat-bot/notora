import { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { FiUser, FiMail, FiCalendar, FiLock, FiUnlock, FiShield } from 'react-icons/fi';
import { useNotification } from '../context/NotificationContext';
import { useNotes } from '../context/NotesContext';
import PinModal from '../components/PinModal';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { showSuccess, showError } = useNotification();
  const { isPinSet } = useNotes();
  const { isSignedIn, user, isLoaded } = useUser();
  const [showPinModal, setShowPinModal] = useState(false);

  // Format date nicely
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'G';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)} `.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (user.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  // If not loaded yet, show loading
  if (!isLoaded) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // If not signed in, show sign in prompt
  if (!isSignedIn) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>Settings</h1>
        </div>
        <div className="profile-card">
          <div className="sign-in-prompt">
            <FiUser size={48} />
            <h2>Sign in to access settings</h2>
            <p>Create an account or sign in to manage your profile and sync your notes across devices.</p>
            <SignInButton mode="modal">
              <button className="sign-in-btn-large">
                <FiUser /> Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Settings</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt={user.firstName || 'User'} className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {getUserInitials()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="info-group">
            <label>
              <FiUser /> Full Name
            </label>
            <div className="info-value">
              {user.firstName || user.lastName
                ? `${user.firstName || ''} ${user.lastName || ''} `.trim()
                : user.username || 'Not set'}
            </div>
          </div>

          <div className="info-group">
            <label>
              <FiMail /> Email
            </label>
            <div className="info-value">
              {user.primaryEmailAddress?.emailAddress || 'No email'}
            </div>
          </div>

          <div className="info-group">
            <label>
              <FiUser /> Username
            </label>
            <div className="info-value">
              {user.username || 'Not set'}
            </div>
          </div>

          <div className="info-group">
            <label>
              <FiCalendar /> Member Since
            </label>
            <div className="info-value">
              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stats-card pin-management">
          <h3><FiShield /> Note Security</h3>
          <p>{isPinSet ? 'PIN is set for locked notes' : 'No PIN set for note locking'}</p>
          <button
            className="pin-button"
            onClick={() => setShowPinModal(true)}
          >
            {isPinSet ? (
              <>
                <FiLock /> Change PIN
              </>
            ) : (
              <>
                <FiUnlock /> Set PIN
              </>
            )}
          </button>
        </div>

        <div className="stats-card">
          <h3>Account Status</h3>
          <p className="status-active">
            <span className="status-dot"></span>
            Active
          </p>
        </div>
      </div>

      {showPinModal && (
        <PinModal
          isOpen={showPinModal}
          mode="set"
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            showSuccess('PIN set successfully');
            setShowPinModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;