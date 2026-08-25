# Shopify Integration

## REST API Deprecation Notice

The Shopify REST Admin API is being deprecated. All new integrations should use the GraphQL Admin API instead.

However, **Shopify webhooks will continue to use the REST schema** for their payloads. This means that even though this package favours GraphQL for outbound requests, the REST type definitions are still needed to process incoming webhook payloads.

## Type Definitions

The REST types are kept for webhook payload handling. They are required for:

- Order webhooks (orders/create, orders/updated, orders/cancelled, etc.)
- Product webhooks (products/create, products/update, products/delete)
- Customer webhooks
- Other webhook events Shopify sends to your webhook endpoint
