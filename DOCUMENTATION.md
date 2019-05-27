# [libubsub](https://github.com/ubsub/libubsub#readme) *0.1.3*

> Library to support common ubsub functionality and authentication


### api.js


#### module.exports(userId, userKey, options) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userId | `string`  | - the user or token id | &nbsp; |
| userKey | `string`  | - the user key or token key | &nbsp; |
| options | `object`  | - {routerHost}, override default router | &nbsp; |




##### Returns


- `object`  The API client object



#### routerUrl() 








##### Returns


- `string`  The base URL to the router



#### tokenId() 








##### Returns


- `string`  The userId/tokenId the API is currently using



#### getUser() 








##### Returns


- `object`  user object for current token/user id



#### getTopicById(id) 

Retrieves the topic for the given id




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - Topic id | &nbsp; |




##### Returns


- `object`  topic object



#### getTopics() 

Get all topic objects






##### Returns


- `array`  List of all topic objects



#### getTopicByIdOrName(idOrName) 

Retrieve a topic by looking for its id first, and fail that, comparing to its name




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| idOrName | `string`  | - Topic id or name | &nbsp; |




##### Returns


- `object`  topic - Single topic



#### getTemplates() 

Get all templates associated with the user






##### Returns


- `object`  Template



#### createTopic(name, key) 

Create a new topic. Will fail on name collision




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name | `string`  | - Name of the topic to create | &nbsp; |
| key | `Boolean_string`  | - True if want key, false if not key, or string for specific key | &nbsp; |




##### Returns


- `object`  Topic



#### deleteTopic(id) 

Delete a topic




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - Delete topic by id | &nbsp; |




##### Returns


- `object`  Deletion object



#### getTemplate(id) 

Retrieve template object with id




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - Id of template | &nbsp; |




##### Returns


- `object`  Template



#### createTemplate(name, language, source) 

Create a new template




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name | `string`  | - Name of the template | &nbsp; |
| language | `string`  | - Language of template. See /docs/languages for valid types | &nbsp; |
| source | `string`  | - Source of template | &nbsp; |




##### Returns


- `object`  The template object



#### updateTemplate(id, {name, language, source}) 

Update information on template




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| id | `string`  | - Id of template to update | &nbsp; |
| {name, language, source} | `object`  | - Optional pieces to update for template | &nbsp; |




##### Returns


- `object`  template



#### createOrUpdateTemplate({id, name, language, source}) 

Helper method to update a template, or create if it doesn't exist




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| {id, name, language, source} | `object`  |  | &nbsp; |




##### Returns


- `object`  template



#### getTokens() 








##### Returns


- `array`  Returns list of all tokens present



#### createToken(name, scope, clientId) 

Create a new token




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| name | `string`  | - Name of token to create | &nbsp; |
| scope | `string`  | - Scope of token | &nbsp; |
| clientId | `string`  | - ClientId the token can be used for | &nbsp; |




##### Returns


- `object`  The token



#### getEvents(searchOpts) 

Get events given search options




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| searchOpts | `object`  | - Search options | &nbsp; |




##### Returns


- `array`  events




### middleware.js


#### validateSignature(appDomain, additionalVerifyOpts) 

Create middleware that validates `X-Router-Signature`




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| appDomain | `string`  | - Expected app domain of the JWT to pass validation (usually the domain the request is sent o) | &nbsp; |
| additionalVerifyOpts | `object`  | - additional options to pass verifier | &nbsp; |
| routerUrl&#x3D;config.ROUTER_URL | `string`  | Optional override for router url | *Optional* |




##### Returns


- `expressMiddleware`  Returns a new middleware to be used in express




### signature.js


#### new Signature() 

Class to vlidate a token in UbSub's header `X-Router-Signature`
against the router's public certificate

Public certificate is automatically retrieved and cached
Future retrievals will be pre-fetched to minimize any interruptions






##### Returns


- `Void`



#### Signature.constructor(verifyOpts, routerUrl, routerIssuer) 






##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| verifyOpts | `object`  | - Arguments passed to the JWT verifier | &nbsp; |
| routerUrl | `string`  | - Override the default router_url | &nbsp; |
| routerIssuer | `string`  | - The expected issuer of the JWT | &nbsp; |




##### Returns


- `Signature`  - A new instance of this class



#### Signature.getPublicKey() 

Retrieves the public key from the router
Will also have memoized function `getCachedPublicKey`






##### Returns


- `string`  The router's public key



#### Signature.assertValidJwt(token) 

Returns a promise in resolve/reject that respects the validity of the JWT




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| token | `string`  | - The JWT to validate | &nbsp; |




##### Returns


- `promise`  Either the parsed body of the JWT payload, or a rejection on failure




### streaming.js


#### module.exports(userId, userKey, ubsubOpts) 

Create a new streaming client for a given user or token




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| userId | `string`  | - User or token ID | &nbsp; |
| userKey | `string`  | - User or token key | &nbsp; |
| ubsubOpts | `object`  | - Optional arguments to override streaming defaults { socketHost, routerHost, reconnectOnError, reconnectOnErrorDelay } | &nbsp; |




##### Returns


- `object`  functions to be used with the given config



#### listen(topicId, onEvent) 

Listen to a given topic and pipe events through a callback




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| topicId | `string`  | - the ID of the topic to listen to | &nbsp; |
| onEvent | `function`  | - Function callback when event received (payload, metadata) | &nbsp; |




##### Returns


- `object`  the SocketIO socket



#### pipe(topicId, topicKey) 

Provide a function to quickly pipe events into an ubsub topic




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| topicId | `string`  | - the topicId to post to | &nbsp; |
| topicKey | `string`  | - Optional topic key | &nbsp; |




##### Returns


- `function`  Returns a function that can be called with an object and posted to an ubsub socket



#### forward(topicId, forwardUrl, httpOpts) 

Create a forwarding-stream that moves events from a socket to a HTTP endpoint




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| topicId | `string`  | - ID of the topic to listen to | &nbsp; |
| forwardUrl | `string`  | - HTTP url to forward events to | &nbsp; |
| httpOpts | `object`  | - Optional additional httpOpts to send axios | &nbsp; |




##### Returns


- `object`  The socket used to listen



#### send(topicId, key, data[, method&#x3D;&quot;POST&quot;]) 

Send an event to a topic




##### Parameters

| Name | Type | Description |  |
| ---- | ---- | ----------- | -------- |
| topicId | `string`  | - Topic to send to | &nbsp; |
| key | `string`  | - Topic key to authenticate against | &nbsp; |
| data | `object`  | - Data to send to the topic | &nbsp; |
| method&#x3D;&quot;POST&quot; | `String`  | What method to send to the topic with | *Optional* |




##### Returns


- `promise`  Axios promise



#### getApi() 

Gets a new API client based on the current user id and key






##### Returns


- `Client`  API Client




*Documentation generated with [doxdox](https://github.com/neogeek/doxdox).*
