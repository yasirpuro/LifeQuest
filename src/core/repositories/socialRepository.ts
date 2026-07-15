/**
 * SOCIAL REPOSITORY
 * 
 * Handles all social data operations:
 * - Friends CRUD
 * - Friend requests
 * - Blocked users
 * 
 * Architecture:
 * SocialContext → SocialRepository → Supabase
 * 
 * Critical Rules:
 * - NO business logic (handled by context)
 * - NO UI logic
 * - ONLY data access + caching + error handling
 */

import { getSupabase } from '../../shared/api/supabase';
import type { Friend, FriendRequest } from '../../types';
import { 
  createSuccessResult, 
  createErrorResult, 
  RepositoryErrorCode,
  type Result 
} from './baseRepository';

export class SocialRepository {
  private cache: Map<string, any> = new Map();
  private friendsCache: Map<string, Friend[]> = new Map();
  private requestsCache: Map<string, FriendRequest[]> = new Map();
  private blockedCache: Map<string, string[]> = new Map();

  /**
   * Get user's friends list
   */
  async getFriends(userId: string): Promise<Result<Friend[]>> {
    try {
      // Check cache
      if (this.friendsCache.has(userId)) {
        return createSuccessResult(this.friendsCache.get(userId)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('friends')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Transform to Friend type
      const friends: Friend[] = (data || []).map((item: any) => ({
        id: item.friend_id === userId ? item.user_id : item.friend_id,
        name: item.friend_name || 'Friend',
        avatar: item.friend_avatar || '',
        status: item.status || 'offline',
        currentQuest: item.current_quest || undefined,
        level: item.level || 1,
        xp: item.xp || 0,
        xpToNext: item.xp_to_next || 100,
        sentSupportToday: item.sent_support_today || false,
      }));

      // Cache result
      this.friendsCache.set(userId, friends);

      return createSuccessResult(friends);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaşlar alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get friend requests for user
   */
  async getFriendRequests(userId: string): Promise<Result<FriendRequest[]>> {
    try {
      // Check cache
      if (this.requestsCache.has(userId)) {
        return createSuccessResult(this.requestsCache.get(userId)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('friend_requests')
        .select('*')
        .eq('to_user_id', userId)
        .eq('status', 'pending');

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const requests: FriendRequest[] = (data || []).map((item: any) => ({
        id: item.id,
        fromUserId: item.from_user_id,
        toUserId: item.to_user_id,
        status: item.status,
        createdAt: item.created_at,
      }));

      // Cache result
      this.requestsCache.set(userId, requests);

      return createSuccessResult(requests);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaşlık istekleri alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Get blocked users list
   */
  async getBlockedUsers(userId: string): Promise<Result<string[]>> {
    try {
      // Check cache
      if (this.blockedCache.has(userId)) {
        return createSuccessResult(this.blockedCache.get(userId)!);
      }

      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('blocked_users')
        .select('blocked_user_id')
        .eq('user_id', userId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const blockedIds = (data || []).map((item: any) => item.blocked_user_id);

      // Cache result
      this.blockedCache.set(userId, blockedIds);

      return createSuccessResult(blockedIds);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Engellenen kullanıcılar alınamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Send friend request
   */
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<Result<FriendRequest>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { data, error } = await sb
        .from('friend_requests')
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      const request: FriendRequest = {
        id: data.id,
        fromUserId: data.from_user_id,
        toUserId: data.to_user_id,
        status: data.status,
        createdAt: data.created_at,
      };

      // Invalidate cache
      this.requestsCache.delete(toUserId);

      return createSuccessResult(request);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaşlık isteği gönderilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Accept friend request
   */
  async acceptFriendRequest(requestId: string, userId: string, friendId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      // Update request status
      const { error: updateError } = await sb
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        return createErrorResult(updateError.message, RepositoryErrorCode.UNKNOWN);
      }

      // Create friend relationship
      const { error: friendError } = await sb
        .from('friends')
        .insert({
          user_id: userId,
          friend_id: friendId,
          status: 'accepted',
          created_at: new Date().toISOString(),
        });

      if (friendError) {
        return createErrorResult(friendError.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate caches
      this.requestsCache.delete(userId);
      this.friendsCache.delete(userId);
      this.friendsCache.delete(friendId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaşlık isteği kabul edilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Reject friend request
   */
  async rejectFriendRequest(requestId: string, userId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate cache
      this.requestsCache.delete(userId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaşlık isteği reddedilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Remove friend
   */
  async removeFriend(userId: string, friendId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('friends')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate caches
      this.friendsCache.delete(userId);
      this.friendsCache.delete(friendId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Arkadaş silinemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Block user
   */
  async blockUser(userId: string, blockedUserId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('blocked_users')
        .insert({
          user_id: userId,
          blocked_user_id: blockedUserId,
          created_at: new Date().toISOString(),
        });

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate caches
      this.blockedCache.delete(userId);
      this.friendsCache.delete(userId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Kullanıcı engellenemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string, blockedUserId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('blocked_users')
        .delete()
        .eq('user_id', userId)
        .eq('blocked_user_id', blockedUserId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate cache
      this.blockedCache.delete(userId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Kullanıcı engeli kaldırılamadı',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Send support to friend
   */
  async sendSupportToFriend(userId: string, friendId: string): Promise<Result<void>> {
    try {
      const sb = getSupabase();
      if (!sb) {
        return createErrorResult('Supabase bağlantısı yok', RepositoryErrorCode.NETWORK_ERROR);
      }

      const { error } = await sb
        .from('friends')
        .update({ 
          sent_support_today: true,
          last_support_sent_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('friend_id', friendId);

      if (error) {
        return createErrorResult(error.message, RepositoryErrorCode.UNKNOWN);
      }

      // Invalidate cache
      this.friendsCache.delete(userId);

      return createSuccessResult(undefined);
    } catch (error) {
      return createErrorResult(
        error instanceof Error ? error.message : 'Destek gönderilemedi',
        RepositoryErrorCode.UNKNOWN
      );
    }
  }

  /**
   * Clear all caches (useful for logout)
   */
  clearCache(): void {
    this.cache.clear();
    this.friendsCache.clear();
    this.requestsCache.clear();
    this.blockedCache.clear();
  }
}

// Singleton instance
export const socialRepository = new SocialRepository();
