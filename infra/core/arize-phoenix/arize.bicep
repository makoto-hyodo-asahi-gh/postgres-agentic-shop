metadata description = 'Creates Arize Azure Container App.'
param name string
param location string = resourceGroup().location
param tags object = {}

param containerAppsEnvironmentName string
param containerRegistryName string
param exists bool
param identityName string
param serviceName string = 'arize'
param environmentVariables array = []
@secure()
param secrets object

resource webIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

module arize '../host/container-app-arize.bicep' = {
  name: '${serviceName}-container-app-module'
  params: {
    name: name
    location: location
    tags: union(tags, { 'azd-service-name': serviceName })
    identityName: webIdentity.name
    exists: exists
    containerAppsEnvironmentName: containerAppsEnvironmentName
    containerRegistryName: containerRegistryName
    registries: [
      {
        server: '${containerRegistryName}.azurecr.io'
        identity: webIdentity.id
  }]
    env: environmentVariables
    secrets: secrets
    targetPort: 6006
  }
}

output SERVICE_WEB_IDENTITY_PRINCIPAL_ID string = webIdentity.properties.principalId
output SERVICE_WEB_IDENTITY_NAME string = webIdentity.name
output SERVICE_WEB_NAME string = arize.outputs.name
output SERVICE_WEB_URI string = arize.outputs.uri
output SERVICE_WEB_IMAGE_NAME string = arize.outputs.imageName
output SERVICE_WEB_TAG_NAME object = { 'azd-service-name': serviceName }
output uri string = arize.outputs.uri
