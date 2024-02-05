import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getFrequencyByLetter, getNoteNameByFrequency, getHalfStepsFromRoot } from '../../lib/noteHelpers';

const NoteSize = 16; // The size of each note
const GridSize = 16; // The number of notes in one row/column
const GridBorder = '1px solid #ccc'; // Gray border for the grid lines

const Note = styled.div`
  width: ${NoteSize}px;
  height: ${NoteSize}px;
  background-color: ${({ hasNote, isSelected }) => isSelected ? 'yellow' : (hasNote ? 'white' : 'rgba(0,0,0,0)')};
  border-left: ${GridBorder};
  border-top: ${GridBorder};
  box-sizing: border-box;
  touch-action: none; // this is what keeps page from moving while dragging notes on touch screen

  &:nth-child(${GridSize}n) {
    border-right: ${GridBorder};
  }

  &:nth-last-child(-n+${GridSize}) {
    border-bottom: ${GridBorder};
  }
`;

const NotesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${GridSize}, ${NoteSize}px); // Creates a 16x16 grid
  grid-template-rows: repeat(${GridSize}, ${NoteSize}px); // Creates rows for the grid
  gap: 0; // No space between the notes, borders will create the grid appearance
  background-color: black;
  border-left: ${GridBorder};
  border-top: ${GridBorder};
