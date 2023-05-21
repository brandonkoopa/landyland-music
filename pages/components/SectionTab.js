import React from 'react';
import styled from 'styled-components';

const SectionContainer = styled.span`
  border: 1px solid #fff;
  border-radius: 4px;
  position: relative;
  display: inline-block;
  width: 64px;
  height: 32px;
  overflow: hidden;

  &.selected {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid #FEF400;
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
  const minFrequency = Math.min(...notes.map(note => note.frequency));
  const maxFrequency = Math.max(...notes.map(note => note.frequency));
  const frequencyRange = maxFrequency - minFrequency;

  const minNoteIndex = Math.min(
    ...notes.filter(note => note.noteName !== null).map(note => note.noteName.charCodeAt(0))
  );
  const maxNoteIndex = Math.max(
    ...notes.filter(note => note.noteName !== null).map(note => note.noteName.charCodeAt(0))
  );
  const noteIndexRange = maxNoteIndex - minNoteIndex;

  return (
    <SectionContainer className={isSelected ? 'selected' : ''} onClick={onClick}>
      {notes.map((note, index) => {
        const left = (index / (notes.length - 1)) * 64;
        let bottom = 0;
        let size = Math.min(32, 64 / notes.length);

        if (note.frequency !== null || frequencyRange !== 0) {
          bottom = ((note.frequency - minFrequency) / frequencyRange) * 32;
        } else if (note.noteName !== null && noteIndexRange !== 0) {
          const noteIndex = note.noteName.charCodeAt(0);
          bottom = ((noteIndex - minNoteIndex) / noteIndexRange) * 32;
        } else {
          // Handle the case where both frequency and note name are null
          bottom = 16;
          size = 4;
        }

        return (
          <NoteSquare
            key={`${note.noteName}-${note.time}`}
            size={size}
            left={left}
            bottom={bottom}
            opacity={note.frequency === null && note.noteName === null ? 0 : 1}
          />
        );
      })}
    </SectionContainer>
  );
};

export default SectionTab;
