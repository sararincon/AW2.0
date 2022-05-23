--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: sararincon
--

CREATE TABLE public.usuarios (
    nombre character varying(25),
    rut character varying(25),
    curso character varying(25),
    nivel character varying(25),
    uuid character varying(25)
);


ALTER TABLE public.usuarios OWNER TO sararincon;

--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: sararincon
--

COPY public.usuarios (nombre, rut, curso, nivel, uuid) FROM stdin;
Synyster Gates	12345243	Guitarra	Experto	f9ec8f
\.


--
-- PostgreSQL database dump complete
--

