# SubscriptionInfo

契約情報のレスポンス型

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 契約タイプ: \&#39;individual\&#39;（個人）または \&#39;corporate\&#39;（法人） | [default to undefined]
**planCode** | **string** | プランコード（例: \&#39;free\&#39;, \&#39;basic\&#39;, \&#39;premium\&#39;, \&#39;corporate_standard\&#39;） | [default to undefined]
**planName** | **string** | プラン名（例: \&#39;フリープラン\&#39;, \&#39;ベーシックプラン\&#39;） | [default to undefined]
**status** | **string** | 契約ステータス: \&#39;trial\&#39;, \&#39;active\&#39;, \&#39;past_due\&#39;, \&#39;cancelled\&#39; | [default to undefined]
**features** | **{ [key: string]: any; }** | Construct a type with a set of properties K of type T | [default to undefined]
**maxUsers** | **number** | 最大ユーザー数（法人のみ。-1 または null は無制限） | [default to undefined]
**maxSharedPrompts** | **number** | 共有プロンプト作成上限数（-1 または null は無制限） | [default to undefined]
**nextBillingDate** | **string** | 次回請求日（個人契約のみ） | [optional] [default to undefined]
**isCancelScheduled** | **boolean** | 解約予約中かどうか | [default to undefined]
**organizationName** | **string** | 法人名（法人契約の場合） | [optional] [default to undefined]

## Example

```typescript
import { SubscriptionInfo } from './api';

const instance: SubscriptionInfo = {
    type,
    planCode,
    planName,
    status,
    features,
    maxUsers,
    maxSharedPrompts,
    nextBillingDate,
    isCancelScheduled,
    organizationName,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
