--
-- PostgreSQL database dump
--

\restrict QPZg9MSnTaYb7eY4npstLrUZXMnu7gLOgGrG3WSGjaz3YV8V5IZ100pyVKoSVBH

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg12+1)
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: winze_database_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO winze_database_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    role character varying(20) DEFAULT 'admin'::character varying
);


ALTER TABLE public.admins OWNER TO winze_database_user;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO winze_database_user;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: blogs; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    excerpt text,
    content text,
    category character varying(100),
    image character varying(500),
    author character varying(100),
    author_role character varying(100),
    read_time integer DEFAULT 5,
    views integer DEFAULT 0,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blogs OWNER TO winze_database_user;

--
-- Name: blogs_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blogs_id_seq OWNER TO winze_database_user;

--
-- Name: blogs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.blogs_id_seq OWNED BY public.blogs.id;


--
-- Name: clicks; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.clicks (
    id integer NOT NULL,
    link_url character varying(255) NOT NULL,
    link_title character varying(255) NOT NULL,
    ip_address character varying(45),
    clicked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clicks OWNER TO winze_database_user;

--
-- Name: clicks_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.clicks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clicks_id_seq OWNER TO winze_database_user;

--
-- Name: clicks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.clicks_id_seq OWNED BY public.clicks.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    job_id integer,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    experience character varying(50),
    current_company character varying(100),
    current_ctc character varying(50),
    notice_period character varying(50),
    cover_letter text,
    resume_url character varying(500),
    status character varying(20) DEFAULT 'pending'::character varying,
    applied_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.job_applications OWNER TO winze_database_user;

--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_applications_id_seq OWNER TO winze_database_user;

--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    department character varying(100),
    location character varying(255),
    type character varying(50) DEFAULT 'Full-time'::character varying,
    experience character varying(50),
    salary character varying(100),
    description text,
    requirements text,
    benefits text,
    status character varying(20) DEFAULT 'active'::character varying,
    deadline date,
    posted_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.jobs OWNER TO winze_database_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO winze_database_user;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    service character varying(255),
    message text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quotes OWNER TO winze_database_user;

--
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotes_id_seq OWNER TO winze_database_user;

--
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- Name: social_links; Type: TABLE; Schema: public; Owner: winze_database_user
--

CREATE TABLE public.social_links (
    id integer NOT NULL,
    platform_name character varying(50) NOT NULL,
    platform_url character varying(255) NOT NULL,
    icon_class character varying(50) NOT NULL,
    color_code character varying(20) NOT NULL,
    display_order integer DEFAULT 0,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.social_links OWNER TO winze_database_user;

--
-- Name: social_links_id_seq; Type: SEQUENCE; Schema: public; Owner: winze_database_user
--

CREATE SEQUENCE public.social_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_links_id_seq OWNER TO winze_database_user;

--
-- Name: social_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: winze_database_user
--

ALTER SEQUENCE public.social_links_id_seq OWNED BY public.social_links.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: blogs id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq'::regclass);


--
-- Name: clicks id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.clicks ALTER COLUMN id SET DEFAULT nextval('public.clicks_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- Name: social_links id; Type: DEFAULT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.social_links ALTER COLUMN id SET DEFAULT nextval('public.social_links_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.admins (id, username, password_hash, created_at, updated_at, role) FROM stdin;
4	admin	$2a$10$kO4cMf02NxvoV/EFyNP7pO86e4jcg9ZzHeQOtIqkXwdlRRSHKo6tW	2026-05-12 06:34:07.502189	2026-05-12 06:34:07.502189	admin
\.


--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.blogs (id, title, slug, excerpt, content, category, image, author, author_role, read_time, views, status, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: clicks; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.clicks (id, link_url, link_title, ip_address, clicked_at) FROM stdin;
182	https://winze-frontend.onrender.com/	Winze - End-to-End Solutions	103.82.209.146	2026-05-12 07:40:06.11677
183	https://winze-frontend.onrender.com/	Winze - End-to-End Solutions	103.82.209.146	2026-05-12 07:40:06.678847
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.job_applications (id, job_id, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url, status, applied_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.jobs (id, title, department, location, type, experience, salary, description, requirements, benefits, status, deadline, posted_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.quotes (id, name, email, phone, service, message, status, created_at) FROM stdin;
\.


--
-- Data for Name: social_links; Type: TABLE DATA; Schema: public; Owner: winze_database_user
--

COPY public.social_links (id, platform_name, platform_url, icon_class, color_code, display_order, is_active, created_at) FROM stdin;
1	LinkedIn	https://www.linkedin.com/company/winze-technologies	faLinkedin	#0077b5	1	1	2026-05-06 10:14:11.312826
2	WhatsApp	https://wa.me/919880010417	faWhatsapp	#25D366	2	1	2026-05-06 10:14:11.312826
3	Facebook	https://www.facebook.com/winzetechnologies	faFacebook	#1877f2	3	1	2026-05-06 10:14:11.312826
4	Instagram	https://www.instagram.com/winzetechnologies	faInstagram	#e4405f	4	1	2026-05-06 10:14:11.312826
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.admins_id_seq', 4, true);


--
-- Name: blogs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.blogs_id_seq', 1, false);


--
-- Name: clicks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.clicks_id_seq', 183, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.quotes_id_seq', 1, false);


--
-- Name: social_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: winze_database_user
--

SELECT pg_catalog.setval('public.social_links_id_seq', 5, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- Name: blogs blogs_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);


--
-- Name: blogs blogs_slug_key; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);


--
-- Name: clicks clicks_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.clicks
    ADD CONSTRAINT clicks_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: social_links social_links_pkey; Type: CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.social_links
    ADD CONSTRAINT social_links_pkey PRIMARY KEY (id);


--
-- Name: idx_applications_applied_at; Type: INDEX; Schema: public; Owner: winze_database_user
--

CREATE INDEX idx_applications_applied_at ON public.job_applications USING btree (applied_at);


--
-- Name: idx_blogs_created_at; Type: INDEX; Schema: public; Owner: winze_database_user
--

CREATE INDEX idx_blogs_created_at ON public.blogs USING btree (created_at);


--
-- Name: idx_jobs_created_at; Type: INDEX; Schema: public; Owner: winze_database_user
--

CREATE INDEX idx_jobs_created_at ON public.jobs USING btree (created_at);


--
-- Name: job_applications job_applications_job_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: winze_database_user
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO winze_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO winze_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO winze_database_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO winze_database_user;


--
-- PostgreSQL database dump complete
--

\unrestrict QPZg9MSnTaYb7eY4npstLrUZXMnu7gLOgGrG3WSGjaz3YV8V5IZ100pyVKoSVBH

