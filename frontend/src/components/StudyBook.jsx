import React, { useState } from 'react';
import { soundService } from '../services/soundService';

export default function StudyBook({
  topicTitle = 'Cell Structure',
  taskDescription = '',
  evaluatorType = 'conductor',
  onSubmitExplanation,
  onBackToEvaluators,
  isSubmitting = false
}) {
  const [explanation, setExplanation] = useState('');
  const [page, setPage] = useState(1);

  // Evaluator scene backdrops
  const backdrops = {
    child: '/assets/evaluator_capybara_scene.jpg',
    conductor: '/assets/evaluator_conductor_scene.jpg',
    professor: '/assets/evaluator_professor_scene.jpg'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!explanation.trim()) {
      alert('Please write your explanation before submitting.');
      return;
    }
    soundService.playClick();
    onSubmitExplanation({
      topic: topicTitle,
      explanation: explanation.trim(),
      evaluatorType
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        overflowX: 'hidden',
        background: '#1A0E07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      {/* Authentic High-Res Evaluator Compartment Scene Background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${backdrops[evaluatorType] || backdrops.conductor})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.72) blur(1px)',
          zIndex: 1
        }}
      />

      {/* Foreground Open-Book Component (Matching Panel 6) */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '860px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Open Two-Page Physical Book Frame */}
        <div
          style={{
            width: '100%',
            background: '#3E2114',
            border: '6px solid #201007',
            borderRadius: '16px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.6)',
            padding: '16px',
            position: 'relative'
          }}
        >
          {/* Red Ribbon Bookmark */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '20px',
              height: '36px',
              background: '#C0392B',
              border: '2px solid #5C140F',
              borderTop: 'none',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)',
              zIndex: 30
            }}
          />

          {/* Parchment Pages Container */}
          <div
            style={{
              background: '#FDF8EF',
              border: '2px solid #D4BC92',
              borderRadius: '10px',
              boxShadow: 'inset 0 0 16px rgba(180, 150, 100, 0.3)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Center Fold Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '24px',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to right, rgba(0,0,0,0.08), transparent 50%, rgba(0,0,0,0.08))',
                pointerEvents: 'none',
                zIndex: 20
              }}
            />

            {/* PAGE 1: Explain What You Learned */}
            <div
              style={{
                padding: '24px',
                borderRight: '1px solid #E6D7BD',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '380px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#2A1810', marginBottom: '8px' }}>
                  Explain What You Learned
                </h3>

                {/* Topic Badge */}
                <div
                  style={{
                    display: 'inline-block',
                    background: '#F3E8D0',
                    border: '1px solid #D4BC92',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#2A1810',
                    marginBottom: '12px'
                  }}
                >
                  Topic: <strong>{topicTitle}</strong>
                </div>

                {/* Textarea for explanation */}
                <textarea
                  rows={8}
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Write your explanation here..."
                  style={{
                    width: '100%',
                    background: '#FFFDF9',
                    border: '1.5px solid #D4BC92',
                    borderRadius: '8px',
                    padding: '12px',
                    fontFamily: "'Patrick Hand', cursive",
                    fontSize: '18px',
                    lineHeight: '26px',
                    color: '#2A1810',
                    resize: 'none',
                    outline: 'none',
                    minHeight: '190px'
                  }}
                />
              </div>

              {/* Bottom Pagination & Sample loader */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '13px', color: '#73452A', fontWeight: '600' }}>
                  &lt; 1 / 2 &gt;
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!explanation) {
                      setExplanation(
                        'Cells are the basic unit of life. Plant cells have rigid cell walls and chloroplasts for photosynthesis, while animal cells have flexible cell membranes.'
                      );
                    }
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: '#73452A',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Load sample
                </button>
              </div>
            </div>

            {/* PAGE 2: Your Notes */}
            <div
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '380px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#2A1810', marginBottom: '14px' }}>
                  Your Notes
                </h3>

                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: '#4A2816' }}>
                  <li><strong>Main concepts:</strong> Structure, organelles, membranes</li>
                  <li><strong>Diagrams:</strong> Chloroplasts and mitochondria</li>
                  <li><strong>Key points:</strong> Energy flow and cellular function</li>
                </ul>

                {taskDescription && (
                  <div
                    style={{
                      marginTop: '16px',
                      background: '#F9F4E8',
                      border: '1px dashed #D4BC92',
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '13px',
                      color: '#73452A'
                    }}
                  >
                    <strong>Prompt hint:</strong> {taskDescription}
                  </div>
                )}
              </div>

              {/* Back button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  onClick={() => { soundService.playClick(); onBackToEvaluators(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    color: '#73452A',
                    cursor: 'pointer'
                  }}
                >
                  ← Choose another evaluator
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Green Pill Button: Submit Journal (Matching Panel 6) */}
        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !explanation.trim()}
            className="btn-green-pill"
            style={{
              padding: '12px 40px',
              fontSize: '18px'
            }}
          >
            {isSubmitting ? 'Evaluating...' : 'Submit Journal'}
          </button>
        </div>
      </div>
    </div>
  );
}
