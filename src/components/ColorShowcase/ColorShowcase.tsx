// src/ColorShowcase.tsx
const ColorBox = ({ name, varName }: { name: string; varName: string }) => (
    <div style={{
      backgroundColor: `var(${varName})`,
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      color: 'white',
      fontFamily: 'var(--font-secondary)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span>{name}</span>
      <code style={{ fontSize: '0.85rem', opacity: 0.9 }}>{varName}</code>
    </div>
  );
  
  const ColorShowcase = () => (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', marginBottom: '1rem' }}>🎨 Color Variables</h2>
  
      {/* Primary Colors */}
      <ColorBox name="Primary" varName="--color-primary" />
      <ColorBox name="Primary Dark" varName="--color-primary-dark" />
      <ColorBox name="Primary Light" varName="--color-primary-light" />
  
      {/* Secondary Colors */}
      <ColorBox name="Secondary" varName="--color-secondary" />
      <ColorBox name="Secondary Dark" varName="--color-secondary-dark" />
      <ColorBox name="Secondary Light" varName="--color-secondary-light" />
  
      {/* Neutral Colors */}
      <ColorBox name="Neutral 900" varName="--color-neutral-900" />
      <ColorBox name="Neutral 700" varName="--color-neutral-700" />
      <ColorBox name="Neutral 500" varName="--color-neutral-500" />
      <ColorBox name="Neutral 300" varName="--color-neutral-300" />
      <ColorBox name="Neutral 100" varName="--color-neutral-100" />
  
      {/* System & Accents */}
      <ColorBox name="Success" varName="--color-success" />
      <ColorBox name="Warning" varName="--color-warning" />
      <ColorBox name="Danger" varName="--color-danger" />
      <ColorBox name="Info" varName="--color-info" />
      <ColorBox name="Carbon" varName="--color-carbon" />
    </div>
  );
  
  export default ColorShowcase;
  