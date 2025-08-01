export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Remote Inbound API',
    version: '1.0.0',
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
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique user identifier',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          fullName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'User full name',
          },
          company: {
            type: 'string',
            maxLength: 100,
            description: 'User company',
            nullable: true,
          },
          jobTitle: {
            type: 'string',
            maxLength: 100,
            description: 'User job title',
            nullable: true,
          },
          phone: {
            type: 'string',
            pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
            description: 'User phone number',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
          },
        },
        required: ['id', 'email', 'fullName', 'createdAt', 'updatedAt'],
      },
      CreateUser: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          fullName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'User full name',
          },
          company: {
            type: 'string',
            maxLength: 100,
            description: 'User company',
          },
          jobTitle: {
            type: 'string',
            maxLength: 100,
            description: 'User job title',
          },
          phone: {
            type: 'string',
            pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
            description: 'User phone number',
          },
        },
        required: ['email', 'fullName'],
      },
      UpdateUser: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          fullName: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'User full name',
          },
          company: {
            type: 'string',
            maxLength: 100,
            description: 'User company',
          },
          jobTitle: {
            type: 'string',
            maxLength: 100,
            description: 'User job title',
          },
          phone: {
            type: 'string',
            pattern: '^\\+?[\\d\\s\\-\\(\\)]+$',
            description: 'User phone number',
          },
        },
      },
      Event: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Unique event identifier',
          },
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description: 'Event title',
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
            description: 'Event description',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event start date and time',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event end date and time',
          },
          timezone: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Event timezone',
          },
          status: {
            type: 'string',
            enum: ['upcoming', 'live', 'ended'],
            description: 'Event status',
          },
          coverImage: {
            type: 'string',
            format: 'uri',
            description: 'Event cover image URL',
            nullable: true,
          },
          maxAttendees: {
            type: 'integer',
            minimum: 1,
            description: 'Maximum number of attendees',
            nullable: true,
          },
          currentAttendees: {
            type: 'integer',
            minimum: 0,
            description: 'Current number of attendees',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
              maxLength: 50,
            },
            maxItems: 10,
            description: 'Event tags',
          },
          organizer: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                description: 'Organizer name',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Organizer email',
              },
              avatar: {
                type: 'string',
                format: 'uri',
                description: 'Organizer avatar URL',
                nullable: true,
              },
            },
            required: ['name', 'email'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Event creation timestamp',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Event last update timestamp',
          },
        },
        required: [
          'id',
          'title',
          'description',
          'startDate',
          'endDate',
          'timezone',
          'status',
          'currentAttendees',
          'tags',
          'organizer',
          'createdAt',
          'updatedAt',
        ],
      },
      CreateEvent: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description: 'Event title',
          },
          description: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
            description: 'Event description',
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event start date and time',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Event end date and time',
          },
          timezone: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
            description: 'Event timezone',
          },
          status: {
            type: 'string',
            enum: ['upcoming', 'live', 'ended'],
            description: 'Event status',
            default: 'upcoming',
          },
          coverImage: {
            type: 'string',
            format: 'uri',
            description: 'Event cover image URL',
          },
          maxAttendees: {
            type: 'integer',
            minimum: 1,
            description: 'Maximum number of attendees',
          },
          currentAttendees: {
            type: 'integer',
            minimum: 0,
            description: 'Current number of attendees',
            default: 0,
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
              maxLength: 50,
            },
            maxItems: 10,
            description: 'Event tags',
            default: [],
          },
          organizer: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1,
                maxLength: 100,
                description: 'Organizer name',
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Organizer email',
              },
              avatar: {
                type: 'string',
                format: 'uri',
                description: 'Organizer avatar URL',
              },
            },
            required: ['name', 'email'],
          },
        },
        required: ['title', 'description', 'startDate', 'endDate', 'timezone', 'organizer'],
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message',
          },
          details: {
            type: 'object',
            description: 'Additional error details',
            properties: {
              validationErrors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: {
                      type: 'string',
                      description: 'Field that failed validation',
                    },
                    message: {
                      type: 'string',
                      description: 'Validation error message',
                    },
                  },
                  required: ['field', 'message'],
                },
              },
            },
          },
        },
        required: ['error'],
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Success message',
          },
          data: {
            description: 'Response data',
          },
        },
      },
    },
  },
  paths: {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Retrieve a list of all users',
        responses: {
          '200': {
            description: 'Users retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a new user',
        description: 'Create a new user with the provided information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateUser',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '409': {
            description: 'User with this email already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description: 'Retrieve a specific user by their ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid user ID format',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Update a specific user by their ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateUser',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error or invalid user ID format',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '409': {
            description: 'Email already taken by another user',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Delete a specific user by their ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'User ID',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'User deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      type: 'null',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid user ID format',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/events': {
      get: {
        tags: ['Events'],
        summary: 'Get all events',
        description: 'Retrieve a list of all events',
        responses: {
          '200': {
            description: 'Events retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Event',
                      },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Events'],
        summary: 'Create a new event',
        description: 'Create a new event with the provided information',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateEvent',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Event created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                    },
                    data: {
                      $ref: '#/components/schemas/Event',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '409': {
            description: 'Event conflict (duplicate title and start date)',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
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
};