`;

const GhostNote = styled.div`
  position: fixed;
  width: ${NoteSize}px;
  height: ${NoteSize}px;
  background-color: rgba(255, 255, 0, 0.5);
  border-left: ${GridBorder};
  border-top: ${GridBorder};
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const MusicNotesComponent = ({
  songData = { tracks: [{ sections: [{ notes: [] }] }] }, // Default empty structure
  selectedNoteIndex,
  updateSelectedNoteIndex,
  writeNoteAtIndex, // You will pass this function as a prop from the parent component
}) => {

  // This state will hold the initial position of the dragged note
  const [draggedNote, setDraggedNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [isGhostNoteVisible, setIsGhostNoteVisible] = useState(false);
  const [ghostNotePosition, setGhostNotePosition] = useState({ x: 0, y: 0 });

  const notesContainerRef = useRef(null);

  // Determine the notes to display from the songData
  const sectionNotes = songData?.tracks?.[0]?.sections?.[0]?.notes || [];

  // Create an array to represent the grid
  const notesGrid = Array.from({ length: GridSize * GridSize }, () => null);

  // Fill the grid with notes from the songData
  sectionNotes.forEach(note => {
    if (note && note.noteName && (note.halfStepFromRoot !== null || note.stepFromRoot !== null)) {
      const root = note.halfStepFromRoot !== null ? note.halfStepFromRoot : note.stepFromRoot * 2;
      const position = note.index + (GridSize - 1 - root) * GridSize;
      notesGrid[position] = { ...note, gridIndex: position }; // Include gridIndex if needed for UI, but maintain original note index
    }
  });

  // Function to handle note click, takes x and y position of the note in the grid
  const handleNoteClick = (note) => {
    // Calculate the index in the one-dimensional array representation
    if (note && note.hasOwnProperty('index')) {
      // setSelectedNoteIndex(note.index);
      updateSelectedNoteIndex(note.index)
    }
  };

  // Shared logic for when the note is dropped
  const dropNote = (clientX, clientY) => {
    if (!draggedNote) return;

    const notesContainer = notesContainerRef.current; // Ensure you have useRef() to get this reference
    const gridRect = notesContainer.getBoundingClientRect();
    const x = clientX - gridRect.left; // get the horizontal position of the drop
    const y = clientY - gridRect.top;  // get the vertical position of the drop
    
    // calculate the new row and column based on the drop position
    const newRow = GridSize - 1 - Math.floor(y / NoteSize);
    const newCol = Math.floor(x / NoteSize);

    // calculate the index for the note in the array based on its new column
    const newIndex = draggedNote.originalIndex - (draggedNote.originalIndex % GridSize) + newCol;

    // Assuming each row corresponds to a half step
    const halfStepsFromRoot = newRow;
    const rootFrequency = getFrequencyByLetter(songData.keyLetter.toUpperCase());

    const frequency = rootFrequency * Math.pow(2, halfStepsFromRoot / 12);
    const noteName = getNoteNameByFrequency(frequency);

    // construct the new note object with updated time index and pitch
    const newNote = {
      ...draggedNote,
      index: newIndex, // set the new time index
      halfStepFromRoot: halfStepsFromRoot, // set the new pitch
      frequency: frequency, // set the new frequency
      noteName: noteName // set the new note name
    };

    // If the note has been moved to a new time position, clear the old index
    if (newIndex !== draggedNote.originalIndex) {
      writeNoteAtIndex({ index: draggedNote.originalIndex, note: null });
    }

    // Write the updated note back to the song data at the new index
    writeNoteAtIndex({ index: newIndex, note: newNote });

    // Reset the dragged note state
    setDraggedNote(null);
  };

  const handleDragStart = (event, note) => {
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    startDragging(clientX, clientY, note);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault(); // Necessary to allow dropping
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    const clientX = event.clientX || (event.changedTouches && event.changedTouches[0].clientX);
    const clientY = event.clientY || (event.changedTouches && event.changedTouches[0].clientY);
    dropNote(clientX, clientY);
  };
  
  const handleDragEnd = () => {
    endDragging();
  };

  const endDragging = () => {
    setDraggedNote(null); // Reset the dragged note state
  };

const startDragging = (x, y, note) => {
  setDraggedNote({
    ...note,
    originalIndex: note?.index // Use the original note index here
  });
  // For touch events, we don't have dataTransfer, but we would set it for drag events
};

const moveGhostNote = (x, y) => {
  setGhostNotePosition({ x, y });
};

// Function to handle the start of a touch drag
const handleTouchStart = (e, note, index) => {
  e.preventDefault(); // Prevent default touch behavior like scrolling
  const touch = e.touches[0];
  
  setDraggedNote({
    ...note,
    originalIndex: note?.index, // Use the original note index here
    gridIndex: index // Save the index within the grid
  });

  setIsDragging(true);
  moveGhostNote(touch.clientX, touch.clientY);
  setIsGhostNoteVisible(true);
};

// Function to handle touch move
const handleTouchMove = (e) => {
  if (!isDragging || !draggedNote) return;
  e.preventDefault(); // Prevent default touch behavior like scrolling
  const touch = e.touches[0];
  moveGhostNote(touch.clientX, touch.clientY);
};

// Function to handle touch end
const handleTouchEnd = (e) => {
  if (!isDragging || !draggedNote) return;
  e.preventDefault();

  // Reset styles for the note that was dragged
  if (draggedNote.gridIndex != null) {
    const noteElements = document.getElementsByClassName('note');
    if (noteElements[draggedNote.gridIndex]) {
      noteElements[draggedNote.gridIndex].style.opacity = '';
    }
  }

  const touch = e.changedTouches[0];
  dropNote(touch.clientX, touch.clientY);
  setIsDragging(false);
  setIsGhostNoteVisible(false);
};

  return (
    <>
      {isGhostNoteVisible && (
        <GhostNote style={{ left: `${ghostNotePosition.x}px`, top: `${ghostNotePosition.y}px` }} />
      )}
      <NotesContainer
        ref={notesContainerRef} // Add this ref to your styled component
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
      {notesGrid.map((note, gridIndex) => {
        const hasNote = note !== null;
        const isSelected = selectedNoteIndex === (note ? note.index : null);
        return (
          <Note
            key={gridIndex}
            style={{ opacity: isDragging && draggedNote && draggedNote.gridIndex === gridIndex ? 0 : 1 }} // Set opacity based on drag state
            draggable="true"
            hasNote={hasNote}
            isSelected={isSelected}
            onClick={() => handleNoteClick(note)}
            onDragStart={(e) => handleDragStart(e, note)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, gridIndex)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, note)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        );
      })}
    </NotesContainer>
  </>
  );
};

export default MusicNotesComponent;
