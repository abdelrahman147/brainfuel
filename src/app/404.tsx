export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.25rem', color: '#888' }}>Sorry, the page you are looking for does not exist.</p>
    </div>
  );
} 