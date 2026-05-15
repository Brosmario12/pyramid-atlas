export type Pyramid = {
  id: string;
  name: string;
  country: string;
  region: string;
  civilization: string;
  period: string;
  latitude: number;
  longitude: number;
  elevationMeters: number | null;
  heightMeters: number | null;
  sourceUrl: string;
  imageUrl: string;
  updatedAt: string;
};

export type PyramidDistance = {
  fromId: string;
  toId: string;
  kilometers: number;
};
