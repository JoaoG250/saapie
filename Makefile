setup:
	docker compose run --rm api setup
migrate:
	docker compose run --rm api yarn prisma migrate dev
test_watch:
	docker compose run --rm api yarn test:watch
run_checks:
	docker compose run --rm api bash -c "yarn build:noemit && yarn lint && yarn test"
