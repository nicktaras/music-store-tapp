// components/Player.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';

interface PlayerProps {
  duration: number|undefined;  // Duration of the audio in seconds
  songUrl: string|undefined;   // URL of the audio file
  bgImg: string|undefined;   // bg imagq
}

const Player: React.FC<PlayerProps> = ({ duration, songUrl, bgImg }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        setCurrentTime(audioRef.current!.currentTime);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current!.currentTime);
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audioRef.current!.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current!.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <div
      className="relative flex items-center justify-center h-[420px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute bottom-0 z-10 p-8 text-white">
        <h1 className="text-xl font-bold mb-4">Now Playing</h1>
        <Slider
          value={[currentTime]}
          max={duration}
          onValueChange={handleTimeChange}
          className="mb-4"
        />
        <div className="flex items-center justify-around">
          <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>
        </div>
      </div>
      <audio ref={audioRef} src={songUrl} preload="metadata" />
    </div>
  );
};

export default Player;
