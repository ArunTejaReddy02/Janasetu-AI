export interface HotspotCluster {
  id: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  centroid: {
    latitude: number;
    longitude: number;
  };
  radiusMeters: number;
  submissionIds: string[];
  submissionCount: number;
  affectedCount: number;
  priorityScore: number;
  tags: string[];
  createdAt: Date;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoCluster {
  centroid: GeoPoint;
  points: GeoPoint[];
  radius: number;
}
