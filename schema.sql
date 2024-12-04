CREATE DATABASE "paws-plans-db"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

CREATE TABLE public.users
(
user_id serial NOT NULL,
login character varying(40) NOT NULL,
email character varying(64) NOT NULL,
pass character varying(300) NOT NULL,
level_id serial NOT NULL,
score integer NOT NULL DEFAULT 0,
money integer NOT NULL DEFAULT 0,
mood integer NOT NULL DEFAULT 90,
PRIMARY KEY(user_id),
UNIQUE(user_id,login,email),
    FOREIGN KEY (level_id)
        REFERENCES public.levels (levels_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

CREATE TABLE public.levels
(
    levels_id serial NOT NULL,
    level_top integer NOT NULL DEFAULT 0,
    PRIMARY KEY (levels_id),
    UNIQUE (levels_id, level_top)
);

ALTER TABLE IF EXISTS public.levels
    OWNER to postgres;


CREATE TABLE public.habbities
(
    habbit_id serial NOT NULL,
    name character varying(40) NOT NULL,
    is_positive bigint NOT NULL,
    user_id serial NOT NULL,
    times integer NOT NULL DEFAULT 0,
    PRIMARY KEY (habbit_id),
    UNIQUE (habbit_id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.habbities
    OWNER to postgres;

ALTER TABLE IF EXISTS public.users
    ADD FOREIGN KEY (level_id)
    REFERENCES public.levels (levels_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


CREATE TABLE public.tasks
(
    task_id serial NOT NULL,
    name character varying(40) NOT NULL,
    user_id serial NOT NULL,
    is_done boolean NOT NULL DEFAULT false,
    PRIMARY KEY (task_id),
    UNIQUE (task_id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.tasks
    OWNER to postgres;


CREATE TABLE public.dailies
(
    daily_id serial NOT NULL,
    name character varying(40) NOT NULL,
    repeatability_id serial NOT NULL,
    user_id serial NOT NULL,
    is_done boolean NOT NULL DEFAULT false,
    PRIMARY KEY (daily_id),
    UNIQUE (daily_id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);

ALTER TABLE IF EXISTS public.dailies
    OWNER to postgres;


CREATE TABLE public.repeatabilities
(
    repeatability_id serial NOT NULL,
    name character varying(40) NOT NULL,
    "time" integer NOT NULL,
    last_repeat date,
    PRIMARY KEY (repeatability_id),
    UNIQUE (repeatability_id)
);

ALTER TABLE IF EXISTS public.repeatabilities
    OWNER to postgres;


ALTER TABLE IF EXISTS public.dailies
    ADD UNIQUE (daily_id);
ALTER TABLE IF EXISTS public.dailies
    ADD FOREIGN KEY (repeatability_id)
    REFERENCES public.repeatabilities (repeatability_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


ALTER TABLE IF EXISTS public.habbities DROP COLUMN IF EXISTS is_positive;

ALTER TABLE IF EXISTS public.habbities
    ADD COLUMN is_positive boolean NOT NULL;


INSERT INTO public.levels(level_top)
	VALUES (0);

INSERT INTO public.levels(level_top)
	VALUES (500),(800),(1000),(2000);

INSERT INTO public.users(
	login, email, pass, level_id)
	VALUES ('sasha','saha@m.r', '12345', 1);

INSERT INTO public.users(
	login, email, pass, level_id,score, money, mood)
	VALUES ('tom','tom@m.r', '544321', 4, 1200, 80, 96 );


ALTER TABLE IF EXISTS public.users
    ADD COLUMN user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass);

UPDATE public.users
    SET score=800
    WHERE user_id = 2


INSERT INTO dailies(
		 name , repeatability_id, user_id, is_done)
	VALUES ('полить цветы', 2, 2 , true);



INSERT INTO repeatabilities(
		 name, time)
	VALUES ('1 week', 60*60*24*7);



INSERT INTO tasks(
		 name,is_done,user_id)
	VALUES ('дз по математике', true, 1),('убраться в комнате', false, 2); 



INSERT INTO habbities(
		  name , is_positive, times, user_id)
	VALUES ('5 отжиманий', true, 100, 1),('более часа игры', false, 10, 2);

ALTER TABLE IF EXISTS public.users
    RENAME pass TO password;