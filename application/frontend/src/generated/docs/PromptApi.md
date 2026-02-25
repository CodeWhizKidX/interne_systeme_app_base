# PromptApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPrompt**](#createprompt) | **POST** /api/prompts | |
|[**deletePrompt**](#deleteprompt) | **DELETE** /api/prompts/{promptId} | |
|[**getAllPromptsForAdmin**](#getallpromptsforadmin) | **GET** /api/admin/prompts | |
|[**getAllSharedPromptsForAdmin**](#getallsharedpromptsforadmin) | **GET** /api/admin/shared-prompts | |
|[**getPromptDetail**](#getpromptdetail) | **GET** /api/prompts/{promptId} | |
|[**getPromptList**](#getpromptlist) | **GET** /api/prompts | |
|[**getSharedPromptDetail**](#getsharedpromptdetail) | **GET** /api/shared-prompts/{sharedPromptId} | |
|[**getSharedPrompts**](#getsharedprompts) | **GET** /api/shared-prompts | |
|[**reorderSharedPrompts**](#reordersharedprompts) | **PUT** /api/admin/shared-prompts/reorder | |
|[**updatePrompt**](#updateprompt) | **PUT** /api/prompts/{promptId} | |
|[**updatePromptVisibility**](#updatepromptvisibility) | **PUT** /api/prompts/{promptId}/visibility | |
|[**updateSharedPromptVisibility**](#updatesharedpromptvisibility) | **PUT** /api/admin/shared-prompts/{sharedPromptId}/visibility | |

# **createPrompt**
> CreatePrompt201Response createPrompt(createPromptRequest)

新しいプロンプトを作成し、データベースに保存する

### Example

```typescript
import {
    PromptApi,
    Configuration,
    CreatePromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let createPromptRequest: CreatePromptRequest; //作成するプロンプトの詳細データ

const { status, data } = await apiInstance.createPrompt(
    createPromptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPromptRequest** | **CreatePromptRequest**| 作成するプロンプトの詳細データ | |


### Return type

**CreatePrompt201Response**

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

# **deletePrompt**
> DeletePrompt200Response deletePrompt()

特定のプロンプトをデータベースから完全に削除する

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let promptId: string; //削除したいプロンプトのID (default to undefined)

const { status, data } = await apiInstance.deletePrompt(
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**string**] | 削除したいプロンプトのID | defaults to undefined|


### Return type

**DeletePrompt200Response**

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

# **getAllPromptsForAdmin**
> GetAllPromptsForAdmin200Response getAllPromptsForAdmin()

管理者用：全ユーザーのプロンプト一覧を取得 ※ 管理者権限チェックはミドルウェアで実施済み

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

const { status, data } = await apiInstance.getAllPromptsForAdmin();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAllPromptsForAdmin200Response**

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

# **getAllSharedPromptsForAdmin**
> GetAllPromptsForAdmin200Response getAllSharedPromptsForAdmin()

管理者用：全ての共有プロンプト一覧を取得 ※ 管理者権限チェックはミドルウェアで実施済み

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

const { status, data } = await apiInstance.getAllSharedPromptsForAdmin();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAllPromptsForAdmin200Response**

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

# **getPromptDetail**
> GetPromptDetail200Response getPromptDetail()

特定のプロンプトの詳細情報を取得

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let promptId: number; //取得したいプロンプトのID (default to undefined)

const { status, data } = await apiInstance.getPromptDetail(
    promptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **promptId** | [**number**] | 取得したいプロンプトのID | defaults to undefined|


### Return type

**GetPromptDetail200Response**

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

# **getPromptList**
> GetPromptList200Response getPromptList()

ログインユーザーに紐づくプロンプトの一覧を取得

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

const { status, data } = await apiInstance.getPromptList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetPromptList200Response**

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

# **getSharedPromptDetail**
> GetPromptDetail200Response getSharedPromptDetail()

共有プロンプトの詳細情報を取得する

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let sharedPromptId: number; //取得したい共有プロンプトのID (default to undefined)

const { status, data } = await apiInstance.getSharedPromptDetail(
    sharedPromptId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sharedPromptId** | [**number**] | 取得したい共有プロンプトのID | defaults to undefined|


### Return type

**GetPromptDetail200Response**

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

# **getSharedPrompts**
> GetPromptList200Response getSharedPrompts()

一般ユーザー用：社内プロンプト一覧を取得（isVisible=trueのみ）

### Example

```typescript
import {
    PromptApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

const { status, data } = await apiInstance.getSharedPrompts();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetPromptList200Response**

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

# **reorderSharedPrompts**
> ReorderSharedPrompts200Response reorderSharedPrompts(reorderSharedPromptsRequest)

管理者用：共有プロンプトの並び替え ※ 管理者権限チェックはミドルウェアで実施済み

### Example

```typescript
import {
    PromptApi,
    Configuration,
    ReorderSharedPromptsRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let reorderSharedPromptsRequest: ReorderSharedPromptsRequest; //

const { status, data } = await apiInstance.reorderSharedPrompts(
    reorderSharedPromptsRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reorderSharedPromptsRequest** | **ReorderSharedPromptsRequest**|  | |


### Return type

**ReorderSharedPrompts200Response**

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

# **updatePrompt**
> UpdatePrompt200Response updatePrompt(updatePromptRequest)

既存のプロンプトを更新する

### Example

```typescript
import {
    PromptApi,
    Configuration,
    UpdatePromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let promptId: string; //更新対象のプロンプトID (URLパスから取得) (default to undefined)
let updatePromptRequest: UpdatePromptRequest; //更新するプロンプトの詳細データ

const { status, data } = await apiInstance.updatePrompt(
    promptId,
    updatePromptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptRequest** | **UpdatePromptRequest**| 更新するプロンプトの詳細データ | |
| **promptId** | [**string**] | 更新対象のプロンプトID (URLパスから取得) | defaults to undefined|


### Return type

**UpdatePrompt200Response**

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

# **updatePromptVisibility**
> UpdatePromptVisibility200Response updatePromptVisibility(updatePromptVisibilityRequest)

プロンプトの表示/非表示を更新する

### Example

```typescript
import {
    PromptApi,
    Configuration,
    UpdatePromptVisibilityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let promptId: string; //更新対象のプロンプトID (URLパスから取得) (default to undefined)
let updatePromptVisibilityRequest: UpdatePromptVisibilityRequest; //表示/非表示の状態

const { status, data } = await apiInstance.updatePromptVisibility(
    promptId,
    updatePromptVisibilityRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePromptVisibilityRequest** | **UpdatePromptVisibilityRequest**| 表示/非表示の状態 | |
| **promptId** | [**string**] | 更新対象のプロンプトID (URLパスから取得) | defaults to undefined|


### Return type

**UpdatePromptVisibility200Response**

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

# **updateSharedPromptVisibility**
> UpdateSharedPromptVisibility200Response updateSharedPromptVisibility(updateSharedPromptVisibilityRequest)

管理者用：共有プロンプトの表示/非表示を更新する ※ 管理者権限チェックはミドルウェアで実施済み

### Example

```typescript
import {
    PromptApi,
    Configuration,
    UpdateSharedPromptVisibilityRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PromptApi(configuration);

let sharedPromptId: string; // (default to undefined)
let updateSharedPromptVisibilityRequest: UpdateSharedPromptVisibilityRequest; //

const { status, data } = await apiInstance.updateSharedPromptVisibility(
    sharedPromptId,
    updateSharedPromptVisibilityRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateSharedPromptVisibilityRequest** | **UpdateSharedPromptVisibilityRequest**|  | |
| **sharedPromptId** | [**string**] |  | defaults to undefined|


### Return type

**UpdateSharedPromptVisibility200Response**

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

