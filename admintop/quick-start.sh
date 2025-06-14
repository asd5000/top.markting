#!/bin/bash

echo "========================================"
echo "    Top Marketing - Quick Start"
echo "========================================"
echo

echo "[1/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo
echo "[2/4] Checking environment file..."
if [ ! -f .env.local ]; then
    echo "Creating .env.local from example..."
    cp .env.example .env.local
    echo
    echo "WARNING: Please edit .env.local with your Supabase credentials!"
    echo
fi

echo "[3/4] Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "Warning: Type check failed, but continuing..."
fi

echo
echo "[4/4] Starting development server..."
echo
echo "========================================"
echo "    Server will start on:"
echo "    http://localhost:3000"
echo "========================================"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev
