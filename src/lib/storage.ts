import { User, Event, Speaker, Session, ChatMessage, NetworkingConnection, Notification } from '@/types';

// Generic storage utility
class LocalStorageManager {
  private prefix = 'remoteinbound_';

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Array operations
  addToArray<T>(key: string, item: T): void {
    const array = this.get<T[]>(key) || [];
    array.push(item);
    this.set(key, array);
  }

  removeFromArray<T extends { id: string }>(key: string, id: string): void {
    const array = this.get<T[]>(key) || [];
    const filtered = array.filter(item => item.id !== id);
    this.set(key, filtered);
  }

  updateInArray<T extends { id: string }>(key: string, id: string, updates: Partial<T>): void {
    const array = this.get<T[]>(key) || [];
    const index = array.findIndex(item => item.id === id);
    if (index !== -1) {
      array[index] = { ...array[index], ...updates };
      this.set(key, array);
    }
  }

  findInArray<T extends { id: string }>(key: string, id: string): T | null {
    const array = this.get<T[]>(key) || [];
    return array.find(item => item.id === id) || null;
  }
}

const storage = new LocalStorageManager();

// User management
export const userStorage = {
  getCurrentUser: (): User | null => storage.get<User>('current_user'),
  setCurrentUser: (user: User) => storage.set('current_user', user),
  clearCurrentUser: () => storage.remove('current_user'),
  
  getAllUsers: (): User[] => storage.get<User[]>('users') || [],
  addUser: (user: User) => storage.addToArray('users', user),
  updateUser: (id: string, updates: Partial<User>) => storage.updateInArray('users', id, updates),
  removeUser: (id: string) => storage.removeFromArray('users', id),
  findUser: (id: string): User | null => storage.findInArray('users', id),
};

// Event management
export const eventStorage = {
  getAllEvents: (): Event[] => storage.get<Event[]>('events') || [],
  addEvent: (event: Event) => storage.addToArray('events', event),
  updateEvent: (id: string, updates: Partial<Event>) => storage.updateInArray('events', id, updates),
  removeEvent: (id: string) => storage.removeFromArray('events', id),
  findEvent: (id: string): Event | null => storage.findInArray('events', id),
  
  getCurrentEvent: (): Event | null => storage.get<Event>('current_event'),
  setCurrentEvent: (event: Event) => storage.set('current_event', event),
};

// Speaker management
export const speakerStorage = {
  getAllSpeakers: (): Speaker[] => storage.get<Speaker[]>('speakers') || [],
  addSpeaker: (speaker: Speaker) => storage.addToArray('speakers', speaker),
  updateSpeaker: (id: string, updates: Partial<Speaker>) => storage.updateInArray('speakers', id, updates),
  removeSpeaker: (id: string) => storage.removeFromArray('speakers', id),
  findSpeaker: (id: string): Speaker | null => storage.findInArray('speakers', id),
};

// Session management
export const sessionStorage = {
  getAllSessions: (): Session[] => storage.get<Session[]>('sessions') || [],
  addSession: (session: Session) => storage.addToArray('sessions', session),
  updateSession: (id: string, updates: Partial<Session>) => storage.updateInArray('sessions', id, updates),
  removeSession: (id: string) => storage.removeFromArray('sessions', id),
  findSession: (id: string): Session | null => storage.findInArray('sessions', id),
  
  getSessionsByDate: (date: string): Session[] => {
    const sessions = storage.get<Session[]>('sessions') || [];
    return sessions.filter(session => 
      new Date(session.startTime).toDateString() === new Date(date).toDateString()
    );
  },
};

// Chat management
export const chatStorage = {
  getAllMessages: (): ChatMessage[] => storage.get<ChatMessage[]>('chat_messages') || [],
  addMessage: (message: ChatMessage) => storage.addToArray('chat_messages', message),
  getMessagesBySession: (sessionId: string): ChatMessage[] => {
    const messages = storage.get<ChatMessage[]>('chat_messages') || [];
    return messages.filter(msg => msg.sessionId === sessionId);
  },
  clearMessages: () => storage.remove('chat_messages'),
};

// Networking management
export const networkingStorage = {
  getAllConnections: (): NetworkingConnection[] => storage.get<NetworkingConnection[]>('connections') || [],
  addConnection: (connection: NetworkingConnection) => storage.addToArray('connections', connection),
  updateConnection: (id: string, updates: Partial<NetworkingConnection>) => 
    storage.updateInArray('connections', id, updates),
  getUserConnections: (userId: string): NetworkingConnection[] => {
    const connections = storage.get<NetworkingConnection[]>('connections') || [];
    return connections.filter(conn => conn.userId1 === userId || conn.userId2 === userId);
  },
};

// Notification management
export const notificationStorage = {
  getAllNotifications: (): Notification[] => storage.get<Notification[]>('notifications') || [],
  addNotification: (notification: Notification) => storage.addToArray('notifications', notification),
  markAsRead: (id: string) => storage.updateInArray<Notification>('notifications', id, { read: true }),
  getUserNotifications: (userId: string): Notification[] => {
    const notifications = storage.get<Notification[]>('notifications') || [];
    return notifications.filter(notif => notif.userId === userId);
  },
  clearNotifications: () => storage.remove('notifications'),
};

// Settings management
export const settingsStorage = {
  getSettings: () => storage.get('settings') || {
    theme: 'system',
    notifications: true,
    autoJoinSessions: false,
    showNetworkingPrompts: true,
  },
  updateSettings: (updates: Record<string, unknown>) => {
    const current = settingsStorage.getSettings();
    storage.set('settings', { ...current, ...updates });
  },
};

export default storage;