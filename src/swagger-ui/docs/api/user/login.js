export default {
  '/api/user/login': {
    post: {
      tags: ['User'],
      summary: '로그인',
      description: '로그인',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                displayName: {
                  type: 'string',
                  description: 'email',
                  example: 'test@test.com',
                },
                email: {
                  type: 'string',
                  description: 'email',
                  example: 'test@test.com',
                },
                password: {
                  type: 'string',
                  description: 'password',
                  example: '###',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: '로그인 완료',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: {
                    type: 'string',
                    description: 'token',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
