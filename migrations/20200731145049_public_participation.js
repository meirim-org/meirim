
exports.up = function(knex) {
    return knex.schema.createTable('participation', t => {
        t.increments('id').primary();
        t.string('title').notNullable();
        t.string('description');
        t.string('content');
        t.timestamps();
    }).then(() =>
        knex.schema.createTable('improvement', t => {
            t.increments('id').primary();
            t.integer('person_id').unsigned().notNullable().references('person.id');
            t.integer('participation_id').unsigned().notNullable().references('participation.id');
            t.boolean('approved');
            t.timestamp('reviewed').nullable();
            t.string('title').notNullable();
            t.string('description').notNullable();
            t.string('benefits');
            t.string('drawbacks');
            t.timestamps();
        })
    ).then(() =>
        knex.schema.createTable('question', t => {
            t.increments('id').primary();
            t.integer('person_id').unsigned().notNullable().references('person.id');
            t.integer('participation_id').unsigned().notNullable().references('participation.id');
            t.boolean('approved');
            t.timestamp('reviewed').nullable();
            t.string('title').notNullable();
            t.string('description').notNullable();
            t.timestamps();
        })
    ).then(() =>
        knex.schema.createTable('improvement_comment', t => {
            t.increments('id').primary();
            t.integer('person_id').unsigned().notNullable().references('person.id');
            t.integer('improvement_id').unsigned().notNullable().references('improvement.id');
            t.boolean('approved');
            t.timestamp('reviewed').nullable();
            t.string('title').notNullable();
            t.string('description').notNullable();
            t.timestamps();
        })
    ).then(() =>
        knex.schema.createTable('question_comment', t => {
            t.increments('id').primary();
            t.integer('person_id').unsigned().notNullable().references('person.id');
            t.integer('question_id').unsigned().notNullable().references('question.id');
            t.boolean('approved');
            t.timestamp('reviewed').nullable();
            t.string('title').notNullable();
            t.string('description').notNullable();
            t.timestamps();
        })
    );
};

exports.down = function(knex) {
    return knex.schema.dropTable('question_comment').then(() => 
        knex.schema.dropTable('improvement_comment')
    ).then(() =>
        knex.schema.dropTable('question')
    ).then(() =>
        knex.schema.dropTable('improvement')
    ).then(() => 
        knex.schema.dropTable('participation')
    );
};
