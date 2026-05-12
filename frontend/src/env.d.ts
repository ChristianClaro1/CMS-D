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
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_PROFILE_TABLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}