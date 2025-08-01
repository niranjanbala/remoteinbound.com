import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import {
  createUserSchema,
  updateUserSchema,
  createEventSchema,
  updateEventSchema,
  createSpeakerSchema,
  updateSpeakerSchema,
  createRegistrationSchema,
  cancelRegistrationSchema,
  errorResponseSchema,
  successResponseSchema,
  uuidSchema,
} from './validations';

// Create OpenAPI registry
const registry = new OpenAPIRegistry();

// Register User schemas
registry.register('CreateUser', createUserSchema);
registry.register('UpdateUser', updateUserSchema);
registry.register('User', createUserSchema.extend({
  id: uuidSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}));

// Register Event schemas
registry.register('CreateEvent', createEventSchema);
registry.register('UpdateEvent', updateEventSchema);
registry.register('Event', createEventSchema.extend({
  id: uuidSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}));

// Register Speaker schemas
registry.register('CreateSpeaker', createSpeakerSchema);
registry.register('UpdateSpeaker', updateSpeakerSchema);
registry.register('Speaker', createSpeakerSchema.extend({
  id: uuidSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}));

// Register Registration schemas
registry.register('CreateRegistration', createRegistrationSchema);
registry.register('CancelRegistration', cancelRegistrationSchema);

// Register common response schemas
registry.register('ErrorResponse', errorResponseSchema);
registry.register('SuccessResponse', successResponseSchema);

// Register parameter schemas
registry.register('UUIDParam', z.object({ id: uuidSchema }));

// Define API paths
registry.registerPath({
  method: 'get',
  path: '/api/users',
  description: 'Get all users',
  summary: 'Retrieve all users',
  tags: ['Users'],
  responses: {
    200: {
      description: 'List of users retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().optional(),
            data: z.array(registry.definitions.User),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/users',
  description: 'Create a new user',
  summary: 'Create user',
  tags: ['Users'],
  request: {
    body: {
      description: 'User data',
      content: {
        'application/json': {
          schema: registry.definitions.CreateUser,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: registry.definitions.User,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    409: {
      description: 'User already exists',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users/{id}',
  description: 'Get user by ID',
  summary: 'Retrieve user',
  tags: ['Users'],
  request: {
    params: registry.definitions.UUIDParam,
  },
  responses: {
    200: {
      description: 'User retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().optional(),
            data: registry.definitions.User,
          }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/users/{id}',
  description: 'Update user by ID',
  summary: 'Update user',
  tags: ['Users'],
  request: {
    params: registry.definitions.UUIDParam,
    body: {
      description: 'Updated user data',
      content: {
        'application/json': {
          schema: registry.definitions.UpdateUser,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'User updated successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: registry.definitions.User,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    409: {
      description: 'Email already taken',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/users/{id}',
  description: 'Delete user by ID',
  summary: 'Delete user',
  tags: ['Users'],
  request: {
    params: registry.definitions.UUIDParam,
  },
  responses: {
    200: {
      description: 'User deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: z.null(),
          }),
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

// Events endpoints
registry.registerPath({
  method: 'get',
  path: '/api/events',
  description: 'Get all events',
  summary: 'Retrieve all events',
  tags: ['Events'],
  responses: {
    200: {
      description: 'List of events retrieved successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().optional(),
            data: z.array(registry.definitions.Event),
          }),
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/events',
  description: 'Create a new event',
  summary: 'Create event',
  tags: ['Events'],
  request: {
    body: {
      description: 'Event data',
      content: {
        'application/json': {
          schema: registry.definitions.CreateEvent,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Event created successfully',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            data: registry.definitions.Event,
          }),
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    409: {
      description: 'Event conflict',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: registry.definitions.ErrorResponse,
        },
      },
    },
  },
});

// Generate OpenAPI specification
export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Remote Inbound API',
      description: 'Comprehensive API for managing virtual events, users, speakers, and registrations',
      contact: {
        name: 'API Support',
        email: 'support@remoteinbound.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://remoteinbound.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Events',
        description: 'Event management operations',
      },
      {
        name: 'Speakers',
        description: 'Speaker management operations',
      },
      {
        name: 'Registrations',
        description: 'Event registration operations',
      },
      {
        name: 'Authentication',
        description: 'Authentication and authorization',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  });
}