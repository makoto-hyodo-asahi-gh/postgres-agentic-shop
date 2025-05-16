param postgresqlServerName string
param principalName string
param principalId string
param principalType string = 'ServicePrincipal'
param principalTenantId string = subscription().tenantId

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2024-11-01-preview' existing = {
  name: postgresqlServerName
}

resource addAddUser 'Microsoft.DBforPostgreSQL/flexibleServers/administrators@2022-12-01' = {
  parent: postgresServer
  name: principalId 
  properties: {
    principalType: principalType 
    principalName: principalName 
    tenantId: principalTenantId
  }
}
