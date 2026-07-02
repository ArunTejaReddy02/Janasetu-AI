export interface SubmissionLocation {
  latitude?: number;
  longitude?: number;
  wardId?: string;
  constituencyId?: string;
  address?: string;
  locationName?: string;
}

export interface SubmissionEntities {
  issueType?: string;
  severity?: string;
  affectedPeople?: number;
  landmarks?: string[];
  infrastructure?: string[];
  officialsMentioned?: string[];
  urgencyIndicators?: string[];
}

export interface ProcessedSubmission {
  id: string;
  rawText?: string;
  translatedText?: string;
  category?: string;
  subCategory?: string;
  entities?: SubmissionEntities;
  urgencyScore?: number;
  sentiment?: string;
  location?: SubmissionLocation;
  clusterId?: string;
}
