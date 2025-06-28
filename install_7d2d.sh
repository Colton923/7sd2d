#!/bin/bash
set -e
./steamcmd.sh +force_install_dir ./7d2d-server +login anonymous +app_update 294420 -beta latest_experimental +app_update 294420 -beta latest_experimental validate +quit
