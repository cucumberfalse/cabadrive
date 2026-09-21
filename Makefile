.PHONY: build up down logs stage

# Compose, the capture wrapper, volume names, and the handoff mount all use
# this one cwd-independent identity. An explicitly supplied value still wins.
COMPOSE_PROJECT_NAME ?= cabadrive
export COMPOSE_PROJECT_NAME

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
