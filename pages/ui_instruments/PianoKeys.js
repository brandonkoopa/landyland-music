import React from 'react';

const PianoKeys = ({playNote}) => {
  return (
    <div className="piano-keys">
      <button id="c" className="piano-key white" onTouchStart={(e) => { playNote(261.63) }}>
        <span>C</span>
      </button>
      <button id="c-sharp" className="piano-key black" onTouchStart={(e) => { playNote(277.18) }}>
        <span>C#</span>
      </button>
      <button id="d" className="piano-key white" onTouchStart={(e) => { playNote(293.66) }}>
        <span>D</span>
      </button>
      <button id="d-sharp" className="piano-key black" onTouchStart={(e) => { playNote(311.13) }}>
        <span>D#</span>
      </button>
      <button id="e" className="piano-key white" onTouchStart={(e) => { playNote(329.63) }}>
        <span>E</span>
      </button>
      <button id="f" className="piano-key white" onTouchStart={(e) => { playNote(349.23) }}>
        <span>F</span>
      </button>
      <button id="f-sharp" className="piano-key black" onTouchStart={(e) => { playNote(369.99) }}>
        <span>F#</span>
      </button>
      <button id="g" className="piano-key white" onTouchStart={(e) => { playNote(392.00) }}>
        <span>G</span>
      </button>
      <button id="g-sharp" className="piano-key black" onTouchStart={(e) => { playNote(415.30) }}>
        <span>G#</span>
      </button>
      <button id="a" className="piano-key white" onTouchStart={(e) => { playNote(440.00) }}>
        <span>A</span>
      </button>
      <button id="a-sharp" className="piano-key black" onTouchStart={(e) => { playNote(466.16) }}>
        <span>A#</span>
      </button>
      <button id="b" className="piano-key white" onTouchStart={(e) => { playNote(493.88) }}>
        <span>B</span>
      </button>
      <button id="high-c" className="piano-key white" onTouchStart={(e) => { playNote(523.25) }}>
        <span>C</span>
      </button>
      <button id="high-c-sharp" className="piano-key black" onTouchStart={(e) => { playNote(554.37) }}>
        <span>C#</span>
      </button>
      <button id="high-d" className="piano-key white" onTouchStart={(e) => { (587.33) }}>
        <span>D</span>
      </button>
      <button id="high-d-sharp" className="piano-key black" onTouchStart={(e) => { playNote(622.25) }}>
        <span>D#</span>
      </button>
      <button id="high-e" className="piano-key white" onTouchStart={(e) => { playNote(659.25) }}>
        <span>E</span>
      </button>
      <button id="high-f" className="piano-key white" onTouchStart={(e) => { playNote(698.46) }}>
        <span>F</span>
      </button>
      <button id="high-f-sharp" className="piano-key black" onTouchStart={(e) => { playNote(739.99) }}>
        <span>F#</span>
      </button>
      <button id="high-g" className="piano-key white" onTouchStart={(e) => { playNote(783.99) }}>
        <span>G</span>
      </button>
      <button id="high-g-sharp" className="piano-key black" onTouchStart={(e) => { playNote(830.61) }}>
        <span>G#</span>
      </button>
      <button id="high-a" className="piano-key white" onTouchStart={(e) => { playNote(880.00) }}>
        <span>A</span>
      </button>
      <button id="middle-a-sharp" className="piano-key black" onTouchStart={(e) => { playNote(466.16) }}>
              <span>A#</span>
              </button>
              <button id="middle-b" className="piano-key white" onTouchStart={(e) => { playNote(493.88) }}>
              <span>B</span>
              </button>
              <button id="high-c" className="piano-key white" onTouchStart={(e) => { playNote(523.25) }}>
              <span>C</span>
              </button>
          <div>
              <h5>Press the keys on your keyboard or click the buttons to play notes</h5>
          </div>
    </div>
  )
}

export default PianoKeys;