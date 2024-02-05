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

export function getNoteName(note) {
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const octave = Math.floor(note / 12) - 1;
  const noteName = note % 12;
  /* return noteNames[noteName] + octave; */
  return noteNames[noteName];
};

export function getFrequency(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
};

export const keyToNote = {
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

export var keyMap = {
  'a': 261.63, // c
  'w': 277.18, // c-sharp
  's': 293.66, // d
  'e': 311.13, // d-sharp
  'd': 329.63, // e
  'f': 349.23, // f
  't': 369.99, // f-sharp
  'g': 392.00, // g
  'y': 415.30, // g-sharp
  'h': 440.00, // a
  'u': 466.16, // a-sharp
  'j': 493.88, // b
  'k': 523.25, // high-c
  'o': 554.37, // high-c-sharp
  'l': 587.33, // high-d
  'p': 622.25, // high-d-sharp
  ';': 659.25, // high-e
  '\'': 523.25, // high-c
  '[': 554.37, // high-c-sharp
  ']': 493.88 // b
  };

export function getNoteNameByStep(step, keyNote) {
  const keyNoteIndex = Object.values(keyToNote).indexOf(keyNote);
  const noteNames = Object.keys(keyToNote);

  // Calculate the index of the target note in the noteNames array
  let targetNoteIndex = keyNoteIndex;
  for (let i = 0; i < step.length; i++) {
    if (step[i] === 'I') {
      targetNoteIndex += 0;
    } else if (step[i] === 'V') {
      targetNoteIndex += 7;
    } else if (step[i] === 'IV') {
      targetNoteIndex += 5;
    } else if (step[i] === 'II') {
      targetNoteIndex += 2;
    } else if (step[i] === 'III') {
      targetNoteIndex += 4;
    } else if (step[i] === 'VI') {
      targetNoteIndex += 9;
    } else if (step[i] === 'VII') {
      targetNoteIndex += 11;
    }
  }

  // Wrap the target note index within the range of the noteNames array
  targetNoteIndex %= noteNames.length;
  if (targetNoteIndex < 0) {
    targetNoteIndex += noteNames.length;
  }

  // Return the note name corresponding to the target note index
  return keyToNote[noteNames[targetNoteIndex]];
};
