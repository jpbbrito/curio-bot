#!/bin/bash
git pull --force
docker compose --env-file .env down
docker compose build
docker compose --env-file .env up bot -d