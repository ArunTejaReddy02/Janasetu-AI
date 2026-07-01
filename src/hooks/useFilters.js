import { useState, useMemo, useCallback } from 'react';

/**
 * useFilters — Hook to manage filter state and apply client-side filtering.
 * Filters: language, channels, urgency, search query.
 */
export function useFilters(submissions = []) {
  const [filters, setFilters] = useState({
    language: 'all',          // 'all' | 'hi' | 'mr' | 'en' | 'kn'
    channels: ['whatsapp', 'web', 'voice'],  // active channels
    urgency: 'all',           // 'all' | 'high' | 'normal'
    search: '',               // free-text search
  });

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleChannel = useCallback((channel) => {
    setFilters((prev) => {
      const channels = prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel];
      return { ...prev, channels };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      language: 'all',
      channels: ['whatsapp', 'web', 'voice'],
      urgency: 'all',
      search: '',
    });
  }, []);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Language filter
      if (filters.language !== 'all' && sub.raw_content.detected_language !== filters.language) {
        return false;
      }

      // Channel filter
      if (!filters.channels.includes(sub.channel)) {
        return false;
      }

      // Urgency filter
      if (filters.urgency !== 'all' && sub.extracted.urgency !== filters.urgency) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const searchable = [
          sub.submission_id,
          sub.extracted.summary,
          sub.extracted.location_text,
          sub.raw_content.transcript,
          sub.extracted.facility_type,
        ].join(' ').toLowerCase();
        if (!searchable.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [submissions, filters]);

  return {
    filters,
    setFilter,
    toggleChannel,
    clearFilters,
    filteredSubmissions,
  };
}

export default useFilters;
