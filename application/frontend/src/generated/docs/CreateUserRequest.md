# CreateUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**firstNameKana** | **string** |  | [default to undefined]
**lastNameKana** | **string** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**authority** | [**UserAuthority**](UserAuthority.md) |  | [default to undefined]
**status** | [**UserStatus**](UserStatus.md) |  | [optional] [default to undefined]

## Example

```typescript
import { CreateUserRequest } from './api';

const instance: CreateUserRequest = {
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
