#!/bin/bash

# Run database migrations
npm run db:migrate || {
    echo "Migration failed, trying deployment..."
    npm run db:generate
}

npm run db:studio &

npm run dev