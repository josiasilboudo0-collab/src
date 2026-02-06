export type UserPlan = 'free' | 'pro';

export interface User {
  uid: string;
  email: string;
  plan: UserPlan;
  created: string;
  ebookCount: number;
  pptCount: number;
  quota: number;
  purchaseIndex: number;
}

export interface ChapterStructure {
  title: string;
  brief: string;
  image_prompt: string;
}
