var knex = require('./db');

/*
	With a running postgres server process (postgres -D)
		> For development:
			'node lib/schema.js'
		> For testing:
			'NODE_ENV=test node lib/schema.js'
*/

knex.schema.createTableIfNotExists('users', function (table) {
  table.increments('user_id').primary();
  table.string('username').notNullable().unique();
  table.string('password').notNullable();
  table.string('first_name').notNullable();
  table.string('last_name').notNullable();
  table.string('street_address').notNullable();
  table.string('city').notNullable();
  table.string('state').notNullable();
  table.integer('zipcode').notNullable();
  table.string('phone_number').notNullable();
  table.string('email').notNullable();
  table.string('emergency_contact').notNullable();
  table.string('avatar').notNullable();
})
.createTableIfNotExists('friends', function (table) {
  table.increments('friendship_id').primary();
  table.integer('foreign_friend1').references('user_id').inTable('users').notNullable();
  table.integer('foreign_friend2').references('user_id').inTable('users').notNullable();
})
.createTableIfNotExists('rider', function (table) {
  table.increments('rider_id').primary();
  table.integer('foreign_rider').references('user_id').inTable('users').notNullable();
  table.string('location').notNullable();
  table.timestamp('created_at');
})
.createTableIfNotExists('driver', function (table) {
  table.increments('driver_id').primary();
  table.integer('foreign_driver').references('user_id').inTable('users').notNullable();
  table.string('location').notNullable();
  table.timestamp('created_at');
})
.createTableIfNotExists('rides', function (table) {
  table.increments('ride_id').primary();
  table.integer('foreign_driver').references('foreign_driver').inTable('driver').notNullable();
  table.integer('foreign_rider').references('foreign_rider').inTable('rider').notNullable();
  table.timestamp('created_at');
})
.createTableIfNotExists('car', function (table) {
  table.increments('car_id').primary();
  table.integer('foreign_user').references('user_id').inTable('users').notNullable();
  table.string('make').notNullable();
  table.string('model').notNullable();
  table.string('capacity').notNullable();
  table.string('color').notNullable();
})
.createTableIfNotExists('messages', function (table) {
  table.increments('messages_id').primary();
  table.string('message').notNullable();
  table.timestamp('created_at');
  table.integer('foreign_ride').references('ride_id').inTable('rides').notNullable();
  table.string('author').references('username').inTable('users').notNullable();
})
.then(function (result) {
  console.log('Information Updated Successfully');
})
.catch(function (error) {
  console.log('Warning: Database Error', error);
});

// knex --env development seed:run
