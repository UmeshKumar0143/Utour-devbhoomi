import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UseTextToSpeechReturn {
  speak: (text: string, voiceId?: string) => Promise<void>;
  isPlaying: boolean;
  stop: () => void;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string, voiceId: string = '9BWtsMINqrJLrRacOk9x') => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }

      setIsPlaying(true);

      // Use browser's built-in speech synthesis as fallback for now
      // ElevenLabs integration would require a backend endpoint
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = () => {
          setIsPlaying(false);
          toast({
            title: "Speech Error", 
            description: "Failed to play speech",
            variant: "destructive",
          });
        };
        
        speechSynthesis.speak(utterance);
        return;
      }

      // Fallback to ElevenLabs (would need backend integration)
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId,
        }),
      });

      if (response && response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        setCurrentAudio(audio);

        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Audio Error",
            description: "Failed to play audio",
            variant: "destructive",
          });
        };

        await audio.play();
      }
    } catch (error) {
      setIsPlaying(false);
      setCurrentAudio(null);
      console.error('Text-to-speech error:', error);
      toast({
        title: "Speech Error",
        description: "Failed to convert text to speech. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const stop = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return { speak, isPlaying, stop };
};