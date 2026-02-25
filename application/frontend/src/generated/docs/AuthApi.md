# AuthApi

All URIs are relative to *http://localhost:3000/api*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**verifyGoogleToken**](#verifygoogletoken) | **POST** /auth/google/verify | |

# **verifyGoogleToken**
> VerifyTokenResponse verifyGoogleToken(verifyTokenRequest)

Googleアクセストークンを検証し、IDトークンとして扱う

### Example

```typescript
import {
    AuthApi,
    Configuration,
    VerifyTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let verifyTokenRequest: VerifyTokenRequest; //

const { status, data } = await apiInstance.verifyGoogleToken(
    verifyTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyTokenRequest** | **VerifyTokenRequest**|  | |


### Return type

**VerifyTokenResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Ok |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

