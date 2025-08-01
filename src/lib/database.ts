// Re-export the secure API client services
export {
  userService,
  eventService,
  speakerService,
  registrationService,
} from './api-client';

// Database services now use secure API endpoints
// All database operations go through the backend API instead of direct Supabase calls
// This keeps your Supabase service role key secure on the server