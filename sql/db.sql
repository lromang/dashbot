drop database if exists dashusers;
create database dashusers;

drop user if exists botuser;
create user botuser with password 'test';

grant all privileges on database dashusers to botuser;

\c dashusers;
set role botuser;


/* Tiendas */
drop table if exists organizaciones cascade;
create table organizaciones (
    id serial primary key,
    nombre text,
    RFC text,
    direccion_calle text,
    direccion_numero_int text,
    direccion_numero_ext text,
    direccion_colonia text,
    direccion_localidad text,
    direccion_municipio text,
    direccion_ciudad text,
    direccion_estado text,
    direccion_pais text
);

insert into organizaciones (nombre, direccion_calle, direccion_numero_int, direccion_numero_ext, direccion_colonia,
direccion_localidad, direccion_municipio, direccion_ciudad, direccion_estado, direccion_pais) values
('Organización Prueba','-','-','-','-','-','-','-','Ciudad de México','México');


/* Usuarios */
drop table if exists usuarios cascade;
create table usuarios(
    id serial primary key,
    id_organizacion integer references organizaciones(id),
    usuario text,
    contrasena text,
    email text,
    nombres text,
    apellido_paterno text,
    apellido_materno text,
    rfc text,
    direccion_calle text,
    direccion_numero_int text,
    direccion_numero_ext text,
    direccion_colonia text,
    direccion_localidad text,
    direccion_municipio text,
    direccion_ciudad text,
    direccion_estado text,
    direccion_pais text,
    permiso_tablero boolean,
    permiso_administrador boolean,
    permiso_reportes boolean
);

insert into usuarios ("id_organizacion","usuario","contrasena","nombres","apellido_paterno","apellido_materno","permiso_tablero","permiso_administrador","permiso_reportes") values
(1,'admin','$2a$10$DmxbjTLBYDdcha8qlXpsaOyUqkJ0BAQ3Q4EIyMtr5HLXm6R0gSvbm','Administrador','','', true, true, true);
