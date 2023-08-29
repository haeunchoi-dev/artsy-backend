export default {
  '/api/user/statistic': {
    get: {
      tags: ['User'],
      summary: '사용자 통계',
      description: '사용자 통계',
      parameters: [
        {
          name: 'year',
          in: 'query',
          description: '년도',
          schema: {
            type: 'int',
          },
        },
        {
          name: 'month',
          in: 'query',
          description: '월',
          schema: {
            type: 'int',
          },
        },
      ],
      responses: {
        200: {
          description: '사용자 통계',
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
                      cntPerMonth: {
                        type: 'int',
                        description: '월별 티켓수',
                        example: 10,
                      },
                      pricePerMonth: {
                        type: 'int',
                        description: '월별 총 금액',
                        example: 10000,
                      },
                      chart: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            categoryName: {
                              type: 'string',
                              description: '카테고리 명',
                              example: '영화',
                            },
                            cnt: {
                              type: 'int',
                              description: '카테고리 별 티켓수',
                              example: 1,
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
  },
};
