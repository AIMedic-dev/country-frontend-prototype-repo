'use client';

import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';

const siteId = 6545488;
const hotjarVersion = 6;

export default function HotjarInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    Hotjar.init(siteId, hotjarVersion);
  }, []);

  return null;
}