# ShareRequestApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createShareRequest**](#createsharerequest) | **POST** /api/share-requests | |
|[**getAllShareRequests**](#getallsharerequests) | **GET** /api/admin/share-requests/all | |
|[**getPendingShareRequests**](#getpendingsharerequests) | **GET** /api/admin/share-requests | |
|[**getUserShareRequests**](#getusersharerequests) | **GET** /api/share-requests | |
|[**updateShareRequestStatus**](#updatesharerequeststatus) | **PUT** /api/admin/share-requests/{shareRequestId}/status | |

# **createShareRequest**
> CreateShareRequest201Response createShareRequest(createShareRequestRequest)

共有申請を作成する

### Example

```typescript
import {
    ShareRequestApi,
    Configuration,
    CreateShareRequestRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareRequestApi(configuration);

let createShareRequestRequest: CreateShareRequestRequest; //

const { status, data } = await apiInstance.createShareRequest(
    createShareRequestRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createShareRequestRequest** | **CreateShareRequestRequest**|  | |


### Return type

**CreateShareRequest201Response**

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

# **getAllShareRequests**
> GetUserShareRequests200Response getAllShareRequests()

管理者用：全ての共有申請一覧を取得する（ステータスフィルター付き）

### Example

```typescript
import {
    ShareRequestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareRequestApi(configuration);

let status: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllShareRequests(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | (optional) defaults to undefined|


### Return type

**GetUserShareRequests200Response**

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

# **getPendingShareRequests**
> GetUserShareRequests200Response getPendingShareRequests()

管理者用：申請中の共有申請一覧を取得する

### Example

```typescript
import {
    ShareRequestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareRequestApi(configuration);

const { status, data } = await apiInstance.getPendingShareRequests();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserShareRequests200Response**

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

# **getUserShareRequests**
> GetUserShareRequests200Response getUserShareRequests()

ユーザーの共有申請一覧を取得する

### Example

```typescript
import {
    ShareRequestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareRequestApi(configuration);

const { status, data } = await apiInstance.getUserShareRequests();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserShareRequests200Response**

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

# **updateShareRequestStatus**
> UpdateShareRequestStatus200Response updateShareRequestStatus(updateShareRequestStatusRequest)

共有申請のステータスを更新する（承認/拒否）

### Example

```typescript
import {
    ShareRequestApi,
    Configuration,
    UpdateShareRequestStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareRequestApi(configuration);

let shareRequestId: number; // (default to undefined)
let updateShareRequestStatusRequest: UpdateShareRequestStatusRequest; //

const { status, data } = await apiInstance.updateShareRequestStatus(
    shareRequestId,
    updateShareRequestStatusRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateShareRequestStatusRequest** | **UpdateShareRequestStatusRequest**|  | |
| **shareRequestId** | [**number**] |  | defaults to undefined|


### Return type

**UpdateShareRequestStatus200Response**

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

