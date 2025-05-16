targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name which is used for each resource')
param name string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Id of the user or app to assign application roles')
param principalId string = ''

@minLength(1)
@description('Location for the OpenAI resource supporting Global Standard Deployment type')
// Look for desired models on the availability table:
// https://learn.microsoft.com/azure/ai-services/openai/concepts/models#global-standard-model-availability
@allowed([
  'australiaeast'
  'brazilsouth'
  'canadaeast'
  'eastus'
  'eastus2'
  'francecentral'
  'germanywestcentral'
  'italynorth'
  'japaneast'
  'koreacentral'
  'northcentralus'
  'norwayeast'
  'polandcentral'
  'spaincentral'
  'southafricanorth'
  'southcentralus'
  'southindia'
  'swedencentral'
  'switzerlandnorth'
  'uaenorth'
  'uksouth'
  'westeurope'
  'westus'
  'westus3'
])
@metadata({
  azd: {
    type: 'location'
  }
})
param openAILocation string

@description('Whether to deploy Azure OpenAI resources')
param deployAzureOpenAI bool = true

@allowed([
  'azure'
])
param openAIChatHost string = 'azure'

@allowed([
  'azure'
])
param openAIEmbedHost string = 'azure'

@description('Version of the Azure OpenAI API to use for chat models')
// Check supported versions here
// https://learn.microsoft.com/azure/ai-services/openai/concepts/models#global-standard-model-availability
param azureOpenAIAPIVersion string = '2025-01-01-preview'

@description('Version of the Azure OpenAI API to use for embedding models')
// Check supported version here
// https://learn.microsoft.com/azure/ai-services/openai/concepts/models#global-standard-model-availability
param azureEmbedAIAPIVersion string = '2023-05-15'

@secure()
@description('Azure OpenAI key to be used by resources')
param azureOpenAIKey string = ''

@description('Azure OpenAI endpoint to be used by resources')
param azureOpenAIEndpoint string = ''

// Chat completion model
@description('Name of the chat model to deploy')
param chatModelName string                                // Set in main.parameters.json

@description('Name of the model deployment')
param chatDeploymentName string                           // Set in main.parameters.json

@description('Version of the chat model to deploy')
// See version availability in this table:
// https://learn.microsoft.com/azure/ai-services/openai/concepts/models#global-standard-model-availability
param chatDeploymentVersion string                        // Set in main.parameters.json

@description('Sku of the chat deployment')
param chatDeploymentSku string                            // Set in main.parameters.json

@description('Capacity of the chat deployment')
// You can increase this, but capacity is limited per model/region, check the following for limits
// https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits
param chatDeploymentCapacity int                          // Set in main.parameters.json

// Embedding model
@description('Name of the embedding model to deploy')
param embedModelName string                               // Set in main.parameters.json

@description('Name of the embedding model deployment')
param embedDeploymentName string                          // Set in main.parameters.json

@description('Version of the embedding model to deploy')
// See version availability in this table:
// https://learn.microsoft.com/azure/ai-services/openai/concepts/models#embeddings-models
param embedDeploymentVersion string                       // Set in main.parameters.json

@description('Sku of the embeddings model deployment')
param embedDeploymentSku string                           // Set in main.parameters.json

@description('Capacity of the embedding deployment')
// You can increase this, but capacity is limited per model/region, so you will get errors if you go over
// https://learn.microsoft.com/en-us/azure/ai-services/openai/quotas-limits
param embedDeploymentCapacity int                         // Set in main.parameters.json

@description('Username for the PostgreSQL server')
param administratorLoginUser string                       // Set in main.parameters.json

@secure()
@description('Password for the PostgreSQL server')
param administratorLoginPassword string                   // Set in main.parameters.json

@description('Unique string creation')
var resourceToken = toLower(uniqueString(subscription().id, name, location))

@description('Prefix to be used for all resources')
var prefix = '${toLower(name)}-${resourceToken}'

@description('Tags to be applied to all resources')
var tags = { 'azd-env-name': name }

@description('Check if app exits in the resource group')
param webAppExists bool = false

