declare module '*.css'
declare module '*.scss'
declare module '*.less'
declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}