export default {
  '/api/user/logout': {
    post: {
      tags: ['User'],
      summary: '로그아웃',
      description: '로그아웃',
      responses: {
        200: {
          description: '로그아웃 완료',
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
