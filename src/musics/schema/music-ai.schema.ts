import { Schema } from 'dynamoose';

export const MusicAiSchema = new Schema({
  songId: {
    type: String,
    required: true,
    index: {
      name: 'songId-index',
    },
  },
  editor_pick: {
    type: String,
    required: true,
    index: {
      name: 'editor_pick-index',
    },
  },
  title: {
    type: String,
    hashKey: true,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  editor_name: {
    type: String,
    required: false,
  },
  albumUrl: {
    type: String,
    required: true,
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
  videoId: {
    type: String,
    required: true,
  },
  yt_url: {
    type: String,
    required: true,
  },
});
