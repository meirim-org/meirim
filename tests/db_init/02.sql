CREATE DATABASE IF NOT EXISTS meirim character set UTF8 collate utf8_bin;
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY,',''));
