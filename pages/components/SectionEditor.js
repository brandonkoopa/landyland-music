import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SectionContainer = styled.span`
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid #fff;
  border-radius: 4px;
  position: relative;
  display: inline-block;
  width: 256px;
  height: 240px;
  max-width: 256px;
  overflow: hidden;
`;

const NoteSquare = styled.div`
  border: 1px solid #000;
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => (props.isPlaying ? '#FF0000' : props.selected ? '#FEF400' : '#fff')};
  left: ${props => props.left}px;
  bottom: ${props => props.bottom}px;
  opacity: ${props => (props.isEmpty ? 0 : 1)};
  transform: translateY(12px);
  cursor: ${props => (props.selected ? 'pointer' : 'default')};
`;

const SectionEditor = ({ section, time, selectedNoteIndex, setSelectedNoteIndex }) => {
  const handleNoteClick = (index) => {
    if (selectedNoteIndex === index) {
      // setSelectedNoteIndex(null);
      // // Delete the note if it's already selected
      // section.notes[index] = {
      //   noteName: null,
      //   time: null,
      //   frequency: null,
      // };
    } else {
      setSelectedNoteIndex(index);
    }
  };

  const handleContainerClick = (e) => {
    if (selectedNoteIndex !== null) {
      // Check if the click is on an empty spot
      const { offsetX, offsetY } = e.nativeEvent;
      const noteIndex = Math.floor((offsetX / 256) * section?.notes.length);
      if (section.notes[noteIndex].noteName === null) {
        // Write a new note
        section.notes[noteIndex] = {
          noteName: 'C', // Default note name
          time: 100, // Default time
          frequency: 261.63, // Default frequency
        };
      }
    }
  };

  const handleNoteDrag = (index, e) => {
    console.log('handleNoteDrag')
    if (selectedNoteIndex === index) {
      console.log('selectedNoteIndex === index')
      const { movementX, movementY } = e.nativeEvent;

      // Change note's noteLetter and frequency values with snapping
      const note = section.notes[index];
      const noteIndex = note.noteName ? note.noteName.charCodeAt(0) - 65 : 0; // Get note index A=0, B=1, ...
      const minNoteIndex = 0;
      const maxNoteIndex = 6; // Adjust according to the available note range
      const noteIndexRange = maxNoteIndex - minNoteIndex;
      const minFrequency = 261.63; // Adjust according to the lowest frequency
      const maxFrequency = 440; // Adjust according to the highest frequency
      const frequencyRange = maxFrequency - minFrequency;
      const snappedMovementX = Math.round(movementX / 256) * 256; // Snap to 256px intervals
      const snappedMovementY = Math.round(movementY / 240) * 240; // Snap to 240px intervals

      // Update note properties based on movement
      note.noteName = String.fromCharCode((noteIndex + snappedMovementY / 240 + 65) % 7);
      note.frequency = Math.max(minFrequency, Math.min(maxFrequency, note.frequency + snappedMovementX / 256 * frequencyRange));
    }
  };

  useEffect(() => {
    // Check if the current note is being played
    if (time >= section?.startTime && time <= section?.endTime) {
      const noteIndex = Math.floor(((time - section?.startTime) / (section?.endTime - section?.startTime)) * section?.notes.length);
      setSelectedNoteIndex(noteIndex);
    } else {
      setSelectedNoteIndex(null);
    }
  }, [time, section]);

  return (
    <SectionContainer onClick={handleContainerClick}>
      {section?.notes?.map((note, index) => {
        const left = (index / section.notes.length) * 256;
        let bottom = 0;
        let size = Math.min(32, 256 / section.notes.length);

        if (note.frequency !== null) {
          const minFrequency = Math.min(...section.notes.map(note => note.frequency));
          const maxFrequency = Math.max(...section.notes.map(note => note.frequency));
          const frequencyRange = maxFrequency - minFrequency;
          bottom = ((note.frequency - minFrequency) / frequencyRange) * 240;
        } else {
          bottom = 0;
        }

        return (
          <NoteSquare draggable
            key={index}
            size={size}
            left={left}
            bottom={bottom}
            isEmpty={!note.noteName}
            selected={index === selectedNoteIndex}
            isPlaying={index === selectedNoteIndex && time >= section.startTime && time <= section.endTime}
            onMouseDown={(e) => handleNoteClick(index, e)}
            // onMouseMove={(e) => handleNoteDrag(index, e)}
            // onMouseUp={() => setSelectedNoteIndex(null)}
          />
        );
      })}
    </SectionContainer>
  );
};

export default SectionEditor;
