# UpdatePromptRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [default to undefined]
**isGem** | **boolean** |  | [default to undefined]
**startColor** | **string** |  | [default to undefined]
**endColor** | **string** |  | [default to undefined]
**steps** | [**Array&lt;CreateStepData&gt;**](CreateStepData.md) |  | [default to undefined]
**gem** | **string** |  | [default to undefined]
**userId** | **string** |  | [optional] [default to undefined]
**references** | [**Array&lt;CreateReferenceData&gt;**](CreateReferenceData.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UpdatePromptRequest } from './api';

const instance: UpdatePromptRequest = {
    id,
    title,
    description,
    tags,
    isGem,
    startColor,
    endColor,
    steps,
    gem,
    userId,
    references,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
