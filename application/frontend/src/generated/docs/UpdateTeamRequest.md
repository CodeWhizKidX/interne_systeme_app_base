# UpdateTeamRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**memberIds** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**members** | [**Array&lt;TeamMemberInfo&gt;**](TeamMemberInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateTeamRequest } from './api';

const instance: UpdateTeamRequest = {
    name,
    description,
    memberIds,
    members,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
