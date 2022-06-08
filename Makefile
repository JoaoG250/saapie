setup:
	docker-compose run --rm api setup
migrate:
	docker-compose run --rm api db_setup
