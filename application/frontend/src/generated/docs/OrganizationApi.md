# OrganizationApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getOrganizationInfo**](#getorganizationinfo) | **GET** /api/organization/info | |
|[**updateOrganizationInfo**](#updateorganizationinfo) | **PUT** /api/organization/info | |

# **getOrganizationInfo**
> GetOrganizationInfo200Response getOrganizationInfo()

現在のテナントの組織情報を取得 ※ 管理者権限チェックはミドルウェアで実施済み

### Example

```typescript
import {
    OrganizationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationApi(configuration);

const { status, data } = await apiInstance.getOrganizationInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetOrganizationInfo200Response**

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

# **updateOrganizationInfo**
> UpdateOrganizationInfo200Response updateOrganizationInfo(updateOrganizationRequest)

組織情報を更新 ※ globalAdminのみ更新可能（追加の権限チェックが必要）

### Example

```typescript
import {
    OrganizationApi,
    Configuration,
    UpdateOrganizationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrganizationApi(configuration);

let updateOrganizationRequest: UpdateOrganizationRequest; //

const { status, data } = await apiInstance.updateOrganizationInfo(
    updateOrganizationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateOrganizationRequest** | **UpdateOrganizationRequest**|  | |


### Return type

**UpdateOrganizationInfo200Response**

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

