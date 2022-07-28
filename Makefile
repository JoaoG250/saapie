include ./dotenv/build.env

$(eval export $(grep -v '^#' ./dotenv/build.env | xargs))

setup:
	docker compose run --rm api setup
migrate:
	docker compose run --rm api yarn prisma migrate dev
test_watch:
	docker compose run --rm api yarn test:watch
run_checks:
	docker compose run --rm api bash -c "yarn build:noemit && yarn lint && yarn test"
prod_build:
	docker compose -f docker-compose.prod.yml build
prod_setup:
	docker compose -f docker-compose.prod.yml run --rm api setup
prod_start:
	docker compose -f docker-compose.prod.yml up
