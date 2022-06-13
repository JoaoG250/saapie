setup:
	docker-compose run --rm api setup
migrate:
	docker-compose run --rm api yarn prisma migrate dev
test_watch:
	docker-compose run --rm api yarn test:watch
