export function getNoteNameByFrequency(frequency) {
  const noteFrequencies = {
    'c': 261.63,
    'c-sharp': 277.18,
    'd': 293.66,
    'd-sharp': 311.13,
    'e': 329.63,
    'f': 349.23,
    'f-sharp': 369.99,
    'g': 392.00,
    'g-sharp': 415.30,
    'a': 440.00,
    'a-sharp': 466.16,
    'b': 493.88,
    'high-c': 523.25,
    'high-c-sharp': 554.37,
    'high-d': 587.33,
    'high-d-sharp': 622.25,
    'high-e': 659.25,
    'high-f': 698.46,
    'high-f-sharp': 739.99,
    'high-g': 783.99,
    'high-g-sharp': 830.61,
    'high-a': 880.00
  };

  const noteFrequenciesArray = Object.entries(noteFrequencies);
  const closestNote = noteFrequenciesArray.reduce((prev, curr) => {
    return (Math.abs(curr[1] - frequency) < Math.abs(prev[1] - frequency) ? curr : prev);
  });
  return closestNote[0];
}

export const getFrequencyByLetter = (note) => {
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

export function getHalfStepsFromRoot(noteFrequency, rootFrequency) {
  const semitoneRatio = Math.pow(2, 1/12);
  // Calculate the number of half steps between the root frequency and the note frequency
  const halfStepsFromRoot = Math.round(Math.log(noteFrequency / rootFrequency) / Math.log(semitoneRatio));
  return halfStepsFromRoot;
}

