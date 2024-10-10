// datasetsの型を定義
interface Dataset {
  data: number[];
}

interface AssetTrendsData {
  labels: string[];
  datasets: Dataset[];
}

export type { AssetTrendsData }