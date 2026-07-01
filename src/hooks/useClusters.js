import { useState, useEffect } from 'react';
import {
  fetchClusters,
  fetchVerificationQueue,
  fetchActiveProjects,
  processVerificationAction,
} from '../services/clustering';

/**
 * useClusters — Hook to fetch and manage cluster data, verification queue, and active projects.
 */
export function useClusters() {
  const [clusters, setClusters] = useState([]);
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [clustersData, queueData, projectsData] = await Promise.all([
          fetchClusters(),
          fetchVerificationQueue(),
          fetchActiveProjects(),
        ]);
        if (!cancelled) {
          setClusters(clustersData);
          setVerificationQueue(queueData);
          setActiveProjects(projectsData);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch cluster data');
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

  const handleVerificationAction = async (queueItemId, action) => {
    try {
      await processVerificationAction(queueItemId, action);
      // Remove the item from the queue after action
      setVerificationQueue((prev) => prev.filter((item) => item.id !== queueItemId));
    } catch (err) {
      console.error('Verification action failed:', err);
    }
  };

  return {
    clusters,
    verificationQueue,
    activeProjects,
    loading,
    error,
    handleVerificationAction,
  };
}

export default useClusters;
