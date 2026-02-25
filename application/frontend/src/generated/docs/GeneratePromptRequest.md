# GeneratePromptRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userInput** | **string** | 作成したいプロンプトの概要 | [default to undefined]
**mode** | **string** | 生成モード: step, gem, both | [default to undefined]
**stepCountMode** | **string** | Step数の決め方: auto（AIに任せる）, manual（手動指定） | [optional] [default to undefined]
**stepCount** | **number** | Step数（手動指定の場合） | [optional] [default to undefined]
**stepInstructions** | **Array&lt;string&gt;** | 各Stepの指示（手動指定の場合） | [optional] [default to undefined]
**stepDivisionPolicy** | **string** | Stepの分割方針 | [optional] [default to undefined]

## Example

```typescript
import { GeneratePromptRequest } from './api';

const instance: GeneratePromptRequest = {
    userInput,
    mode,
    stepCountMode,
    stepCount,
    stepInstructions,
    stepDivisionPolicy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
