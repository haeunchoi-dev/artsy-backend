export default {
  '/api/user/badge': {
    get: {
      tags: ['User'],
      summary: '뱃지 정보',
      description: '뱃지 정보',
      responses: {
        200: {
          description: '뱃지 정보',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  artsyData: {
                    type: 'object',
                    properties: {
                      ticketCount: {
                        type: 'number',
                        example: 15,
                      },
                      currentBadge: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            example: '뱃지 이름',
                          },
                          standard: {
                            type: 'number',
                            example: 10,
                          },
                        },
                      },
                      nextBadge: {
                        type: 'object',
                        properties: {
                          name: {
                            type: 'string',
                            example: '뱃지 이름',
                          },
                          standard: {
                            type: 'number',
                            example: 30,
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
    },
  },
};
