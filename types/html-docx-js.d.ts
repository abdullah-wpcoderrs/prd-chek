declare module 'html-docx-js/dist/html-docx' {
  interface HtmlDocxOptions {
    orientation?: 'portrait' | 'landscape';
    margins?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  }

  interface HtmlDocx {
    asBlob(html: string, options?: HtmlDocxOptions): Blob;
  }

  const htmlDocx: HtmlDocx;
  export default htmlDocx;
}
