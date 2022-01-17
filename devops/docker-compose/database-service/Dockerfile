FROM mysql:5.7
ADD setup.sql /docker-entrypoint-initdb.d
RUN "--sql-mode='(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''))"
