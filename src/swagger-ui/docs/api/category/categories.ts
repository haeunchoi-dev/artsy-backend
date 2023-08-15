export default {
  '/api/categories': {
    get: {
      tags: ['Category'],
      summary: '카테고리 목록',
      description: '카테고리 목록',
      responses: {
        200: {
          description: '카테고리 목록',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  artsyData: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: {
                          type: 'string',
                          example: '뮤지컬',
                        },
                        color: {
                          type: 'string',
                          example: '#ff0000',
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
