export default {
  '/api/user/sign-up': {
    post: {
      tags: ['User'],
      summary: '회원가입',
      description: '회원가입',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                displayName: {
                  type: 'string',
                  description: 'displayName',
                  example: '이름 아무거나',
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
          description: '회원가입 완료',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
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
