# AISupportApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**generatePrompt**](#generateprompt) | **POST** /api/ai-support/generate | |

# **generatePrompt**
> GeneratePrompt200Response generatePrompt(generatePromptRequest)

AIでプロンプトを自動生成する

### Example

```typescript
import {
    AISupportApi,
    Configuration,
    GeneratePromptRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AISupportApi(configuration);

let generatePromptRequest: GeneratePromptRequest; //プロンプト生成のパラメータ

const { status, data } = await apiInstance.generatePrompt(
    generatePromptRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **generatePromptRequest** | **GeneratePromptRequest**| プロンプト生成のパラメータ | |


### Return type

**GeneratePrompt200Response**

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
|**401** | Unauthorized |  -  |
|**500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

