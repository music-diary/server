import { Prisma } from '@prisma/client';

export const basicEmotionsData: Prisma.EmotionsCreateInput[] = [
  {
    name: 'good',
    label: '좋았어요!',
    order: 0,
  },
  {
    name: 'normal',
    label: '그저그래요',
    order: 1,
  },
  {
    name: 'bad',
    label: '별로였어요',
    order: 2,
  },
];

export const positiveFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  // good
  {
    name: 'happy',
    label: '행복한',
    level: 1,
    order: 0,
  },
  {
    name: 'expected',
    label: '기대하는',
    level: 1,
    order: 1,
  },
  {
    name: 'grateful',
    label: '감사한',
    level: 1,
    order: 2,
  },
  {
    name: 'comfortable',
    label: '편안한',
    level: 1,
    order: 3,
  },
  {
    name: 'relieved',
    label: '후련한',
    level: 1,
    order: 4,
  },
  {
    name: 'nostalgic',
    label: '추억하는',
    level: 1,
    order: 5,
  },
  {
    name: 'overwhelmed',
    label: '벅차오르는',
    level: 1,
    order: 6,
  },
];

export const positiveSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  // good
  // 행복한
  [
    {
      name: 'glad',
      label: '반가운',
      level: 2,
      order: 0,
    },
    {
      name: 'pleased',
      label: '즐거운',
      level: 2,
      order: 1,
    },
    {
      name: 'joyful',
      label: '신나는',
      level: 2,
      order: 2,
    },
    {
      name: 'cheerful',
      label: '발랄한',
      level: 2,
      order: 3,
    },
    {
      name: 'excited',
      label: '설레는',
      level: 2,
      order: 4,
    },
    {
      name: 'beautiful',
      label: '아름다운',
      level: 2,
      order: 5,
    },
  ],
  [
    // 기대하는
    {
      name: 'motivated',
      label: '의욕적인',
      level: 2,
      order: 0,
    },
    {
      name: 'proud',
      label: '뿌듯한',
      level: 2,
      order: 1,
    },
    {
      name: 'hopeful',
      label: '희망찬',
      level: 2,
      order: 2,
    },
    {
      name: 'satisfied',
      label: '충만한',
      level: 2,
      order: 3,
    },
    {
      name: 'shy',
      label: '수줍은',
      level: 2,
      order: 4,
    },
  ],
  // 감사한
  [
    {
      name: 'impressed',
      label: '감격스러운',
      level: 2,
      order: 0,
    },
    {
      name: 'stirring',
      label: '감동적인',
      level: 2,
      order: 1,
    },
    {
      name: 'established',
      label: '존중받는',
      level: 2,
      order: 2,
    },
    {
      name: 'touching',
      label: '뭉클한',
      level: 2,
      order: 3,
    },
    {
      name: 'reliable',
      label: '든든한',
      level: 2,
      order: 4,
    },
    {
      name: 'tearfully',
      label: '눈물나는',
      level: 2,
      order: 5,
    },
  ],
  // 편안한
  [
    {
      name: 'esteemed',
      label: '존중받는',
      level: 2,
      order: 0,
    },
    {
      name: 'satisfactory',
      label: '만족스러운',
      level: 2,
      order: 1,
    },
    {
      name: 'calm',
      label: '차분한',
      level: 2,
      order: 2,
    },
    {
      name: 'steady',
      label: '안정된',
      level: 2,
      order: 3,
    },
    {
      name: 'lazy',
      label: '느긋한',
      level: 2,
      order: 4,
    },
    {
      name: 'drowsy',
      label: '나른한',
      level: 2,
      order: 5,
    },
  ],
  // 후련한
  [
    {
      name: 'lighthearthed',
      label: '홀가분한',
      level: 2,
      order: 0,
    },
    {
      name: 'refreshing',
      label: '청량한',
      level: 2,
      order: 1,
    },
    {
      name: 'cool',
      label: '시원한',
      level: 2,
      order: 2,
    },
    {
      name: 'gratifying',
      label: '통쾌한',
      level: 2,
      order: 3,
    },
    {
      name: 'clean',
      label: '개운한',
      level: 2,
      order: 4,
    },
  ],
  // 추억하는
  [
    {
      name: 'missing',
      label: '그리운',
      level: 2,
      order: 0,
    },
    {
      name: 'fondness',
      label: '애틋한',
      level: 2,
      order: 1,
    },
    {
      name: 'gorgeous',
      label: '아름다운',
      level: 2,
      order: 2,
    },
    {
      name: 'faint',
      label: '아련한',
      level: 2,
      order: 3,
    },
    {
      name: 'soft',
      label: '몽글몽글한',
      level: 2,
      order: 4,
    },
    {
      name: 'precious',
      label: '소중한',
      level: 2,
      order: 5,
    },
  ],
  // 벅차오르는
  [
    {
      name: 'dreaming',
      label: '꿈꾸는',
      level: 2,
      order: 0,
    },
    {
      name: 'optimistic',
      label: '희망찬',
      level: 2,
      order: 1,
    },
    {
      name: 'moving',
      label: '뭉클한',
      level: 2,
      order: 2,
    },
    {
      name: 'overflowed',
      label: '눈물나는',
      level: 2,
      order: 3,
    },
    {
      name: 'nerve',
      label: '용기가득한',
      level: 2,
      order: 4,
    },
    {
      name: 'magnificent',
      label: '황홀한',
      level: 2,
      order: 5,
    },
  ],
];

