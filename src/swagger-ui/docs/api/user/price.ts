export default {
  '/api/user/total-price': {
    get: {
      tags: ['User'],
      summary: '총 지출 정보',
      description: '총 지출 정보',
      responses: {
        200: {
          description: '총 지출 정보',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  artsyData: {
                    type: 'object',
                    properties: {
                      totalPrice: {
                        type: 'number',
                        example: 1000000,
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
