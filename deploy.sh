#!/bin/bash
docker compose --env-file .env down
docker compose build
docker compose --env-file .env up bot -d