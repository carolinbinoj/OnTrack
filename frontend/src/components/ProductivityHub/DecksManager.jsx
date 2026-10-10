import React, { useState } from 'react';
import { soundService } from '../../services/soundService';

export default function DecksManager() {
  const [decks, setDecks] = useState(() => {
    try {
      const raw = localStorage.getItem('ontrack_decks');
      return raw ? JSON.parse(raw) : [
        {
          id: 'd1',
          title: 'Plant Biology & Photosynthesis',
          cards: [
            { q: 'Where do light-dependent reactions take place?', a: 'Inside the thylakoid membranes of chloroplasts.' },
            { q: 'What is the primary role of chlorophyll pigment?', a: 'Absorbs light energy (mostly blue and red wavelengths) to excite electrons.' },
            { q: 'What are the main outputs of the Calvin cycle?', a: 'G3P sugar molecules (used to form glucose).' }
          ]
        },
        {
          id: 'd2',
          title: 'Swiss Alpine Geography',
          cards: [
            { q: 'What is the highest peak in the Swiss Alps?', a: 'Dufourspitze (Monte Rosa massif) at 4,634 meters.' },
            { q: 'What mountain is iconic to Zermatt?', a: 'The pyramid-shaped Matterhorn (4,478m).' }
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeDeckId, setActiveDeckId] = useState('d1');
  const [studyCardIdx, setStudyCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newCardQ, setNewCardQ] = useState('');
  const [newCardA, setNewCardA] = useState('');

  const saveDecks = (newD) => {
    setDecks(newD);
    localStorage.setItem('ontrack_decks', JSON.stringify(newD));
  };

  const handleCreateDeck = (e) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;
    soundService.playClick();
    const created = {
      id: `d_${Date.now()}`,
      title: newDeckTitle.trim(),
      cards: []
    };
    saveDecks([...decks, created]);
    setActiveDeckId(created.id);
    setNewDeckTitle('');
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardQ.trim() || !newCardA.trim()) return;
    soundService.playClick();
    const updated = decks.map(d => {
      if (d.id === activeDeckId) {
        return {
          ...d,
          cards: [...d.cards, { q: newCardQ.trim(), a: newCardA.trim() }]
        };
      }
      return d;
    });
    saveDecks(updated);
    setNewCardQ('');
    setNewCardA('');
  };

  const currentDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const activeCard = currentDeck?.cards?.[studyCardIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '22px', color: '#2B170C' }}>
          Study Decks & Flashcards
        </h2>
      </div>

      {/* Decks Selector Strip & New Deck Form */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        {decks.map(d => (
          <button
            key={d.id}
            onClick={() => {
              soundService.playClick();
              setActiveDeckId(d.id);
              setStudyCardIdx(0);
              setIsFlipped(false);
            }}
            style={{
              background: d.id === activeDeckId ? '#E67E22' : '#FCF8EE',
              color: d.id === activeDeckId ? '#FFF' : '#2B170C',
              border: '2px solid #2B170C',
              borderRadius: '8px',
              padding: '6px 14px',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            📁 {d.title} ({d.cards.length})
          </button>
        ))}

        <form onSubmit={handleCreateDeck} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            placeholder="+ New deck name..."
            value={newDeckTitle}
            onChange={e => setNewDeckTitle(e.target.value)}
            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D4BC92', fontSize: '13px' }}
          />
          <button type="submit" className="pixel-btn pixel-btn-amber" style={{ padding: '6px 10px', fontSize: '12px' }}>
            Create
          </button>
        </form>
      </div>

      {/* Interactive Flip Card Study Area */}
      {currentDeck && currentDeck.cards.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div
            onClick={() => {
              soundService.playClick();
              setIsFlipped(!isFlipped);
            }}
            style={{
              width: '100%',
              maxWidth: '540px',
              minHeight: '220px',
              background: isFlipped ? '#FDF6E2' : '#FFF',
              border: '3px solid #2B170C',
              borderRadius: '16px',
              boxShadow: '0 6px 0 #2B170C',
              padding: '28px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: 'center',
              userSelect: 'none',
              transition: 'transform 0.2s ease'
            }}
            className="hover:scale-102"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#73452A', fontFamily: "'Pixelify Sans', monospace" }}>
              <span>{isFlipped ? '💡 ANSWER' : '❓ QUESTION'}</span>
              <span>Card {studyCardIdx + 1} of {currentDeck.cards.length}</span>
            </div>

            <div style={{ fontSize: '20px', fontWeight: '600', color: '#2B170C', fontFamily: isFlipped ? "'Patrick Hand', cursive" : "'Outfit', sans-serif", margin: '20px 0' }}>
              {isFlipped ? activeCard.a : activeCard.q}
            </div>

            <div style={{ fontSize: '13px', color: '#999', fontFamily: "'Patrick Hand', cursive" }}>
              (Click anywhere on card to flip)
            </div>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button
              disabled={studyCardIdx === 0}
              onClick={() => {
                soundService.playClick();
                setStudyCardIdx(studyCardIdx - 1);
                setIsFlipped(false);
              }}
              className="pixel-btn pixel-btn-parchment"
              style={{ padding: '6px 16px', fontSize: '14px' }}
            >
              ← Prev
            </button>
            <button
              disabled={studyCardIdx === currentDeck.cards.length - 1}
              onClick={() => {
                soundService.playClick();
                setStudyCardIdx(studyCardIdx + 1);
                setIsFlipped(false);
              }}
              className="pixel-btn pixel-btn-amber"
              style={{ padding: '6px 16px', fontSize: '14px' }}
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '30px', background: '#FCF8EE', border: '2px dashed #D4BC92', borderRadius: '12px', fontFamily: "'Patrick Hand', cursive", fontSize: '18px' }}>
          This deck is empty! Add study flashcards below.
        </div>
      )}

      {/* Add Flashcard Form */}
      {currentDeck && (
        <form
          onSubmit={handleAddCard}
          style={{
            background: '#FCF8EE',
            border: '2px solid #E6A36E',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ fontWeight: '600', fontSize: '14px', color: '#2B170C' }}>
            + Add Card to "{currentDeck.title}"
          </div>
          <input
            type="text"
            placeholder="Front Question / Concept prompt..."
            value={newCardQ}
            onChange={e => setNewCardQ(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D4BC92', fontSize: '14px' }}
          />
          <input
            type="text"
            placeholder="Back Answer / Explanation..."
            value={newCardA}
            onChange={e => setNewCardA(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D4BC92', fontSize: '14px' }}
          />
          <button type="submit" className="pixel-btn pixel-btn-primary" style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: '13px' }}>
            Save Card
          </button>
        </form>
      )}
    </div>
  );
}
