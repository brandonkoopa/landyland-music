import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import WebMidi from 'webmidi';

const GridWrap = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: repeat(4, 64px);
  gap: 10px;
  margin: 16px auto;
  background-color: transparent;
  border: 0;
  inset 0.2em 0.2em 0.2em 0 rgba(0,0,0,0.25), inset -0.2em -0.2em 0.2em 0 rgba(255,255,255,0.25)
`;

const Cell = styled.button`
  box-shadow: inset 0.2em 0.2em 0.2em 0 rgba(255,255,255,0.5), inset -0.2em -0.2em 0.2em 0 rgba(0,0,0,0.5);
  width: 64px;
  height: 64px;
  text-transform: uppercase;
  /* border: 4px solid ${({ selected }) => (selected ? '#FEF400' : '#000')}; */
  border: 4px solid ${({ selected }) => (selected ? '#FEF400' : '#000')};
  border-radius: 10px;
  font-weight: 800;
  /* background-color: ${({ selected }) => (selected ? '#FEF400' : '#fff')}; */
  background-color: #fff;
  color: ${({ selected }) => (selected ? '#000' : 'transparent')};
  ${({ filled }) =>
    filled &&
    `
    background-color: #35CCFD;
  `}
`;

const ProgramGrid = ({ song, setSong={}, selectedTrackIndex, selectedNoteIndex, setSelectedNoteIndex }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [history, setHistory] = useState([song]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedTrack = song?.tracks ? song?.tracks[selectedTrackIndex] : {}
  // const songNotes = song?.tracks ? song?.tracks[selectedTrackIndex].notes : []

  useEffect(() => {
    setSelectedCell(selectedNoteIndex);
  }, [selectedNoteIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyToNote = {
        a: 'C',
        w: 'C#',
        s: 'D',
        e: 'D#',
        d: 'E',
        f: 'F',
        t: 'F#',
        g: 'G',
        y: 'G#',
        h: 'A',
        u: 'A#',
        j: 'B',
        k: 'C+',
        o: 'C#+',
        l: 'D+',
        p: 'D#+',
        ';': 'B+',
        "'": 'C++',
      };
      const note = keyToNote[event.key];
      writeNote(note)
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, song, setSong, history, historyIndex]);

  const writeNote = (note) => {
    if (note && selectedCell !== null) {
      const trackIndex = Math.floor(selectedCell / song?.tracks[0].notes.length);
      const noteIndex = selectedCell % song?.tracks[0].notes.length;
      const track = song?.tracks[trackIndex];
      const notes = [...track.notes];
      const noteObj = notes[noteIndex] || { time: 0, frequency: 0, noteName: '' };
      noteObj.time = 100;
      noteObj.frequency = getFrequency(note);
      noteObj.noteName = note;
      notes[noteIndex] = noteObj;
      const updatedTracks = [
        ...song?.tracks.slice(0, trackIndex),
        { ...track, notes },
        ...song?.tracks.slice(trackIndex + 1),
      ];
      const newSong = { ...song, tracks: updatedTracks };
      setSong(newSong);
      setHistory([...history.slice(0, historyIndex + 1), newSong]);
      setHistoryIndex(historyIndex + 1);
    }
  }

  // useEffect(() => {
  //   if (typeof WebMidi !== 'undefined') {
  //     WebMidi.enable((err) => {
  //       if (err) {
  //         console.log('WebMidi could not be enabled.', err);
  //       } else {
  //         console.log('WebMidi enabled!');
  //         const input = WebMidi.getInputByName('Your MIDI Device Name');
  //         if (input) {
  //           input.addListener('noteon', 'all', (event) => {
  //             const note = event.note.name + event.note.octave;
  //             const trackIndex = Math.floor(selectedCell / song?.tracks[0].notes.length);
  //             const noteIndex = selectedCell % song?.tracks[0].notes.length;
  //             const track = song?.tracks[trackIndex];
  //             const notes = [...track.notes];
  //             const noteObj = notes[noteIndex] || { time: 0, frequency: 0, noteName: '' };
  //             noteObj.time = 100;
  //             noteObj.frequency = event.note.frequency;
  //             noteObj.noteName = note;
  //             notes[noteIndex] = noteObj;
  //             const updatedTracks = [
  //               ...song?.tracks.slice(0, trackIndex),
  //               { ...track, notes },
  //               ...song?.tracks.slice(trackIndex + 1),
  //             ];
  //             const newSong = { ...song, tracks: updatedTracks };
  //             setSong(newSong);
  //             setHistory([...history.slice(0, historyIndex + 1), newSong]);
  //             setHistoryIndex(historyIndex + 1);
  //           });
  //         }
  //       }
  //     });
  //   }
  // }, [selectedCell, song, setSong, history, historyIndex]);

  const handleCellClick = (index) => {
    if (selectedCell === index) {
      const trackIndex = Math.floor(selectedCell / song?.tracks[0].notes.length);
      const noteIndex = selectedCell % song?.tracks[0].notes.length;
      const track = song?.tracks[trackIndex];
      const notes = [...track.notes];
      const noteObj = notes[noteIndex] || { time: 0, frequency: 0, noteName: '' };
      noteObj.time = 0;
      noteObj.frequency = 0;
      noteObj.noteName = '';
      notes[noteIndex] = noteObj;
      const updatedTracks = [
      ...song?.tracks.slice(0, trackIndex),
      { ...track, notes },
      ...song?.tracks.slice(trackIndex + 1),
      ];
      const newSong = { ...song, tracks: updatedTracks };
      setSong(newSong);
      setHistory([...history.slice(0, historyIndex + 1), newSong]);
      setHistoryIndex(historyIndex + 1);
      setSelectedCell(null);
      console.log('set setSelectedNoteIndex to null')
      setSelectedNoteIndex(null);
    } else {
      setSelectedCell(index);
      console.log('set setSelectedNoteIndex to ', index)
      setSelectedNoteIndex(index);
    }
  };
      
  const getFrequency = (note) => {
      const notes = {
      C: 261.63,
      'C#': 277.18,
      D: 293.66,
      'D#': 311.13,
      E: 329.63,
      F: 349.23,
      'F#': 369.99,
      G: 392.00,
      'G#': 415.30,
      A: 440.00,
      'A#': 466.16,
      B: 493.88,
      'C+': 523.25,
      'C#+': 554.37,
      'D+': 587.33,
      'D#+': 622.25,
      'E+': 659.25,
      'F+': 698.46,
      'F#+': 739.99,
      'G+': 783.99,
      'G#+': 830.61,
      'A+': 880.00,
      'A#+': 932.33,
      'B+': 987.77,
      'C++': 1046.50,
      };
      return notes[note];
      };
      
      return (
        <div>
          <GridWrap id="grid">
            { song?.tracks[selectedTrackIndex].notes.map((note, noteIndex) => {
              const index = selectedTrackIndex * selectedTrack.notes.length + noteIndex;
              const filled = note && note.time === 100;
              const isSelected = selectedCell === index;
              const noteName = note ? note.noteName : '';
              return (
                <Cell
                  key={index}
                  selected={isSelected}
                  filled={filled}
                  onClick={() => handleCellClick(index)}
                >
                  {noteName}
                </Cell>
              );
            })}
          </GridWrap>
          <div>
          <h5>Select note in grid then press a key to write that note. Select again to erase.</h5>
        </div>
        </div>
      );
      };

      export default ProgramGrid;