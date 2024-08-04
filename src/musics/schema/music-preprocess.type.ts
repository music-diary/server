export interface MusicPreprocessKey {
  title: string;
  songId: string;
}

export interface MusicPreprocessModel extends MusicPreprocessKey {
  songId: string;
  title: string;
  albumUrl?: string;
  artist?: string;
  feelings: string;
  genre: string;
  lyric?: string;
  editor_pick?: string;
  editor_name?: string;
  videoId?: string;
  yt_url?: string;
}
