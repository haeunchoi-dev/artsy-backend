export default {
  '/api/user/info': {
    get: {
      tags: ['User'],
      summary: '사용자 정보',
      description: '사용자 정보',
      responses: {
        200: {
          description: '사용자 정보',
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
                        description: 'displayName',
                        example: '이름 아무거나',
                      },
                      email: {
                        type: 'string',
                        description: 'email',
                        example: 'test@test.com',
                      },
                      createDate: {
                        type: 'timestemp',
                        example: '2023-08-15T23:43:20.000Z',
                      },
                      totalTicket: {
                        type: 'int',
                        description: '티켓 총 수',
                        example: 10,
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
    put: {
      tags: ['User'],
      summary: '사용자 정보 수정',
      description: '사용자 정보 수정',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                displayName: {
                  type: 'string',
                  description: 'string',
                  example: '하하호호',
                },
                password: {
                  type: 'string',
                  description: 'string | undefined',
                  example: '1234',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: '사용자 정보 수정',
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
