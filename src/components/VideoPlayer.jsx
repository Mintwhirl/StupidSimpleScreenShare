import { forwardRef, useEffect, useRef } from 'react';

const VideoPlayer = forwardRef(({ className, ...props }, ref) => {
  const videoRef = useRef(null);
  const internalRef = ref || videoRef;

  // Handle video element events
  useEffect(() => {
    const video = internalRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded:', {
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
    };

    const handleLoadedData = () => {
      console.log('Video data loaded');
    };

    const handleCanPlay = () => {
      console.log('Video can start playing');
    };

    const handlePlay = () => {
      console.log('Video started playing');
    };

    const handlePause = () => {
      console.log('Video paused');
    };

    const handleEnded = () => {
      console.log('Video ended');
    };

    const handleError = (e) => {
      console.error('Video error:', e);
    };

    const handleWaiting = () => {
      console.log('Video waiting for data');
    };

    const handleStalled = () => {
      console.log('Video stalled');
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);

    // Cleanup
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
    };
  }, [internalRef]);

  return <video ref={internalRef} className={className} {...props} />;
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
