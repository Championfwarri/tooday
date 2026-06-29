import { useState, useEffect } from 'react';
import { SubscriptionState, getSubscriptionState } from '@/store/subscription';

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    status: 'free',
    trialStartDate: null,
    trialDaysLeft: 0,
  });

  useEffect(() => {
    getSubscriptionState().then(setState);
  }, []);

  const refresh = async () => {
    const s = await getSubscriptionState();
    setState(s);
  };

  return { ...state, refresh };
}
