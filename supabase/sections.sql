create table if not exists public.sections (
  section_id text primary key,
  course_id text not null references public.courses(course_id) on delete cascade,
  section text not null,
  section_capacity integer not null default 0,
  enrolled_count integer not null default 0,
  room text,
  schedule text,
  semester text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, section, semester)
);

create index if not exists sections_course_id_idx on public.sections(course_id);
create index if not exists sections_semester_idx on public.sections(semester);
