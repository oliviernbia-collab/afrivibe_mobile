export interface PostMedia {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnailUrl: string | null;
}

export interface FeedPost {
  id: string;
  userId: string;
  text: string | null;
  hashtags: string[] | null;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isBoosted: boolean;
  createdAt: string;
  media: PostMedia[];
}

export interface Vibe {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  durationSeconds: number;
  viewsCount: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  pendingBalance: string;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: string;
  status: string;
  amount: string;
  balanceAfter: string;
  createdAt: string;
}

export interface GiftCatalogItem {
  id: string;
  code: string;
  name: string;
  icon: string;
  priceFeed: string;
  priceVibes: string;
  priceLive: string;
}
