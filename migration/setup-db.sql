create type doc_status as enum ('APPROVED', 'APPROVED_WITH_COMMENT', 'NOT_APPROVED','WAITING_FOR_APPROVAL','CANCELLED','RECALLED');

create table transmittal (
    id uuid primary key default gen_random_uuid(),
    tr_number varchar(10) not null unique,
    submit_date date not null,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

create table document (
    id uuid primary key default gen_random_uuid(),
    transmittal_id uuid
        not null
        references transmittal(id)
        on delete cascade,
    document_name varchar(255) not null,
    document_number varchar(100),
    rev int
        default 0
        check (rev >= 0),
    status doc_status
        not null
        default 'WAITING_FOR_APPROVAL',
    return_date date,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);