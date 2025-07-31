#!/bin/bash
cd /home/kavia/workspace/code-generation/playpals-childrens-toy--game-marketplace-11/playpals_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

