export interface MusicAiKey {
  title: string;
  songId: string;
  editor_pick: string;
}

export interface MusicAiModel extends MusicAiKey {
  songId: string;
  title: string;
  artist: string;
  editor_name: string;
  editor_pick: string;
  albumUrl: string;
  feelings: string;
  genre: string;
  lyric: string;
  videoId: string;
  yt_url: string;
}
