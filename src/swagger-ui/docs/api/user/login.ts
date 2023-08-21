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
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  artsyData: {
                    type: 'object',
                    properties: {
                      displayName: {
                        type: 'string',
                        example: '이름',
                      },
                      email: {
                        type: 'string',
                        example: 'test@test.com',
                      },
                      createDate: {
                        type: 'timestemp',
                        example: '2023-08-15T23:43:20.000Z',
                      },
                    },
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
