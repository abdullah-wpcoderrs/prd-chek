// Global type declarations for CSS imports
declare module "*.css" {
  const content: any;
  export default content;
}

// Additional declarations for other asset types (optional but recommended)
declare module "*.scss" {
  const content: any;
  export default content;
}

declare module "*.sass" {
  const content: any;
  export default content;
}

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}