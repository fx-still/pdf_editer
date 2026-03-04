export type PdfItem = {
  id: string;
  fileName: string;
  fileSize: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
};

export type PageRange = {
  /** 0-based, inclusive */
  start: number;
  /** 0-based, inclusive */
  end: number;
};