@description('Name of content filter policy to be created for OpenAI')
param contentFilterPolicyName string = 'rai-policy'

@description('Name of the frontend app')
var frontendAppName = 'rt-frontend'

@description('Name of the identity attached to frontend app')
var frontAppIdentityName = 'id-rt-frontend' 

@description('Name of the backend app')
var backendAppName = 'rt-backend'

@description('Name of the identity attached to backend app')
var backendAppIdentityName = 'id-rt-backend' 

@description('Name of PostgreSQL server')
var postgresServerName = '${prefix}-postgresql'

@description('Name of the Backend app database')
var backendappDatabaseName = 'agentic_shop'

@description('Name of the Arize Phoenix app database')
var arizeDatabaseName = 'arize_db'

var postgresEntraAdministratorObjectId = principalId
var postgresEntraAdministratorType = 'ServicePrincipal'
// var postgresEntraAdministratorName = 'admin${uniqueString(resourcegroup.id, principalId)}'

// Module for Flexible server PostgreSQL
module postgresServer 'core/database/flexibleserver.bicep' = {
  name: 'postgresql'
  params: {
    name: postgresServerName
    location: location
    // certain regions do not support zones
    // please check https://learn.microsoft.com/en-us/azure/reliability/availability-zones-region-support
    zone: ''                   
    tags: tags
    sku: {
      name: 'Standard_D2ds_v4'
      tier: 'GeneralPurpose'
    }
    storage: {
      autoGrow: 'Disabled'
      iops: '3000'
      storageSizeGB: '32'
      throughput: '125'
      tier: 'P20'
      type: 'PremiumV2_LRS'
    }
    version: '16'
    authType: 'Password'
    // entraAdministratorName: postgresEntraAdministratorName
    // entraAdministratorObjectId: postgresEntraAdministratorObjectId
    // entraAdministratorType: postgresEntraAdministratorType
    administratorLogin: administratorLoginUser
    administratorLoginPassword: administratorLoginPassword
    databaseNames: [
      backendappDatabaseName
      arizeDatabaseName
    ]
    allowAzureIPsFirewall: true
    allowAllIPsFirewall: true       // Necessary for post-provision script, can be disabled after
  }
}

// Container apps environment and container registry
module containerApps 'core/host/container-apps-env-registry.bicep' = {
  name: 'container-apps'
  params: {
    name: 'app'
    location: location
    containerAppsEnvironmentName: '${prefix}-containerapps-env'
    containerRegistryName: '${replace(prefix, '-', '')}registry'
  }
}

// Frontend app module
module frontend 'frontend.bicep' = {
  name: 'frontend'
  params: {
    name: frontendAppName
    location: location
    tags: tags
    identityName: frontAppIdentityName
    containerAppsEnvironmentName: containerApps.outputs.environmentName
    containerRegistryName: containerApps.outputs.registryName
    exists: webAppExists
    environmentVariables: frontendEnv
    secrets: secrets
  }
}

// Backend app module
module backend 'backend.bicep' = {
  name: 'backend'
  params: {
    name: backendAppName
    location: location
    tags: tags
    identityName: backendAppIdentityName
    containerAppsEnvironmentName: containerApps.outputs.environmentName
    containerRegistryName: containerApps.outputs.registryName
    exists: webAppExists
    environmentVariables: backendEnv
    secrets: secrets
  }
}

// Arize Phoenix module
module arize 'core/arize-phoenix/arize.bicep' = {
  name: 'arize'
  params: {
    name: 'arize'
    location: location
    tags: tags
    identityName: 'arize-identity'
    containerAppsEnvironmentName: containerApps.outputs.environmentName
    containerRegistryName: containerApps.outputs.registryName
    exists: webAppExists
    environmentVariables: arizeEnv
    secrets: secrets
  }
}

var azureOpenAIKeySecret = !empty(azureOpenAIKey)
  ? {
      'azure-openai-key': azureOpenAIKey
    }
  : {}

var secrets = azureOpenAIKeySecret