export const neutralFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  // normal
  {
    name: 'ordinary',
    label: '평범한',
    level: 1,
    order: 0,
  },
  {
    name: 'indifferent',
    label: '무관심한',
    level: 1,
    order: 1,
  },
  {
    name: 'worry',
    label: '고민되는',
    level: 1,
    order: 2,
  },
  {
    name: 'strange',
    label: '묘한',
    level: 1,
    order: 3,
  },
  {
    name: 'amazing',
    label: '신기한',
    level: 1,
    order: 4,
  },
  {
    name: 'reminisce',
    label: '회상하는',
    level: 1,
    order: 5,
  },
];

export const neutralSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  // normal
  [
    // 평범한
    {
      name: 'usual',
      label: '일상적인',
      level: 2,
      order: 0,
    },
    {
      name: 'so-so',
      label: '그저그런',
      level: 2,
      order: 1,
    },
    {
      name: 'composed',
      label: '담담한',
      level: 2,
      order: 2,
    },
    {
      name: 'monotonous',
      label: '단조로운',
      level: 2,
      order: 3,
    },
  ],
  [
    // 무관심한
    {
      name: 'mindless',
      label: '아무생각 없는',
      level: 2,
      order: 0,
    },
    {
      name: 'dry',
      label: '무미건조한',
      level: 2,
      order: 1,
    },
    {
      name: 'space-out',
      label: '멍때리는',
      level: 2,
      order: 2,
    },
    {
      name: 'troublesome',
      label: '귀찮은',
      level: 2,
      order: 3,
    },
  ],
  [
    // 고민되는
    {
      name: 'hesitate',
      label: '주저하는',
      level: 2,
      order: 0,
    },
    {
      name: 'careful',
      label: '조심스러운',
      level: 2,
      order: 1,
    },
    {
      name: 'waver',
      label: '망설이는',
      level: 2,
      order: 2,
    },
    {
      name: 'incomprehension',
      label: '이해가 안되는',
      level: 2,
      order: 3,
    },
  ],
  [
    // 묘한
    {
      name: 'attractable',
      label: '끌리는',
      level: 2,
      order: 0,
    },
    {
      name: 'vague',
      label: '애매한',
      level: 2,
      order: 1,
    },
    {
      name: 'IDGI',
      label: '이해가 안되는',
      level: 2,
      order: 2,
    },
    {
      name: 'confusing',
      label: '아리송한',
      level: 2,
      order: 3,
    },
    {
      name: 'dim',
      label: '아련한',
      level: 2,
      order: 4,
    },
    {
      name: 'chills',
      label: '쎄한',
      level: 2,
      order: 5,
    },
  ],
  [
    // 신기한
    {
      name: 'curious',
      label: '호기심있는',
      level: 2,
      order: 0,
    },
    {
      name: 'inquisitive',
      label: '궁금한',
      level: 2,
      order: 1,
    },
    {
      name: 'drag',
      label: '끌리는',
      level: 2,
      order: 2,
    },
  ],
  [
    // 회상하는
    {
      name: 'look-back',
      label: '뒤돌아보는',
      level: 2,
      order: 0,
    },
    {
      name: 'distant',
      label: '아련한',
      level: 2,
      order: 1,
    },
    {
      name: 'recall',
      label: '추억하는',
      level: 2,
      order: 2,
    },
    {
      name: 'long-for',
      label: '그리운',
      level: 2,
      order: 3,
    },
    {
      name: 'wistful',
      label: '아쉬운',
      level: 2,
      order: 4,
    },
    {
      name: 'numb',
      label: '먹먹한',
      level: 2,
      order: 5,
    },
  ],
];

