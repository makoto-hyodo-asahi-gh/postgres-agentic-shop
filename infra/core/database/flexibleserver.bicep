metadata description = 'Creates Azure Flexible Server for Postgresql.'
param name string
param location string = resourceGroup().location
param tags object = {}

param sku object
param storage object

@allowed([
  'Password'
  'EntraOnly'
])
param authType string = 'Password'

param administratorLogin string = 'postgres'
@secure()
param administratorLoginPassword string = ''

@description('Entra admin role name')
param entraAdministratorName string = ''

@description('Entra admin role object ID (in Entra)')
param entraAdministratorObjectId string = ''

@description('Entra admin user type')
@allowed([
  'User'
  'Group'
  'ServicePrincipal'
])
param entraAdministratorType string = 'User'

param zone string = ''
param databaseNames array = []
param allowAzureIPsFirewall bool = false
param allowAllIPsFirewall bool = false
param version string

// Selects the type of authentication to use
var authProperties = authType == 'Password' ? {
  administratorLogin: administratorLogin
  administratorLoginPassword: administratorLoginPassword
  authConfig: {
    passwordAuth: 'Enabled'
    activeDirectoryAuth: 'Disabled'
  }
} : {
  authConfig: {
    activeDirectoryAuth: 'Enabled'
    passwordAuth: 'Disabled'
  }
}

// Creates the PostgreSQL server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  location: location
  tags: tags
  name: name
  sku: sku
  properties: union(authProperties, {
    version: version
    storage: storage
    availabilityZone: zone
    highAvailability: {
      mode: 'Disabled'
    }
  })
  // Creates databases required for the applications
  resource database 'databases' = [for name in databaseNames: {
    name: name
  }]
}

// Creates firewall rule for public access over internet
resource firewall_all 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-11-01-preview' = if (allowAllIPsFirewall) {
  parent: postgresServer
  name: 'allow-all-IPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '255.255.255.255'
  }
}

// Create firewall rule for internal Azure IPs
resource firewall_azure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-11-01-preview' = if (allowAzureIPsFirewall) {
  parent: postgresServer
  name: 'allow-all-azure-internal-IPs'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Creates Azure extensions
resource configurations 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-03-01-preview' = {
  name: 'azure.extensions'
  parent: postgresServer
  properties: {
    value: 'vector, pg_diskann, azure_ai, age'
    source: 'user-override'
  }
  dependsOn: [
     firewall_all, firewall_azure
  ]
}

// Configures Preshared libraries for AGE extension
resource sharedPreloadLibraries 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2023-03-01-preview' = {
  name: 'shared_preload_libraries'
  parent: postgresServer
  properties: {
    value: 'age'
    source: 'user-override'
  }
  dependsOn: [
    configurations
  ]
}

output POSTGRES_DOMAIN_NAME string =  postgresServer.properties.fullyQualifiedDomainName
output POSTGRES_NAME string =  postgresServer.name