// Environment variables for the Backend app
var backendEnv = [
  {
    name: 'DB_HOST'
    value: postgresServer.outputs.POSTGRES_DOMAIN_NAME
  }
  {
    name: 'DB_USER'
    value: administratorLoginUser
  }
  {
    name: 'DB_NAME'
    value: backendappDatabaseName
  }
  {
    name: 'DB_PORT'
    value: '5432'
  }
  {
    name: 'DB_PASSWORD'
    value: administratorLoginPassword
  }
  {
    name: 'APP_VERSION'
    value: '0.1.0'
  }
  {
    name: 'ENVIRONMENT'
    value: 'prod'
  }
  {
    name: 'DB_EMBEDDING_TABLE_FOR_PRODUCTS'
    value: 'embeddings_products'
  }
  {
    name: 'DB_EMBEDDING_TABLE_FOR_REVIEWS'
    value: 'embeddings_reviews'
  }
  {
    name: 'LLM_MODEL'
    value: chatModelName 
  }
  {
    name: 'EMBEDDING_MODEL'
    value: openAIEmbedHost == 'azure' ? embedModelName : ''
  }
  {
    name: 'AZURE_API_VERSION_LLM'
    value: openAIChatHost == 'azure' ? azureOpenAIAPIVersion : ''
  }
  {
    name: 'AZURE_API_VERSION_EMBEDDING_MODEL'
    value: openAIEmbedHost == 'azure' ? azureEmbedAIAPIVersion : ''
  }
  {
    name: 'AZURE_OPENAI_API_KEY'
    value: openAI.outputs.modelInfos[0].key
  }
  {
    name: 'AZURE_OPENAI_ENDPOINT'
    value: openAI.outputs.modelInfos[0].endpoint
  }
  {
    name: 'MEM0_LLM_PROVIDER'
    value: 'azure_openai'
  }
  {
    name: 'MEM0_MEMORY_PROVIDER'
    value: 'pgvector'
  }
  {
    name: 'MEM0_MEMORY_TABLE_NAME'
    value: 'mem0_chatstore'
  }
  {
    name: 'PHOENIX_COLLECTOR_ENDPOINT'
    value: '${arize.outputs.SERVICE_WEB_URI}/v1/traces'
  }
  {
    name: 'PHOENIX_CLIENT_ENDPOINT'
    value: arize.outputs.SERVICE_WEB_URI
  }
  {
    name: 'PHOENIX_PROJECT_NAME'
    value: 'Agentic Shop'
  }
  {
    name: 'SQLALCHEMY_CONNECTION_POOL_SIZE'
    value: '20'
  }
]

// Environment variables for the Arize Phoenix
var arizeEnv = [
  {
    name: 'PHOENIX_SQL_DATABASE_URL'
    value: 'postgresql://${administratorLoginUser}:${administratorLoginPassword}@${postgresServer.outputs.POSTGRES_DOMAIN_NAME}:5432/${arizeDatabaseName}'
  }
]

// Environment variables for the Frontend app
var frontendEnv = [
  {
    name: 'VITE_BE_APP_ENDPOINT'
    value: backend.outputs.SERVICE_WEB_URI
  }
]

@description('Params for the OpenAI deployments')
var modelDeployments = [
  {
  name: chatDeploymentName
  model: {
    format: 'OpenAI'
    name: chatModelName
    version: chatDeploymentVersion
  }
  sku: {
    name: chatDeploymentSku
    capacity: chatDeploymentCapacity
  }
}
{
  name: embedDeploymentName
  model: {
    format: 'OpenAI'
    name: embedModelName
    version: embedDeploymentVersion
  }
  sku: {
    name: embedDeploymentSku
    capacity: embedDeploymentCapacity
  }
}]

// OpenAI module
module openAI 'core/ai/cognitiveservices.bicep' = if (deployAzureOpenAI) {
  name: 'openai'
  params: {
    name: '${prefix}-openai'
    location: openAILocation
    tags: tags
    sku: {
      name: 'S0'
    }
    disableLocalAuth: false
    deployments: modelDeployments
    contentFilterPolicyName: contentFilterPolicyName
  }
}

