# ShareMessageApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createShareMessage**](#createsharemessage) | **POST** /api/share-messages | |
|[**getShareMessages**](#getsharemessages) | **GET** /api/share-requests/{shareRequestId}/messages | |

# **createShareMessage**
> CreateShareMessage201Response createShareMessage(createShareMessageRequest)

メッセージを作成する

### Example

```typescript
import {
    ShareMessageApi,
    Configuration,
    CreateShareMessageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareMessageApi(configuration);

let createShareMessageRequest: CreateShareMessageRequest; //

const { status, data } = await apiInstance.createShareMessage(
    createShareMessageRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createShareMessageRequest** | **CreateShareMessageRequest**|  | |


### Return type

**CreateShareMessage201Response**

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

# **getShareMessages**
> GetShareMessages200Response getShareMessages()

共有申請に紐づくメッセージ一覧を取得する

### Example

```typescript
import {
    ShareMessageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ShareMessageApi(configuration);

let shareRequestId: number; // (default to undefined)

const { status, data } = await apiInstance.getShareMessages(
    shareRequestId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **shareRequestId** | [**number**] |  | defaults to undefined|


### Return type

**GetShareMessages200Response**

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
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

