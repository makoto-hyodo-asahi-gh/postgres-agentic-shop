metadata description = 'Creates an Azure Cognitive Services instance.'
param name string

@description('Name of the policy to be created')
param policyName string

@allowed(['Asynchronous_filter', 'Blocking', 'Default', 'Deferred'])
param mode string = 'Default'

@description('Base policy to be used for the new policy')
param basePolicyName string = 'Microsoft.DefaultV2'

param contentFilters array = [
  {
      name: 'Violence'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Prompt'
  }
  {
      name: 'Hate'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Prompt'
  }
  {
      name: 'Sexual'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Prompt'
  }
  {
      name: 'Selfharm'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Prompt'
  }
  {
      name: 'Jailbreak'
      blocking: false
      enabled: false
      source: 'Prompt'
  }
  {
      name: 'Indirect Attack'
      blocking: false
      enabled: false
      source: 'Prompt'
  }
  {
      name: 'Profanity'
      blocking: true
      enabled: true
      source: 'Prompt'
  }
  {
      name: 'Violence'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Completion'
  }
  {
      name: 'Hate'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Completion'
  }
  {
      name: 'Sexual'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Completion'
  }
  {
      name: 'Selfharm'
      severityThreshold: 'High'
      blocking: true
      enabled: true
      source: 'Completion'
  }
  {
      name: 'Protected Material Text'
      blocking: false
      enabled: false
      source: 'Completion'
  }
  {
      name: 'Protected Material Code'
      blocking: false
      enabled: false
      source: 'Completion'
  }
  {
      name: 'Profanity'
      blocking: true
      enabled: true
      source: 'Completion'
  }
]

resource raiPolicy 'Microsoft.CognitiveServices/accounts/raiPolicies@2024-06-01-preview' = {
    name: '${name}/${policyName}'
    properties: {
        mode: mode
        basePolicyName: basePolicyName
        contentFilters: contentFilters
    }
}
