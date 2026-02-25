# UserApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkUserInfo**](#checkuserinfo) | **GET** /api/check-user-info | |
|[**completeFirstLogin**](#completefirstlogin) | **PUT** /api/first-login | |
|[**getUserInfo**](#getuserinfo) | **GET** /api/userinfo | |
|[**updateDisplayName**](#updatedisplayname) | **PUT** /api/display-name | |
|[**updateProfile**](#updateprofile) | **PUT** /api/profile | |

# **checkUserInfo**
> CheckUserInfo200Response checkUserInfo()

ユーザー情報のチェック

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let recordLogin: boolean; //ログイン履歴を記録するかどうか（ログイン時のみtrue） (optional) (default to undefined)

const { status, data } = await apiInstance.checkUserInfo(
    recordLogin
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recordLogin** | [**boolean**] | ログイン履歴を記録するかどうか（ログイン時のみtrue） | (optional) defaults to undefined|


### Return type

**CheckUserInfo200Response**

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

# **completeFirstLogin**
> CompleteFirstLogin200Response completeFirstLogin(completeFirstLoginRequest)

初回ログイン完了処理

### Example

```typescript
import {
    UserApi,
    Configuration,
    CompleteFirstLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let completeFirstLoginRequest: CompleteFirstLoginRequest; //表示名

const { status, data } = await apiInstance.completeFirstLogin(
    completeFirstLoginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **completeFirstLoginRequest** | **CompleteFirstLoginRequest**| 表示名 | |


### Return type

**CompleteFirstLogin200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserInfo**
> UserResponse getUserInfo()

ユーザー情報を取得

### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.getUserInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponse**

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

# **updateDisplayName**
> UpdateDisplayName200Response updateDisplayName(updateDisplayNameRequest)

表示名を更新する

### Example

```typescript
import {
    UserApi,
    Configuration,
    UpdateDisplayNameRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let updateDisplayNameRequest: UpdateDisplayNameRequest; //表示名

const { status, data } = await apiInstance.updateDisplayName(
    updateDisplayNameRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateDisplayNameRequest** | **UpdateDisplayNameRequest**| 表示名 | |


### Return type

**UpdateDisplayName200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProfile**
> UpdateProfile200Response updateProfile(updateProfileRequest)

プロフィール情報を更新する（姓名・フリガナ・表示名）

### Example

```typescript
import {
    UserApi,
    Configuration,
    UpdateProfileRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let updateProfileRequest: UpdateProfileRequest; //プロフィール情報

const { status, data } = await apiInstance.updateProfile(
    updateProfileRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProfileRequest** | **UpdateProfileRequest**| プロフィール情報 | |


### Return type

**UpdateProfile200Response**

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

