ALTER TABLE `users` ADD `last_visited_channel_id` integer REFERENCES channels(id);