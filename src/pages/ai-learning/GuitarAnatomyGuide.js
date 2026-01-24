import React from 'react';
import './AILearning.css';

// High-quality open source guitar images with proper attribution
const guitarImages = {
  acoustic: {
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Acoustic_guitar_scale.svg",
    attribution: "Wikimedia Commons - Creative Commons CC BY-SA 3.0",
    author: "User:Pbroks13"
  },
  electric: {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/59/Electric_Guitar_Drawing_3.svg",
    attribution: "Wikimedia Commons - Public Domain",
    author: "Metayer"
  },
  headstock: {
    url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Fender_Strat_headstock_angles.jpg",
    attribution: "Wikimedia Commons - Public Domain",
    author: "Petr.adamek"
  },
  bridge: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8b/Bridge_acoustic.jpg",
    attribution: "Wikimedia Commons - CC BY-SA 3.0",
    author: "Tomasz Nowak"
  },
  fretboard: {
    url: "https://upload.wikimedia.org/wikipedia/commons/e/e8/12_fret_fingerboard.svg",
    attribution: "Wikimedia Commons - CC0 (Public Domain)",
    author: "Umezo KAMATA"
  },
  anatomy: {
    url: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Acoustic_Guitar_Parts.jpg",
    attribution: "Wikimedia Commons - CC BY-SA 4.0",
    author: "Benutzer:Till.niermann"
  }
};

const GuitarAnatomyGuide = () => {
  return (
    <div className="guitar-anatomy-guide">
      <h1>Guitar Anatomy: A Visual Guide</h1>
      
      <div className="main-guitar-image">
        <img 
          src={guitarImages.anatomy.url} 
          alt="Acoustic Guitar Anatomy" 
          className="guitar-full-image"
        />
        <div className="image-overlay-text">Full Acoustic Guitar Anatomy</div>
        <div className="image-attribution">
          Image Source: {guitarImages.anatomy.attribution} by {guitarImages.anatomy.author}
        </div>
      </div>
      
      <h2>Key Components & Their Functions</h2>
      
      <div className="guitar-components-grid">
        <div className="component-card">
          <img src={guitarImages.headstock.url} alt="Guitar Headstock" />
          <h3>Headstock & Tuning Pegs</h3>
          <p>The headstock holds the tuning pegs (or machines) which are used to adjust string tension, changing the pitch of each string.</p>
          <div className="image-attribution">
            Source: {guitarImages.headstock.attribution} by {guitarImages.headstock.author}
          </div>
        </div>
        
        <div className="component-card">
          <img src={guitarImages.fretboard.url} alt="Guitar Fretboard" />
          <h3>Neck & Fretboard</h3>
          <p>The neck connects the headstock to the body. The fretboard contains metal strips (frets) that divide it into specific notes. Pressing a string behind a fret shortens the vibrating length, changing the pitch.</p>
          <div className="image-attribution">
            Source: {guitarImages.fretboard.attribution} by {guitarImages.fretboard.author}
          </div>
        </div>
        
        <div className="component-card">
          <img src={guitarImages.bridge.url} alt="Guitar Bridge" />
          <h3>Bridge & Saddle</h3>
          <p>The bridge attaches strings to the body and transmits vibrations to the soundboard. The saddle supports the strings and helps transmit vibrations.</p>
          <div className="image-attribution">
            Source: {guitarImages.bridge.attribution} by {guitarImages.bridge.author}
          </div>
        </div>
      </div>
      
      <h2>How a Guitar Makes Sound</h2>
      
      <div className="sound-production-steps">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>String Vibration</h3>
          <p>You pluck or strum the strings, causing them to vibrate.</p>
        </div>
        
        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Bridge Transfer</h3>
          <p>The vibrations travel through the bridge to the guitar's body (soundboard).</p>
        </div>
        
        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Body Resonance</h3>
          <p>The body amplifies the sound by resonating with the vibrations.</p>
        </div>
        
        <div className="step-card">
          <div className="step-number">4</div>
          <h3>Sound Projection</h3>
          <p>The amplified sound projects out of the soundhole (for acoustic guitars).</p>
        </div>
      </div>
      
      <h2>Acoustic vs. Electric: A Quick Comparison</h2>
      
      <div className="guitar-comparison">
        <div className="guitar-type">
          <img src={guitarImages.acoustic.url} alt="Acoustic Guitar" />
          <h3>Acoustic Guitar</h3>
          <p>Creates sound naturally through the vibration of strings and the resonance of the body.</p>
          <div className="image-attribution">
            Source: {guitarImages.acoustic.attribution} by {guitarImages.acoustic.author}
          </div>
        </div>
        
        <div className="guitar-type">
          <img src={guitarImages.electric.url} alt="Electric Guitar" />
          <h3>Electric Guitar</h3>
          <p>Uses pickups to convert string vibrations into an electrical signal, which is amplified. Requires an amplifier.</p>
          <div className="image-attribution">
            Source: {guitarImages.electric.attribution} by {guitarImages.electric.author}
          </div>
        </div>
      </div>
      
      <h2>Basic Guitar Tablature (TAB)</h2>
      
      <div className="guitar-tab-section">
        <p>Tablature is a visual way to represent guitar music. Each line represents a string, and the numbers indicate which fret to press.</p>
        
        <div className="tab-example">
          <pre className="tab-notation">
{`e |-----------------------------------|
B |-----------------------------------|
G |-----------------------------------|
D |-----------------------------------|
A |-----------------------------------|
E |-----------------------------------|`}
          </pre>
          <p className="tab-explanation">Each line represents a string. The top line is the thinnest string (high E) and the bottom is the thickest (low E).</p>
        </div>
        
        <div className="tab-example">
          <pre className="tab-notation">
{`e |---0---0---0---0-------------------|
B |---1---1---1---1-------------------|
G |---2---2---2---2-------------------|
D |-----------------------------------|
A |-----------------------------------|
E |-----------------------------------|`}
          </pre>
          <p className="tab-explanation">
            Play the open E string (thinnest) four times<br />
            Play the 1st fret on the B string four times<br />
            Play the 2nd fret on the G string four times
          </p>
        </div>
      </div>
      
      <div className="open-source-notice">
        <h3>Image Sources</h3>
        <p>All images used in this guide are freely available under open source licenses from Wikimedia Commons. Each image includes proper attribution to the original creator as required by their respective licenses.</p>
      </div>
      
      <div className="learning-tip">
        <h3>Learning Tip</h3>
        <p>Understanding the relationship between the physical components and how they contribute to the sound is crucial for learning to play the guitar effectively!</p>
      </div>
    </div>
  );
};

export default GuitarAnatomyGuide; 