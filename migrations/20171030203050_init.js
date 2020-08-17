const tables = [
  `CREATE TABLE activity (
    id int(10) UNSIGNED NOT NULL,
    headline varchar(255) DEFAULT NULL,
    address varchar(255) DEFAULT NULL,
    latlon longtext,
    description text,
    status int(11) DEFAULT NULL,
    created_at datetime DEFAULT NULL,
    updated_at datetime DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  `CREATE TABLE alert (
    id int(11) NOT NULL,
    person_id int(11) NOT NULL,
    address varchar(256) COLLATE utf8_bin NOT NULL,
    geom polygon DEFAULT NULL,
    radius int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`,

  `CREATE TABLE category (
    category_id int(11) NOT NULL,
    category_name int(32) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  `CREATE TABLE category_activity (
    category_id int(11) NOT NULL,
    activity_id int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  `CREATE TABLE person (
    id int(10) UNSIGNED NOT NULL,
    firstName varchar(36) DEFAULT NULL,
    lastName varchar(36) DEFAULT NULL,
    email varchar(64) DEFAULT NULL,
    status int(11) DEFAULT NULL,
    password varchar(128) DEFAULT NULL,
    admin int(11) DEFAULT 0,
    created_at datetime DEFAULT NULL,
    updated_at datetime DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  `CREATE TABLE person_activity (
    activity_id int(11) NOT NULL,
    person_id int(11) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  // the following row was written inside plan CREATE TABLE, but there's a whole migration about it:
  // jurisdiction varchar(256) COLLATE utf8_bin
  `CREATE TABLE plan (
    id int(11) NOT NULL,
    sent tinyint(4) NOT NULL,
    OBJECTID int(11) NOT NULL,
    PLAN_COUNTY_NAME varchar(256) COLLATE utf8_bin NOT NULL,
    PL_NUMBER varchar(256) COLLATE utf8_bin NOT NULL,
    PL_NAME varchar(256) COLLATE utf8_bin NOT NULL,
    PLAN_CHARACTOR_NAME varchar(256) COLLATE utf8_bin NOT NULL,
    data text COLLATE utf8_bin NOT NULL,
    geom geometry NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`,

  `CREATE TABLE post (
    post_id int(11) NOT NULL,
    post_person_id int(11) NOT NULL,
    post_headline varchar(1024) NOT NULL,
    post_content text NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  `CREATE TABLE sessions (
    sid varchar(255) NOT NULL,
    sess text NOT NULL,
    expired datetime NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
];

const statements = [
  'ALTER TABLE activity ADD PRIMARY KEY (id);',
  'ALTER TABLE alert ADD PRIMARY KEY (id);',
  'ALTER TABLE category ADD PRIMARY KEY (category_id);',
  'ALTER TABLE category_activity ADD PRIMARY KEY (category_id,activity_id);',
  'ALTER TABLE person ADD PRIMARY KEY (id), ADD UNIQUE KEY email (email);',
  'ALTER TABLE person_activity ADD PRIMARY KEY (activity_id,person_id);',
  'ALTER TABLE sessions ADD PRIMARY KEY (sid), ADD KEY sessions_expired_index (expired);',
  'ALTER TABLE activity MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;',
  'ALTER TABLE alert MODIFY id int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;',
  'ALTER TABLE person MODIFY id int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;',
];

exports.up = function(knex) {
  return Promise.all(
    tables.map(table => {
      try {
        return knex.raw(table);
      } catch (e) {
        console.log(e);
      }
    }),
  ).then(
    Promise.all(
      statements.map(statement => {
        try {
          knex.raw(statement);
        } catch (e) {
          console.log(e);
        }
      }),
    ),
  );
};

exports.down = function(knex) {};
