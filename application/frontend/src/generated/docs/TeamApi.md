# TeamApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getTeamPrompts**](#getteamprompts) | **GET** /api/teams/{teamId}/prompts | |
|[**getUserTeamFixedPrompts**](#getuserteamfixedprompts) | **GET** /api/teams/{teamId}/fixed-prompts | |
|[**getUserTeams**](#getuserteams) | **GET** /api/user/teams | |

# **getTeamPrompts**
> GetTeamPrompts200Response getTeamPrompts()

チームメンバーのプロンプト一覧を取得する  ※ チームメンバーもアクセス可能

### Example

```typescript
import {
    TeamApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.getTeamPrompts(
    teamId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **teamId** | [**string**] |  | defaults to undefined|


### Return type

**GetTeamPrompts200Response**

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

# **getUserTeamFixedPrompts**
> GetUserTeamFixedPrompts200Response getUserTeamFixedPrompts()

チームの固定表示プロンプト一覧を取得する（ユーザー用）  ※ チームメンバーもアクセス可能

### Example

```typescript
import {
    TeamApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamApi(configuration);

let teamId: string; // (default to undefined)

const { status, data } = await apiInstance.getUserTeamFixedPrompts(
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

# **getUserTeams**
> GetUserTeams200Response getUserTeams()

ユーザーが所属するチーム一覧を取得する

### Example

```typescript
import {
    TeamApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TeamApi(configuration);

const { status, data } = await apiInstance.getUserTeams();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUserTeams200Response**

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

