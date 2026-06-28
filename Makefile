COMPOSE_DEV = docker compose --env-file=./server/.env -f docker-compose-dev.yml -p plsfix-dev

# Targets
.PHONY: up-dev down-dev

## Start development environment
up-dev:
	$(COMPOSE_DEV) down --remove-orphans
	$(COMPOSE_DEV) up -d

## Stop development environment
down-dev:
	$(COMPOSE_DEV) down