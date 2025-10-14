/**
 * ErrorState Component
 *
 * Renders the error state when configuration fails to load.
 * Extracted from App.jsx to improve component organization.
 */
function ErrorState() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-red-600 text-xl mb-4'>⚠️ Configuration Error</div>
        <p className='text-gray-600 mb-4'>Failed to load application configuration.</p>
        <button
          onClick={() => window.location.reload()}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorState;
