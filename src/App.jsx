import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NotificationProvider from './context/NotificationContext';
import { NotesProvider } from './context/NotesContext';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import NoteEditorPage from './pages/NoteEditorPage';
import ArchivePage from './pages/ArchivePage';
import TrashPage from './pages/TrashPage';
import TagsPage from './pages/TagsPage';
import NotebooksPage from './pages/NotebooksPage';
import LockedNotesPage from './pages/LockedNotesPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { FiMenu, FiX } from 'react-icons/fi';
function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };
  return (
    <NotificationProvider>
      <NotesProvider>
        <BrowserRouter>
          <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobile ? 'mobile-view' : ''}`}>
            {isMobile && (
              <div className="mobile-header">
                <button 
                  className="mobile-menu-btn" 
                  onClick={toggleSidebar}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? <FiX /> : <FiMenu />}
                </button>
                <div className="mobile-logo">📝 Notora</div>
              </div>
            )}
            <Sidebar 
              collapsed={isMobile ? !mobileMenuOpen : sidebarCollapsed} 
              toggleSidebar={toggleSidebar} 
              className={isMobile && mobileMenuOpen ? 'mobile-open' : ''}
            />
            <main className={`main-content ${isMobile ? 'mobile-content' : ''}`}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/new" element={<NoteEditorPage />} />
                <Route path="/edit/:id" element={<NoteEditorPage />} />
                <Route path="/trash" element={<TrashPage />} />
                <Route path="/tags" element={<TagsPage />} />
                {/* Protected notebooks route - require authentication */}
                <Route 
                  path="/notebooks" 
                  element={
                    <>
                      <SignedIn>
                        <NotebooksPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Auth routes */}
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                
                {/* Protected routes - require authentication */}
                <Route 
                  path="/archive" 
                  element={
                    <>
                      <SignedIn>
                        <ArchivePage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route 
                  path="/locked" 
                  element={
                    <>
                      <SignedIn>
                        <LockedNotesPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                <Route 
                  path="/locked/:id" 
                  element={
                    <>
                      <SignedIn>
                        <LockedNotesPage />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  } 
                />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotesProvider>
    </NotificationProvider>
  );
}
export default App;
