import { Schema } from 'dynamoose';

export const MusicSchema = new Schema({
  songId: {
    type: String,
    required: true,
    index: {
      name: 'songId-index',
    },
  },
  title: {
    type: String,
    hashKey: true,
    required: true,
  },
  albumUrl: {
    type: String,
    required: false,
  },
  artist: {
    type: String,
    required: false,
  },
  feelings: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  lyric: {
    type: String,
    required: false,
  },
  youtubeUrl: {
    type: String,
    required: false,
  },
  editor_pick: {
    type: String,
    required: false,
    index: {
      name: 'editor_pick-index',
    },
  },
  editor_name: {
    type: String,
    required: false,
  },
});