// Content filter policy for OpenAI models
module raiPolicy 'core/ai/content-filter.bicep' = {
  name: 'raiPolicy'
  params: {
    name: '${prefix}-openai'
    policyName: contentFilterPolicyName
  }
  dependsOn: [
    openAI
  ]
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId

output AZURE_CONTAINER_ENVIRONMENT_NAME string = containerApps.outputs.environmentName
output AZURE_CONTAINER_REGISTRY_ENDPOINT string = containerApps.outputs.registryLoginServer
output AZURE_CONTAINER_REGISTRY_NAME string = containerApps.outputs.registryName

output POSTGRES_HOST string = postgresServer.outputs.POSTGRES_DOMAIN_NAME
output POSTGRES_NAME string = postgresServer.outputs.POSTGRES_NAME
output POSTGRES_USERNAME string = administratorLoginUser
output POSTGRES_DATABASE string = backendappDatabaseName
output POSTGRES_PASSWORD string = administratorLoginPassword

output OPENAI_CHAT_HOST string = openAIChatHost
output OPENAI_EMBED_HOST string = openAIEmbedHost
output AZURE_OPENAI_ENDPOINT string = !empty(azureOpenAIEndpoint)
  ? azureOpenAIEndpoint
  : (deployAzureOpenAI ? openAI.outputs.endpoint : '')
output AZURE_OPENAI_VERSION string = openAIEmbedHost == 'chat' ? azureOpenAIAPIVersion : ''
output AZURE_OPENAI_CHAT_DEPLOYMENT string = deployAzureOpenAI ? chatDeploymentName : ''
output AZURE_OPENAI_CHAT_DEPLOYMENT_VERSION string = deployAzureOpenAI ? chatDeploymentVersion : ''
output AZURE_OPENAI_CHAT_DEPLOYMENT_CAPACITY int = deployAzureOpenAI ? chatDeploymentCapacity : 0
output AZURE_OPENAI_CHAT_DEPLOYMENT_SKU string = deployAzureOpenAI ? chatDeploymentSku : ''
output AZURE_OPENAI_CHAT_MODEL string = deployAzureOpenAI ? chatModelName : ''
output AZURE_OPENAI_EMBED_DEPLOYMENT string = deployAzureOpenAI ? embedDeploymentName : ''
output AZURE_OPENAI_EMBED_DEPLOYMENT_VERSION string = deployAzureOpenAI ? embedDeploymentVersion : ''
output AZURE_OPENAI_EMBED_DEPLOYMENT_CAPACITY int = deployAzureOpenAI ? embedDeploymentCapacity : 0
output AZURE_OPENAI_EMBED_DEPLOYMENT_SKU string = deployAzureOpenAI ? embedDeploymentSku : ''
output AZURE_OPENAI_EMBED_MODEL string = deployAzureOpenAI ? embedModelName : ''

output SERVICE_BACKEND_IDENTITY_PRINCIPAL_ID string = backend.outputs.SERVICE_WEB_IDENTITY_PRINCIPAL_ID
output SERVICE_BACKEND_IDENTITY_NAME string = backend.outputs.SERVICE_WEB_IDENTITY_NAME
output SERVICE_BACKEND_NAME string = backend.outputs.SERVICE_WEB_NAME
output SERVICE_BACKEND_URI string = backend.outputs.SERVICE_WEB_URI
output SERVICE_BACKEND_IMAGE_NAME string = backend.outputs.SERVICE_WEB_IMAGE_NAME

output SERVICE_ARIZE_URI string = arize.outputs.SERVICE_WEB_URI

output SERVICE_FRONTEND_IDENTITY_PRINCIPAL_ID string = frontend.outputs.SERVICE_WEB_IDENTITY_PRINCIPAL_ID
output SERVICE_FRONTEND_IDENTITY_NAME string = frontend.outputs.SERVICE_WEB_IDENTITY_NAME
output SERVICE_FRONTEND_NAME string = frontend.outputs.SERVICE_WEB_NAME
output SERVICE_FRONTEND_URI string = frontend.outputs.SERVICE_WEB_URI
output SERVICE_FRONTEND_IMAGE_NAME string = frontend.outputs.SERVICE_WEB_IMAGE_NAME
