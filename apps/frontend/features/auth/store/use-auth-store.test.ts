import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './use-auth-store';
import { User } from '../types';

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('should initialize with default states', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });

  it('should allow setting user and authentication state', () => {
    const dummyUser: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      status: 'active',
      roles: ['Student'],
      permissions: ['courses.view'],
    };

    useAuthStore.getState().setUser(dummyUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(dummyUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear authentication state on logout', () => {
    const dummyUser: User = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      status: 'active',
      roles: ['Student'],
      permissions: ['courses.view'],
    };

    useAuthStore.getState().setUser(dummyUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
