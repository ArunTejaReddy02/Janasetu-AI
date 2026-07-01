import { useState, useEffect } from 'react';
import { fetchSubmissions, fetchStats } from '../services/api';

/**
 * useSubmissions — Hook to fetch and manage submission data.
 * Returns submissions, stats, loading/error states.
 */
export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [subs, statsData] = await Promise.all([
          fetchSubmissions(),
          fetchStats(),
        ]);
        if (!cancelled) {
          setSubmissions(subs);
          setStats(statsData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch submissions');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [subs, statsData] = await Promise.all([
        fetchSubmissions(),
        fetchStats(),
      ]);
      setSubmissions(subs);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { submissions, stats, loading, error, refresh };
}

export default useSubmissions;
