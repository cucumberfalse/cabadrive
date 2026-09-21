.PHONY: build up down logs stage

build:
	./scripts/capture-legacy-assets.sh
	docker compose build

up:
	docker compose up -d
	@echo "Cabadrive is available at http://localhost:$${CABADRIVE_HOST_PORT:-5173}"

down:
	docker compose down

logs:
	docker compose logs -f cabadrive

stage:
	docker compose run --rm stager
