export default function Error500() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>500 - Server Error</h1>
      <p style={{ fontSize: '1.25rem', color: '#888' }}>Sorry, something went wrong on our end.</p>
    </div>
  );
} 