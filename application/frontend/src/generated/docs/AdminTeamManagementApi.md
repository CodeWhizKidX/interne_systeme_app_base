# AdminTeamManagementApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addTeamPrompt**](#addteamprompt) | **POST** /api/admin/teams/{teamId}/fixed-prompts | |
|[**createTeam**](#createteam) | **POST** /api/admin/teams | |
|[**deleteTeam**](#deleteteam) | **DELETE** /api/admin/teams/{teamId} | |
|[**deleteTeamPrompt**](#deleteteamprompt) | **DELETE** /api/admin/teams/{teamId}/fixed-prompts/{promptId} | |
|[**getTeamDetail**](#getteamdetail) | **GET** /api/admin/teams/{teamId} | |
|[**getTeamFixedPrompts**](#getteamfixedprompts) | **GET** /api/admin/teams/{teamId}/fixed-prompts | |
|[**getTeamList**](#getteamlist) | **GET** /api/admin/teams | |
|[**reorderTeamPrompts**](#reorderteamprompts) | **PUT** /api/admin/teams/{teamId}/fixed-prompts/reorder | |
|[**updateTeam**](#updateteam) | **PUT** /api/admin/teams/{teamId} | |

# **addTeamPrompt**
> AddTeamPrompt201Response addTeamPrompt(addTeamPromptRequest)

チームに固定表示プロンプトを追加する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration,
    AddTeamPromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)
let addTeamPromptRequest: AddTeamPromptRequest; //

const { status, data } = await apiInstance.addTeamPrompt(
    teamId,
    addTeamPromptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **addTeamPromptRequest** | **AddTeamPromptRequest**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**AddTeamPrompt201Response**

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
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createTeam**
> CreateTeam201Response createTeam(createTeamRequest)

チームを作成する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration,
    CreateTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let createTeamRequest: CreateTeamRequest; //

const { status, data } = await apiInstance.createTeam(
    createTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTeamRequest** | **CreateTeamRequest**|  | |


### Return type

**CreateTeam201Response**

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

# **deleteTeam**
> DeleteTeam200Response deleteTeam()

チームを削除する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteTeam(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**DeleteTeam200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteTeamPrompt**
> DeleteTeamPrompt200Response deleteTeamPrompt()

チームから固定表示プロンプトを削除する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)
let promptId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteTeamPrompt(
    teamId,
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|
| **promptId** | [**string**] |  | defaults to undefined|


### Return type

**DeleteTeamPrompt200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTeamDetail**
> GetTeamDetail200Response getTeamDetail()

チーム詳細を取得する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.getTeamDetail(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**GetTeamDetail200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTeamFixedPrompts**
> GetUserTeamFixedPrompts200Response getTeamFixedPrompts()

チームの固定表示プロンプト一覧を取得する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.getTeamFixedPrompts(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**GetUserTeamFixedPrompts200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**403** | Access Denied |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTeamList**
> GetTeamList200Response getTeamList()

チーム一覧を取得する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

const { status, data } = await apiInstance.getTeamList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetTeamList200Response**

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

# **reorderTeamPrompts**
> ReorderTeamPrompts200Response reorderTeamPrompts(reorderTeamPromptsRequest)

チーム固定表示プロンプトの並び替え（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration,
    ReorderTeamPromptsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)
let reorderTeamPromptsRequest: ReorderTeamPromptsRequest; //

const { status, data } = await apiInstance.reorderTeamPrompts(
    teamId,
    reorderTeamPromptsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reorderTeamPromptsRequest** | **ReorderTeamPromptsRequest**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**ReorderTeamPrompts200Response**

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

# **updateTeam**
> UpdateTeam200Response updateTeam(updateTeamRequest)

チームを更新する（管理者用）

### Example

```typescript
import {
    AdminTeamManagementApi,
    Configuration,
    UpdateTeamRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminTeamManagementApi(configuration);

let teamId: string; // (default to undefined)
let updateTeamRequest: UpdateTeamRequest; //

const { status, data } = await apiInstance.updateTeam(
    teamId,
    updateTeamRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTeamRequest** | **UpdateTeamRequest**|  | |
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**UpdateTeam200Response**

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

