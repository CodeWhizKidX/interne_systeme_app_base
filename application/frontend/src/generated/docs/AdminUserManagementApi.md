# AdminUserManagementApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createUser**](#createuser) | **POST** /api/admin/users | |
|[**deleteUser**](#deleteuser) | **DELETE** /api/admin/users | |
|[**getAllUsers**](#getallusers) | **GET** /api/admin/users | |
|[**updateUser**](#updateuser) | **PUT** /api/admin/users | |

# **createUser**
> CreateUser201Response createUser(createUserRequest)

新しいユーザーを作成する（管理者用）

### Example

```typescript
import {
    AdminUserManagementApi,
    Configuration,
    CreateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminUserManagementApi(configuration);

let createUserRequest: CreateUserRequest; //作成するユーザーの詳細データ

const { status, data } = await apiInstance.createUser(
    createUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createUserRequest** | **CreateUserRequest**| 作成するユーザーの詳細データ | |


### Return type

**CreateUser201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUser**
> DeleteUser200Response deleteUser(deleteUserRequest)

ユーザーとその関連データを全て削除する（管理者用）

### Example

```typescript
import {
    AdminUserManagementApi,
    Configuration,
    DeleteUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminUserManagementApi(configuration);

let deleteUserRequest: DeleteUserRequest; //削除するユーザーのメールアドレス

const { status, data } = await apiInstance.deleteUser(
    deleteUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **deleteUserRequest** | **DeleteUserRequest**| 削除するユーザーのメールアドレス | |


### Return type

**DeleteUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllUsers**
> GetAllUsers200Response getAllUsers()

全ユーザー一覧を取得する（管理者用）

### Example

```typescript
import {
    AdminUserManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminUserManagementApi(configuration);

const { status, data } = await apiInstance.getAllUsers();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAllUsers200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**403** | Access Denied |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUser**
> UpdateUser200Response updateUser(updateUserRequest)

既存のユーザーを更新する（管理者用）

### Example

```typescript
import {
    AdminUserManagementApi,
    Configuration,
    UpdateUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminUserManagementApi(configuration);

let updateUserRequest: UpdateUserRequest; //更新するユーザーの詳細データ（originalEmailでユーザーを特定）

const { status, data } = await apiInstance.updateUser(
    updateUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserRequest** | **UpdateUserRequest**| 更新するユーザーの詳細データ（originalEmailでユーザーを特定） | |


### Return type

**UpdateUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

