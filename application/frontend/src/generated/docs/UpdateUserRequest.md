# UpdateUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**originalEmail** | **string** |  | [default to undefined]
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**firstNameKana** | **string** |  | [default to undefined]
**lastNameKana** | **string** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**authority** | [**UserAuthority**](UserAuthority.md) |  | [default to undefined]
**status** | [**UserStatus**](UserStatus.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UpdateUserRequest } from './api';

const instance: UpdateUserRequest = {
    originalEmail,
    firstName,
    lastName,
    firstNameKana,
    lastNameKana,
    email,
    authority,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
