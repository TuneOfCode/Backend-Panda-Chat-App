export const authConst = {
  PASSWORD_SALT: 10,
};

export const redisConst = {
  EXPIRED_TIME: 300, // 5 minutes
};

export const uploadConst = {
  MAX_SIZE: 1024 * 1024 * 5, // 5MB
  FIELD_NAME: {
    AVATAR: 'avatar',
    FILES: 'files',
  },
  TYPE: {
    IMAGE: 'image',
    VIDEO: 'video',
    OTHER: 'other',
    ALL: 'all',
  },
  SAVE_PLACES: {
    ROOT: 'src/public',
    ALL: 'src/public',
    IMAGE: 'src/public/images',
    VIDEO: 'src/public/videos',
    OTHER: 'src/public/others',
  },
  EXTENSIONS: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif'],
    VIDEO: ['mp4', 'avi', 'mkv', 'mov'],
    OTHER: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    ALL: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mkv', 'mov', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
  },
  MAX_COUNT: 5,
};
