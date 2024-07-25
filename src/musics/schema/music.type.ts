export interface MusicKey {
  title: string;
}

export interface MusicModel extends MusicKey {
  songId: string;
  albumUrl?: string;
  artist?: string;
  feelings: string;
  genre: string;
  lyric?: string;
  youtubeUrl?: string;
  editor?: string;
}
