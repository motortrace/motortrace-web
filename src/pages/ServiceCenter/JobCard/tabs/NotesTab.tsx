import React from 'react';

interface NotesTabProps {
  notes: string;
  onNotesChange: (value: string) => void;
}

const NotesTab: React.FC<NotesTabProps> = ({ notes, onNotesChange }) => (
  <div>
    <h3 className="job-card__section-title">Work Notes & Comments</h3>
    <textarea
      className="job-card__notes-textarea"
      placeholder="Add notes about the work performed, customer concerns, recommendations, etc."
      value={notes}
      onChange={e => onNotesChange(e.target.value)}
    />
  </div>
);

export default NotesTab;
