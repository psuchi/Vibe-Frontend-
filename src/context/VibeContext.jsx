import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const VibeContext = createContext();

export const useVibe = () => useContext(VibeContext);

export const VibeProvider = ({ children }) => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [currentMood, setCurrentMood] = useState(() => {
    return sessionStorage.getItem('vibe_currentMood') || 'calm';
  });

  const [booking, setBooking] = useState(() => {
    const saved = sessionStorage.getItem('vibe_booking');
    return saved ? JSON.parse(saved) : null;
  });

  const [bookingFinal, setBookingFinal] = useState(() => {
    const saved = sessionStorage.getItem('vibe_bookingFinal');
    return saved ? JSON.parse(saved) : null;
  });

  const [bookingId, setBookingId] = useState(() => {
    return sessionStorage.getItem('vibe_bookingId') || null;
  });

  const [bookingRef, setBookingRef] = useState(() => {
    return sessionStorage.getItem('vibe_bookingRef') || null;
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = sessionStorage.getItem('vibe_preferences');
    return saved ? JSON.parse(saved) : { budget: null, stay: null, flight: null };
  });

  useEffect(() => {
    sessionStorage.setItem('vibe_currentMood', currentMood);
    document.body.className = `vibe-${currentMood}`;
  }, [currentMood]);

  useEffect(() => {
    sessionStorage.setItem('vibe_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (booking) sessionStorage.setItem('vibe_booking', JSON.stringify(booking));
    else sessionStorage.removeItem('vibe_booking');
  }, [booking]);

  useEffect(() => {
    if (bookingFinal) {
      sessionStorage.setItem('vibe_bookingFinal', JSON.stringify(bookingFinal));
    } else {
      sessionStorage.removeItem('vibe_bookingFinal');
    }
  }, [bookingFinal]);

  useEffect(() => {
    if (bookingRef) sessionStorage.setItem('vibe_bookingRef', bookingRef);
  }, [bookingRef]);

  useEffect(() => {
    if (bookingId) sessionStorage.setItem('vibe_bookingId', bookingId);
  }, [bookingId]);

  const getItinerary = (moodId, city) => {
    const key = `vibe_itinerary_${moodId}_${city}`;
    const saved = sessionStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  };

  const saveItinerary = async (moodId, city, days) => {
    const key = `vibe_itinerary_${moodId}_${city}`;
    sessionStorage.setItem(key, JSON.stringify(days));
    if (bookingId) {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`${API_URL}/api/bookings/${bookingId}/itinerary`, { itinerary: days }, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
      } catch (err) {
        console.error('Failed to sync itinerary to backend:', err);
      }
    }
  };

  return (
    <VibeContext.Provider
      value={{
        currentMood,
        setCurrentMood,
        booking,
        setBooking,
        bookingFinal,
        setBookingFinal,
        bookingRef,
        setBookingRef,
        bookingId,
        setBookingId,
        getItinerary,
        saveItinerary,
        preferences,
        setPreferences
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};
