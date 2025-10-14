/**
 * LoadingState Component
 *
 * Renders the loading state while configuration is being fetched.
 * Extracted from App.jsx to improve component organization.
 */
function LoadingState() {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading configuration...</p>
      </div>
    </div>
  );
}

export default LoadingState;