export const negativeFirstDepthEmotionsData: Prisma.EmotionsCreateInput[] = [
  // bad
  {
    name: 'uncomfortable',
    label: '불편한',
    level: 1,
    order: 0,
  },
  {
    name: 'tired',
    label: '피곤한',
    level: 1,
    order: 1,
  },
  {
    name: 'regrettable',
    label: '미련남은',
    level: 1,
    order: 2,
  },
  {
    name: 'shameful',
    label: '부끄러운',
    level: 1,
    order: 3,
  },
  {
    name: 'absurd',
    label: '황당한',
    level: 1,
    order: 4,
  },
  {
    name: 'sorry',
    label: '미안한',
    level: 1,
    order: 5,
  },
  {
    name: 'sad',
    label: '슬픈',
    level: 1,
    order: 6,
  },
  {
    name: 'depressed',
    label: '우울한',
    level: 1,
    order: 7,
  },
  {
    name: 'angry',
    label: '화나는',
    level: 1,
    order: 8,
  },
  {
    name: 'abomiable',
    label: '혐오스러운',
    level: 1,
    order: 9,
  },
  {
    name: 'fearful',
    label: '두려운',
    level: 1,
    order: 10,
  },
];

export const negativeSecondDepthEmotionsData: Prisma.EmotionsCreateInput[][] = [
  // bad
  [
    // 불편한
    {
      name: 'uneasy',
      label: '불안한',
      level: 2,
      order: 0,
    },
    {
      name: 'nervous',
      label: '초조한',
      level: 2,
      order: 1,
    },
    {
      name: 'tense',
      label: '긴장되는',
      level: 2,
      order: 2,
    },
    {
      name: 'agitated',
      label: '심란한',
      level: 2,
      order: 3,
    },
    {
      name: 'burdensome',
      label: '부담스러운',
      level: 2,
      order: 4,
    },
    {
      name: 'frustrated',
      label: '답답한',
      level: 2,
      order: 5,
    },
    {
      name: 'strained',
      label: '찝찝한',
      level: 2,
      order: 6,
    },
  ],
  [
    // 피곤한
    {
      name: 'fatigued',
      label: '지친',
      level: 2,
      order: 0,
    },
    {
      name: 'messed-up',
      label: '엉망인',
      level: 2,
      order: 1,
    },
    {
      name: 'tough',
      label: '고단한',
      level: 2,
      order: 2,
    },
    {
      name: 'drained',
      label: '탈진한',
      level: 2,
      order: 3,
    },
    {
      name: 'exhausted',
      label: '녹초가 된',
      level: 2,
      order: 4,
    },
  ],
  [
    // 미련남은
    {
      name: 'hurt',
      label: '서운한',
      level: 2,
      order: 0,
    },
    {
      name: 'messy',
      label: '엉망인',
      level: 2,
      order: 1,
    },
    {
      name: 'sloppy',
      label: '질척거리는',
      level: 2,
      order: 2,
    },
    {
      name: 'slimy',
      label: '구질구질한',
      level: 2,
      order: 3,
    },
  ],
  [
    // 부끄러운
    {
      name: 'embarrassing',
      label: '쑥스러운',
      level: 2,
      order: 0,
    },
    {
      name: 'awkward',
      label: '민망한',
      level: 2,
      order: 1,
    },
    {
      name: 'bashful',
      label: '창피한',
      level: 2,
      order: 2,
    },
    {
      name: 'disgraceful',
      label: '수치스러운',
      level: 2,
      order: 3,
    },
    {
      name: 'cringeworthy',
      label: '오글거리는',
      level: 2,
      order: 4,
    },
  ],
  [
    // 황당한
    {
      name: 'ridiculous',
      label: '어이없는',
      level: 2,
      order: 0,
    },
    {
      name: 'baffling',
      label: '당황스러운',
      level: 2,
      order: 1,
    },
    {
      name: 'unfortunate',
      label: '억울한',
      level: 2,
      order: 2,
    },
    {
      name: 'disappointing',
      label: '실망스러운',
      level: 2,
      order: 3,
    },
  ],
  [
    // 미안한
    {
      name: 'regretful',
      label: '후회되는',
      level: 2,
      order: 0,
    },
    {
      name: 'guilty',
      label: '죄책감드는',
      level: 2,
      order: 1,
    },
    {
      name: 'deplorable',
      label: '안타까운',
      level: 2,
      order: 2,
    },
    {
      name: 'deafened',
      label: '먹먹한',
      level: 2,
      order: 3,
    },
  ],
  [
    // 슬픈
    {
      name: 'upset',
      label: '속상한',
      level: 2,
      order: 0,
    },
    {
      name: 'sorrow',
      label: '서러운',
      level: 2,
      order: 1,
    },
    {
      name: 'pitiful',
      label: '안타까운',
      level: 2,
      order: 2,
    },
    {
      name: 'heartbreaking',
      label: '가슴아픈',
      level: 2,
      order: 3,
    },
    {
      name: 'tearful',
      label: '눈물왈칵',
      level: 2,
      order: 4,
    },
    {
      name: 'uncontrollable-tears',
      label: '눈물질질',
      level: 2,
      order: 5,
    },
    {
      name: 'heart-wrenching',
      label: '미어지는',
      level: 2,
      order: 6,
    },
  ],
  [
    // 우울한
    {
      name: 'weary',
      label: '피곤한',
      level: 2,
      order: 0,
    },
    {
      name: 'lethargic',
      label: '무기력한',
      level: 2,
      order: 1,
    },
    {
      name: 'lonely',
      label: '외로운',
      level: 2,
      order: 2,
    },
    {
      name: 'empty',
      label: '공허한',
      level: 2,
      order: 3,
    },
    {
      name: 'apprehensive',
      label: '불안한',
      level: 2,
      order: 4,
    },
    {
      name: 'worn-out',
      label: '힘빠지는',
      level: 2,
      order: 5,
    },
  ],
  [
    // 화나는
    {
      name: 'extremely-angry',
      label: '극대노',
      level: 2,
      order: 0,
    },
    {
      name: 'distressed',
      label: '괴로운',
      level: 2,
      order: 1,
    },
    {
      name: 'irritable',
      label: '짜증나는',
      level: 2,
      order: 2,
    },
    {
      name: 'miserable',
      label: '비참한',
      level: 2,
      order: 3,
    },
    {
      name: 'hopeless',
      label: '절망적인',
      level: 2,
      order: 4,
    },
    {
      name: 'resentful',
      label: '원망스러운',
      level: 2,
      order: 5,
    },
  ],
  [
    // 혐오스러운
    {
      name: 'nasty',
      label: '불쾌한',
      level: 2,
      order: 0,
    },
    {
      name: 'disgusting',
      label: '역겨운',
      level: 2,
      order: 1,
    },
    {
      name: 'vomiting',
      label: '토 나오는',
      level: 2,
      order: 2,
    },
    {
      name: 'swear',
      label: '욕하고 싶은',
      level: 2,
      order: 3,
    },
    {
      name: 'punch',
      label: '한 대 치고 싶은',
      level: 2,
      order: 4,
    },
    {
      name: 'gross',
      label: '징그러운',
      level: 2,
      order: 5,
    },
  ],
  [
    // 두려운
    {
      name: 'weird',
      label: '쎄한',
      level: 2,
      order: 0,
    },
    {
      name: 'dizzying',
      label: '아찔한',
      level: 2,
      order: 1,
    },
    {
      name: 'shocking',
      label: '충격적인',
      level: 2,
      order: 2,
    },
    {
      name: 'creepy',
      label: '소름끼치는',
      level: 2,
      order: 3,
    },
    {
      name: 'horrifying',
      label: '공포스러운',
      level: 2,
      order: 4,
    },
    {
      name: 'dazed',
      label: '정신이 아득한',
      level: 2,
      order: 5,
    },
  ],
];

export const firstDepthsEmotionsData: Prisma.EmotionsCreateInput[][] = [
  [...positiveFirstDepthEmotionsData],
  [...neutralFirstDepthEmotionsData],
  [...negativeFirstDepthEmotionsData],
];

export const secondDepthsEmotionsData: Prisma.EmotionsCreateInput[][][] = [
  [...positiveSecondDepthEmotionsData],
  [...neutralSecondDepthEmotionsData],
  [...negativeSecondDepthEmotionsData],
];
