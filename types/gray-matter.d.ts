declare module 'gray-matter' {
  interface GrayMatterOption {
    excerpt?: boolean | ((file: any, options: any) => void);
    excerpt_separator?: string;
    engines?: {
      [key: string]: (str: string) => any;
    };
    language?: string;
    delimiters?: string | [string, string];
  }

  interface GrayMatterFile<T = any> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language?: string;
  }

  function matter<T = any>(
    input: string | Buffer,
    options?: GrayMatterOption
  ): GrayMatterFile<T>;

  export = matter;
} 