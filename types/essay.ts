export interface EssayRequest {
  topic: string;
  format: 'bullet' | 'paragraph';
  pages: number;
  handwriting: 'big' | 'small';
}

export interface EssayResponse {
  essay: string;
}
