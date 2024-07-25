import { Schema } from 'dynamoose';

export const MusicSchema = new Schema({
  songId: {
    type: String,
    required: true,
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
  editor: {
    type: String,
    required: false,
  },
});
