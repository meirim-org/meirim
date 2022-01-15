FROM mysql:5.7.0

ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_DATABASE meirim
ENV MYSQL_USER root
ENV MYSQL_PASSWORD password

ADD setup.sql /docker-entrypoint-initdb.d
