#!/usr/bin/env pwsh
param()

# Fail on any error
$ErrorActionPreference = 'Stop'

# Read environment variables
$serverName       = azd env get-value POSTGRES_NAME
$databaseName     = azd env get-value POSTGRES_DATABASE
$adminUser        = azd env get-value POSTGRES_USERNAME
$adminPassword    = azd env get-value POSTGRES_PASSWORD

# Create pgvector extension
az postgres flexible-server execute `
  --name "$serverName" `
  --database-name "$databaseName" `
  --admin-user "$adminUser" `
  --admin-password "$adminPassword" `
  --file-path "$PSScriptRoot/../scripts/create-extension.sql"