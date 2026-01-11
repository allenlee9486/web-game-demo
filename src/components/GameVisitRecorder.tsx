'use client';

import { useEffect } from 'react';
import { recordGameVisit } from '@/lib/gameStats';

export const GameVisitRecorder = ({ slug }: { slug: string }) => {
  useEffect(() => {
    recordGameVisit(slug);
  }, [slug]);

  return null;
};
