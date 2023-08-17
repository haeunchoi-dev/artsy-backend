export default {
  '/api/user/check-duplicated-email': {
    post: {
      tags: ['User'],
      summary: '이메일 중복 확인',
      description: '이메일 중복 확인',
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
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: '이메일 중복 확인',
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
                      isExists: {
                        type: 'boolean',
                        //description: 'true',
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
    },
  },
};
