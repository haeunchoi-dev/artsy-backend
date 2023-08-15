export default {
  '/api/user/tickets': {
    get: {
      tags: ['User Ticket'],
      summary: '사용자별 티켓 목록',
      description: '사용자별 티켓 목록',
      parameters: [
        {
          name: 'categoryId',
          in: 'query',
          description: 'category 필터 조건 / category id를 넘겨야함',
          schema: {
            type: 'int',
          },
        },
      ],
      responses: {
        200: {
          description: '티켓 list',
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
                        id: {
                          type: 'int',
                          description: '티켓 id',
                          example: 1,
                        },
                        categoryId: {
                          type: 'int',
                          description: '카테고리 id',
                          example: 1,
                        },
                        categoryName: {
                          type: 'string',
                          description: '카테고리 명',
                          example: '영화',
                        },
                        categoryColor: {
                          type: 'string',
                          description: '카테고리 색상',
                          example: '#A888FF',
                        },
                        title: {
                          type: 'string',
                          description: '타이틀',
                          example: '영화제목',
                        },
                        showDate: {
                          type: 'date',
                          description: '관람일',
                          example: '2023-08-14',
                        },
                        place: {
                          type: 'string',
                          description: '장소',
                          example: '성수 메가박스',
                        },
                        price: {
                          type: 'int',
                          description: '금액',
                          example: 100000,
                        },
                        rating: {
                          type: 'int',
                          description: '별점',
                          example: 3,
                        },
                        review: {
                          type: 'string',
                          description: '리뷰',
                          example: '오늘 영화봄',
                        },
                        createDate: {
                          type: 'Timestamp',
                          description: '등록일',
                        },
                        updateDate: {
                          type: 'Timestamp',
                          description: '수정일',
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
