// pages/pocket-operator.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import * as Tone from 'tone';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr); // 4 columns grid
  gap: 10px; // Space between buttons
  padding: 20px; // Padding around the grid
  justify-content: center; // Center the grid
  align-items: center; // Align items in the grid
`;

const Button = styled.button`
  width: 60px; // Button width
  height: 60px; // Button height
  border-radius: 50%; // Circular buttons
  background-color: #f0f0f0; // Light grey background
  border: 2px solid #333; // Dark border for contrast
  font-size: 1rem; // Font size
  color: #333; // Button text color
  cursor: pointer; // Pointer cursor on hover
  &:hover {
    background-color: #e0e0e0; // Slightly darker on hover
  }
  &:active {
    background-color: #ccc; // Even darker when active
  }
`;


const PocketOperator = () => {
  const [synth, setSynth] = useState(null);
  const [sequence, setSequence] = useState(null);
  const [isAudioContextStarted, setIsAudioContextStarted] = useState(false);

  useEffect(() => {
    setSynth(new Tone.Synth().toDestination());
  }, []);

  useEffect(() => {
    // Dynamically import Tone.js to ensure it's only used client-side
    import('tone').then((Tone) => {
      const newSynth = new Tone.PolySynth(Tone.Synth).toDestination();
      setSynth(newSynth);

      const newSequence = new Tone.Sequence((time, index) => {
        // Sequence logic (currently does nothing)
      }, [...Array(16).keys()], "8n");

      setSequence(newSequence);
    });
  }, []);

  const playSound = (note) => {
    if (synth) {
      synth.triggerAttackRelease(note, "8n");
    }
  };

  const handleButtonClick = async (index) => {
    if (!isAudioContextStarted) {
      await Tone.start(); // Start or resume the AudioContext
      setIsAudioContextStarted(true);
    }

    // Play sound logic here
    synth.triggerAttackRelease("C4", "8n");
  };

  return (
    <div>
      <Grid>
        {[...Array(16)].map((_, index) => (
          <Button key={index} onClick={() => handleButtonClick(index)}>
            {index + 1}
          </Button>
        ))}
      </Grid>
    </div>
  );
};

export default PocketOperator;
