import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.span`
  background-color: #000; 
  border: 1px solid rgba(0,0,0,0);
  position: relative;
  display: inline-block;
  width: 64px;
  height: 32px;
  overflow: hidden;
  cursor: pointer;

  &.selected {
    border: 1px solid #FEF400;
  }

  &:hover {
    border-color: ${props => (props.theme && props.theme.color && props.theme.color.hover) || '#fff'};
  }
`;

const NoteSquare = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: #fff;
  left: ${props => props.left}px;
  bottom: ${props => props.bottom}px;
  opacity: ${props => props.opacity};
  transform: translateY(12px);
`;

const SectionTab = ({ notes, isSelected, onClick }) => {
  if (!notes) return <div></div>;

  // Filter out null values from the notes array
  const validNotes = notes.filter(note => note !== null && note.frequency !== null);

  // Now you can calculate min and max frequencies safely
  const minFrequency = validNotes.length > 0 ? Math.min(...validNotes.map(note => note.frequency)) : 0;
  const maxFrequency = validNotes.length > 0 ? Math.max(...validNotes.map(note => note.frequency)) : 0;
  const frequencyRange = maxFrequency - minFrequency;

  // Do similar filtering for noteName calculations
  const validNoteNames = notes.filter(note => note !== null && note.noteName !== null);
  const minNoteIndex = validNoteNames.length > 0 
    ? Math.min(...validNoteNames.map(note => note.noteName.charCodeAt(0))) 
    : 0;
  const maxNoteIndex = validNoteNames.length > 0 
    ? Math.max(...validNoteNames.map(note => note.noteName.charCodeAt(0))) 
    : 0;
  const noteIndexRange = maxNoteIndex - minNoteIndex;

  return (
    <SectionContainer className={isSelected ? 'selected' : ''} onClick={onClick}>
    {notes?.map((note, index) => {
      const left = (index / (notes.length - 1)) * 64;
      let bottom = 0;
      let size = Math.min(32, 64 / notes.length);

      // Check if note is not null before accessing its properties
      if (note && note.frequency !== null && frequencyRange !== 0) {
        bottom = ((note.frequency - minFrequency) / frequencyRange) * 32;
      } else if (note && note.noteName !== null && noteIndexRange !== 0) {
        const noteIndex = note.noteName.charCodeAt(0);
        bottom = ((noteIndex - minNoteIndex) / noteIndexRange) * 32;
      } else {
        // Handle the case where both frequency and note name are null
        bottom = 16; // Default value when note is null
        size = 4;    // Default size when note is null
      }

      return (
        <NoteSquare
          key={`${note?.noteName}-${note?.time}-${index}`}
          size={size}
          left={left}
          bottom={bottom}
          opacity={note ? 1 : 0} // Only render opacity if note is not null
        />
      );
    })}
  </SectionContainer>
  );
};

export default SectionTab;
