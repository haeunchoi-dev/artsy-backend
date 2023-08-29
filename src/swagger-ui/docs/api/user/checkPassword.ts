export default {
  '/api/user/check-password': {
    post: {
      tags: ['User'],
      summary: '비밀번호 확인',
      description: '비밀번호 확인',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
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
                      isCorrect: {
                        type: 'boolean',
                        example: false,
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
