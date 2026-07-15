import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useAuth } from '../auth/authContext';
import { socialRepository } from '../../core/repositories/socialRepository';
import type { Friend, FriendRequest } from '../../types';

interface SocialContextValue {
  friends: Friend[];
  friendRequests: FriendRequest[];
  blockedUsers: string[];
  isLoading: boolean;
  error: string | null;
  loadSocialData: () => Promise<void>;
  sendSupportToFriend: (friendId: string) => Promise<void>;
}

const SocialContext = createContext<SocialContextValue | null>(null);

export function SocialProvider({ children }: { children: ReactNode }) {
  const { userProfile } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSocialData = useCallback(async () => {
    if (!userProfile?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [friendsResult, requestsResult, blockedResult] = await Promise.all([
        socialRepository.getFriends(userProfile.id),
        socialRepository.getFriendRequests(userProfile.id),
        socialRepository.getBlockedUsers(userProfile.id),
      ]);

      if (friendsResult.success) setFriends(friendsResult.data ?? []);
      if (requestsResult.success) setFriendRequests(requestsResult.data ?? []);
      if (blockedResult.success) setBlockedUsers(blockedResult.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social data yüklenemedi');
    } finally {
      setIsLoading(false);
    }
  }, [userProfile?.id]);

  useEffect(() => {
    void loadSocialData();
  }, [loadSocialData]);

  const sendSupportToFriend = useCallback(async (friendId: string) => {
    if (!userProfile?.id) return;

    const result = await socialRepository.sendSupportToFriend(userProfile.id, friendId);
    if (result.success) {
      setFriends(prev => prev.map(friend => friend.id === friendId ? { ...friend, sentSupportToday: true } : friend));
    }
  }, [userProfile?.id]);

  return (
    <SocialContext.Provider value={{ friends, friendRequests, blockedUsers, isLoading, error, loadSocialData, sendSupportToFriend }}>
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within SocialProvider');
  return context;
}
