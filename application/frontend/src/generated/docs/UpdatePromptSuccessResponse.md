# UpdatePromptSuccessResponse

プロンプト更新成功時のレスポンス型 (ここでは簡潔に、更新されたプロンプトのIDを返すことを想定)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 更新されたプロンプトのID (データベース側で生成されたID) | [default to undefined]
**message** | **string** | 成功メッセージ | [default to undefined]

## Example

```typescript
import { UpdatePromptSuccessResponse } from './api';

const instance: UpdatePromptSuccessResponse = {
    id,
    message,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
