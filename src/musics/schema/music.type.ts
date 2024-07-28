export interface MusicKey {
  title: string;
  songId: string;
  editor_pick?: string;
}

export interface MusicModel extends MusicKey {
  songId: string;
  title: string;
  albumUrl?: string;
  artist?: string;
  feelings: string;
  genre: string;
  lyric?: string;
  youtubeUrl?: string;
  editor_pick?: string;
  editor_name?: string;
}
