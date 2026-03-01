import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useNotification } from '../context/NotificationContext';
import NoteEditor from '../components/NoteEditor';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import '../styles/NoteEditorPage.css';
const NoteEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    notes,
    archivedNotes,
    lockedNotes,
    createNote,
    updateNote
  } = useNotes();
  const { showSuccess, showError } = useNotification();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedNotebook, setSelectedNotebook] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const urlParams = new URLSearchParams(location.search);
  const notebookIdFromUrl = urlParams.get('notebookId');
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  useEffect(() => {
    setViewMode(false);
  }, [location, id]);
  useEffect(() => {

    if (id === 'new') {
      setIsNew(true);
      setNote(null);
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setSelectedNotebook(notebookIdFromUrl || null);
      setIsLocked(false);
      return;
    }
    const allNotes = [...notes, ...archivedNotes, ...lockedNotes];
    const existingNote = allNotes.find(n => n.id === id);
    if (existingNote) {
      setIsNew(false);
      setNote(existingNote);
      setTitle(existingNote.title || '');
      if (existingNote.content !== undefined && existingNote.content !== null) {
        const contentStr = String(existingNote.content);
        setContent(contentStr);
      } else {
        setContent('');
      }
      setSelectedTags(existingNote.tagIds || []);
      setSelectedNotebook(existingNote.notebookId || null);
      setIsLocked(lockedNotes.some(n => n.id === id));
    } else {
      setIsNew(true);
      setNote(null);
      setTitle('');
      setContent('');
      setSelectedTags([]);
      setSelectedNotebook(null);
      setIsLocked(false);
    }
  }, [id, notes, archivedNotes, lockedNotes, navigate, notebookIdFromUrl]);
  const handleSave = (data = {}) => {
    // If no data is provided, use the current state
    const noteTitle = data.title !== undefined ? data.title : title;
    const noteContent = data.content !== undefined ? data.content : content;

    if (!noteTitle.trim() && !noteContent.trim()) {
      navigate('/');
      return;
    }

    const noteData = {
      title: noteTitle.trim() || 'Untitled',
      content: noteContent || '',
      tagIds: selectedTags,
      notebookId: selectedNotebook,
      updatedAt: new Date().toISOString()
    };

    try {
      if (isNew) {
        const newNote = createNote(noteData);
        navigate('/');
        showSuccess('Note created successfully!');
      } else {
        updateNote(id, {
          title: noteTitle.trim() || 'Untitled',
          content: noteContent || '',
          tagIds: selectedTags,
          notebookId: selectedNotebook,
          updatedAt: new Date().toISOString()
        });
        navigate('/');
        showSuccess('Note updated successfully!');
      }
    } catch (error) {
      console.error('Error saving note:', error);
      showError('Error saving note. Please try again.');
    }
  };

  const hasUnsavedChanges = useCallback(() => {
    if (!viewMode && (title.trim() || content.trim())) {

      if (!isNew && note) {
        const originalTitle = note.title || '';
        const originalContent = note.content || '';
        return title !== originalTitle || content !== originalContent;
      }

      return true;
    }
    return false;
  }, [viewMode, title, content, isNew, note]);

  const handleBackClick = () => {
    if (hasUnsavedChanges()) {
      setShowBackConfirmation(true);
    } else {
      navigate(-1);
    }
  };

  const confirmSaveAndLeave = () => {
    handleSave({
      title,
      content
    });
    setShowBackConfirmation(false);
  };

  const confirmLeaveWithoutSaving = () => {
    navigate('/');
    setShowBackConfirmation(false);
  };


  useEffect(() => {

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showBackConfirmation) {
        setShowBackConfirmation(false);
      }


      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };


    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showBackConfirmation, hasUnsavedChanges, handleSave]);
  return (
    <div className="note-editor-page">
      <div className="editor-header">
        <button className="back-button" onClick={handleBackClick}>
          <FiArrowLeft /> <span className="button-text">Back</span>
        </button>

        <div className="mobile-only editor-quick-actions">
          <button
            className="mobile-save-button"
            onClick={handleSave}
            aria-label="Save Note"
          >
            <FiSave /> <span className="button-text">Save</span>
          </button>
        </div>
      </div>

      <NoteEditor
        mode={id === 'new' ? 'create' : 'edit'}
        title={title}
        content={content}
        selectedTags={selectedTags}
        selectedNotebook={selectedNotebook}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onTagsChange={setSelectedTags}
        onNotebookChange={setSelectedNotebook}
        onSave={handleSave}
        readOnly={viewMode}
      />

      {showBackConfirmation && (
        <div className="notification-dialog">
          <div className="confirmation-content">
            <h3>💾 Unsaved Changes</h3>
            <p>You have unsaved changes. What would you like to do?</p>
            <div className="confirmation-actions">
              <button className="cancel-button" onClick={confirmLeaveWithoutSaving}>
                <FiX /> <span className="button-text">Discard</span>
              </button>
              <button className="confirm-button" onClick={confirmSaveAndLeave}>
                <FiSave /> <span className="button-text">Save & Leave</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default NoteEditorPage;