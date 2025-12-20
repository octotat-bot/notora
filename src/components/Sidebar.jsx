import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import {
  FiHome,
  FiArchive,
  FiTag,
  FiBook,
  FiTrash2,
  FiLock,
  FiPlus,
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';

const Sidebar = ({ collapsed, toggleSidebar, className = '' }) => {
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { notes, archivedNotes, trashedNotes, lockedNotes, tags, notebooks } = useNotes();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleNavClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
      toggleSidebar();
    }
  };

  const navItems = [
    {
      path: '/',
      name: 'Home',
      icon: <FiHome />,
      count: notes.length
    },
    {
      path: '/archive',
      name: 'Archive',
      icon: <FiArchive />,
      count: archivedNotes.length
    },
    {
      path: '/tags',
      name: 'Tags',
      icon: <FiTag />,
      count: tags.length
    },
    {
      path: '/notebooks',
      name: 'Notebooks',
      icon: <FiBook />,
      count: notebooks.length,
      protected: true
    },
    {
      path: '/locked',
      name: 'Locked Notes',
      icon: <FiLock />,
      count: lockedNotes.length,
      protected: true
    },
    {
      path: '/trash',
      name: 'Trash',
      icon: <FiTrash2 />,
      count: trashedNotes.length
    },
    {
      path: '/profile',
      name: 'Settings',
      icon: <FiUser />,
      count: null
    }
  ];

  return (
    <>
      {isMobile && (
        <div className="mobile-header">
          <button
            className="mobile-menu-btn"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Open menu' : 'Close menu'}
          >
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
          <div className="mobile-logo">
            <img src="/logo.png" alt="Notora" className="sidebar-logo-img" style={{ height: '32px' }} />
          </div>
          <Link to="/new" className="mobile-new-btn">
            <FiPlus />
          </Link>
        </div>
      )}

      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''} ${mobileMenuOpen ? 'mobile-open' : ''} ${className}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Notora" className="sidebar-logo-img" style={{ height: '40px' }} />
          </div>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => {
            const isProtected = item.protected && !isSignedIn;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''} ${isProtected ? 'protected' : ''}`}
                title={isProtected ? `Sign in to access ${item.name}` : ''}
                onClick={handleNavClick}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-text">
                  {item.name}
                  {isProtected && <span className="lock-indicator">🔒</span>}
                </span>
                {item.count !== null && (
                  <span className="nav-item-count">{item.count}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="sidebar-actions">
          <Link to="/new" className="new-note-btn">
            <FiPlus />
            {!collapsed && <span>New Note</span>}
          </Link>

          {!collapsed && (
            <div className="sidebar-auth">
              {isSignedIn ? (
                <Link to="/profile" className="user-info" onClick={handleNavClick}>
                  <UserButton afterSignOutUrl="/" />
                  <span className="user-name">{user?.firstName || 'User'}</span>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="sign-in-btn">
                    <FiUser /> Sign In
                  </button>
                </SignInButton>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;