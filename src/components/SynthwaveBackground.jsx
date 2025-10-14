import { useMemo } from 'react';

/**
 * SynthwaveBackground Component
 *
 * Renders the animated synthwave background with stars, mountains, and grid effects.
 * Uses useMemo to prevent infinite re-renders by generating static random values.
 */
function SynthwaveBackground() {
  // Generate static random values for background elements to prevent infinite re-renders
  const backgroundElements = useMemo(() => {
    const stars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));

    const gridLines = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: i * 8,
      delay: i * 0.1,
    }));

    const gridColumns = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: i * 8,
      delay: i * 0.2,
    }));

    return { stars, gridLines, gridColumns };
  }, []);

  return (
    <div className='fixed inset-0 z-0'>
      {/* Deep purple sky with stars */}
      <div className='absolute inset-0 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900'>
        {/* Animated stars */}
        <div className='absolute inset-0'>
          {backgroundElements.stars.map((star) => (
            <div
              key={star.id}
              className='absolute w-1 h-1 bg-white rounded-full animate-pulse'
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Glowing sun */}
      <div className='absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-yellow-400 via-orange-500 to-red-500 rounded-full blur-xl opacity-80 animate-pulse' />

      {/* Geometric mountains */}
      <div className='absolute bottom-0 left-0 right-0 h-64'>
        {/* Mountain 1 */}
        <div className='absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-purple-700 to-purple-500 transform -skew-x-12 opacity-80' />
        {/* Mountain 2 */}
        <div className='absolute bottom-0 left-32 w-48 h-36 bg-gradient-to-t from-blue-700 to-blue-500 transform -skew-x-6 opacity-70' />
        {/* Mountain 3 */}
        <div className='absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-purple-600 to-purple-400 transform skew-x-12 opacity-75' />
        {/* Mountain highlights */}
        <div className='absolute bottom-0 left-0 w-64 h-48 bg-gradient-to-t from-pink-400 to-transparent transform -skew-x-12 opacity-30' />
        <div className='absolute bottom-0 right-0 w-56 h-52 bg-gradient-to-t from-pink-400 to-transparent transform skew-x-12 opacity-30' />
      </div>

      {/* Animated electric grid plane */}
      <div className='absolute bottom-0 left-0 right-0 h-32 opacity-40'>
        <div className='relative w-full h-full'>
          {backgroundElements.gridLines.map((line) => (
            <div
              key={line.id}
              className='absolute w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent'
              style={{
                top: `${line.top}px`,
                animation: 'pulse 3s ease-in-out infinite, glow 4s ease-in-out infinite',
                animationDelay: `${line.delay}s`,
              }}
            />
          ))}
          {backgroundElements.gridColumns.map((column) => (
            <div
              key={column.id}
              className='absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent'
              style={{
                left: `${column.left}%`,
                animation: 'pulse 4s ease-in-out infinite, glow 5s ease-in-out infinite',
                animationDelay: `${column.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SynthwaveBackground;
