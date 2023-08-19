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
        {
          name: 'perPage',
          in: 'query',
          description: '한 페이지당 ticket 수',
          schema: {
            type: 'int',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: '페이지 수',
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
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  artsyData: {
                    type: 'object',
                    properties: {
                      totalCount: {
                        type: 'int',
                        description: '티켓 총 수',
                        example: 21,
                      },
                      ticketList: {
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
                            fileId: {
                              type: 'int',
                              description: '이미지 id',
                              example: 1,
                            },
                            fileImageUrl: {
                              type: 'string',
                              description: '이미지 url',
                              example: 'http://localhost:5000/api/api-docs/',
                            },
                            fileOriginalName: {
                              type: 'string',
                              description: '오리진 파일명',
                              example: '원래이름.jpg',
                            },
                            fileName: {
                              type: 'string',
                              description: '파일명',
                              example: '변경된이름.jpg',
                            },
                            fileWidth: {
                              type: 'int',
                              description: '가로 사이즈',
                              example: 100,
                            },
                            fileHeight: {
                              type: 'int',
                              description: '세로 사이즈',
                              example: 100,
                            },
                            fileExtension: {
                              type: 'string',
                              description: '확장자',
                              example: 'jpg',
                            },
                            fileSize: {
                              type: 'int',
                              description: '이미지 파일 크기',
                              example: 1000,
                            },
                            fileIsPrimary: {
                              type: 'int',
                              description: '대표 이미지 여부 (1 or 0)',
                              example: 1,
                            },
                            fileCreateDate: {
                              type: 'Timestamp',
                              description: '등록일',
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
