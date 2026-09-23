.PHONY: build up down logs stage

# The resolver adopts a uniquely provable pre-F051 project on the first
# upgrade. An explicitly supplied COMPOSE_PROJECT_NAME always wins.
resolve_project = $$(./scripts/capture-legacy-assets.sh --resolve-project)

build:
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && ./scripts/capture-legacy-assets.sh
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && docker compose build

up:
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && docker compose up -d
	@echo "Cabadrive is available at http://localhost:$${CABADRIVE_HOST_PORT:-5173}"

down:
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && docker compose down

logs:
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && docker compose logs -f cabadrive

stage:
	@project="$(resolve_project)" && export COMPOSE_PROJECT_NAME="$$project" && docker compose run --rm stager
