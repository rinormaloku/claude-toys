import React, { useState } from 'react';

// dynamically import every JSX file under the toys directory at build time
const modules = import.meta.glob('./toys/*.jsx', { eager: true });

const toys = Object.entries(modules).map(([path, mod]) => {
  const name = path.split('/').pop().replace(/\.jsx$/, '');
  return { name, Component: mod.default };
});

export default function App() {
  const [selected, setSelected] = useState(toys[0]?.name || null);
  const SelectedComp = toys.find((t) => t.name === selected)?.Component;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav
        style={{
          width: 220,
          background: '#111',
          color: '#ddd',
          padding: '16px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1.2rem' }}>Toys</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {toys.map((t) => (
            <li key={t.name}>
              <button
                onClick={() => setSelected(t.name)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 12px',
                  marginBottom: 4,
                  textAlign: 'left',
                  background: t.name === selected ? '#444' : 'transparent',
                  border: 'none',
                  color: '#ddd',
                  cursor: 'pointer',
                }}
              >
                {t.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main
        style={{
          flex: 1,
          padding: '24px',
          background: '#090919',
          color: '#e0e0f8',
          overflowY: 'auto',
        }}
      >
        {SelectedComp ? <SelectedComp /> : <div>Select a toy</div>}
      </main>
    </div>
  );
}
