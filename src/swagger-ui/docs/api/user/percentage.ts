export default {
  '/api/user/percentage': {
    get: {
      tags: ['User'],
      summary: '사용자 상위 백분율',
      description: '사용자 상위 백분율',
      responses: {
        200: {
          description: '사용자 상위 백분율',
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
                      percentage: {
                        type: 'int',
                        description: '백분율',
                        example: 10.1,
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
