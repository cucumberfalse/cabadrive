.PHONY: build up down logs

build:
	docker compose build

up:
	docker compose up -d
	@echo "Cabadrive is available at http://localhost:$${CABADRIVE_HOST_PORT:-5173}"

down:
	docker compose down

logs:
	docker compose logs -f cabadrive
