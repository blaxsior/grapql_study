# graphql study
graphql을 공부하는 목적으로 만든 레포지토리입니다.  
유튜브에 게시되어 있는 튜토리얼 영상, graphql 공식 문서나 apollo 문서를 통해 공부.  
node 코드는 영상의 도움을 많이 받았고, 기본적인 개념은 공식 문서를 통해 습득.
- 튜토리얼 영상: https://www.youtube.com/playlist?list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f
- graphql 공식문서: https://graphql.org/
- apollo 공식문서: https://www.apollographql.com/docs/

## 튜토리얼과의 차이점
- deprecated 라이브러리 대체:  
express-graphql 라이브러리를 사용하고 있으나, 현재 시점에서 해당 라이브러리는 depricated 상태이므로 대신 graphql-http 라이브러리를 이용.  
- graphiql 개별적으로 설정:  
graphql-http의 경우 [graphiql](https://www.npmjs.com/package/graphiql)을 직접 지원하지 않으므로, vite 기반 react-ts 프로젝트에서 [@graphiql/toolkit](https://www.npmjs.com/package/@graphiql/toolkit)와 함께 설치, vite 플러그인 설정에서 로컬 서버에 대해 프록시를 설정하여 연동.  
- mongoose 대신 prisma와 연동:  
DBMS로 mongodb을 사용하는 것은 동일하나, mongoose 대신 prisma을 이용하여 테이블 설정 등에 필요한 작업을 줄이고, mongodb 대신 다른 DBMS을 사용하게 되는 경우를 대비.
- typescript을 이용:  
typescript 및 ```prisma generate``` 명령을 통해 각 오브젝트 타입에 대한 타입 선언을 획득하고 이용함으로써 구체적인 형식을 알 수 있으므로 작업이 javascript 환경보다 편리.
---
## graphql 이해한 점
- graphql은 클라이언트와 서버가 통신하기 위한 프로토콜(인터페이스)로, 클라이언트와 서버가 통신하기 위한 인터페이스(또는 프로토콜)을 지정한다.
- 서버에서는 지정된 graphql query, mutation 등에 대해 resolve 함수 내용을 채우면서 데이터베이스와 graphql로 정의된 타입, 쿼리 등을 연결한다.

rest api 등 기존의 주소 기반 접근 방식을 사용하는 경우 서로 다른 데이터 종류에 대해 다른 주소를 할당한다. 책의 id, name 리스트를 요구하는 경우를 ```/books```라고 지정한다면, 특정 책의 설명까지 필요한 경우는 ```/book/$id/detail``` 같은 경로로 데이터를 받는 것이 자연스럽다. author라면 ```/author/$id``` 형식을 띌 가능성이 높다. 정형화된 구조를 가지는 경우 rest api은 좋은 방법이다.  

요청하는 데이터의 종류가 다양하거나 동적으로 바뀌는 경우 graphql이 우세를 보인다. 예를 들어 author와 해당 작가가 집필한 book 목록을 받고 싶은 경우 rest api 기반 환경에서는  ```/author``` 및 ```/books/$authorId``` 엔드포인트로 2번의 http 통신을 수행해야 한다. 만약 해당 책을 빌린 사람들의 정보까지 필요로 한다면 또 다른 엔트리 포인트가 필요할 것이다. 이 상황에서 http 통신 횟수를 줄이려면 관련된 로직을 처리하는 새로운 엔트리 포인트가 필요하다. 즉, 규모가 커질수록 엔드포인트가 증가하여 관리하기 어려워지는 문제가 발생할 수 있다. 

graphql을 사용하면 ```/graphql```이라는 하나의 엔트리 포인트만으로도 여러 요청 정보를 한번에 가져올 수 있으며, 각 상황에서 꼭 필요한 데이터만 제공하기 좋다. 

다만 파일 전송 같은 경우는 명세가 따로 없으므로 이 경우에는 기존 방식을 사용하거나 url-encoded 형식으로 받는 등 대안을 찾아야 한다. 또한 단일 엔트리포인트를 사용하여 캐싱이 제대로 수행되지 않으므로 별도의 캐싱 방법이 요구된다.

---
## scalar type
일반적인 프로그래밍 언어의 primitive type에 대응된다.
- Int: 32비트 정수
- Float: 부동 소수점 실수
- String: UTF-8 문자열
- Boolean: true / false
- ID: 특정 객체를 식별할 때 사용되는 값을 의미하며, 문자열로 저장
### custom scalar
사용자가 새로운 스칼라 값을 만들 수도 있다.  
서버에서 해당 스칼라에 대한 동작을 정의해야 정상 동작한다.
```
scalar Date 
```
GraphQLScalarType으로 구현된다.
- serialize: 클라이언트에게 보내는 값 지정
- parseValue: 사용자의 데이터를 JSON에서 파싱
- parseLiteral: 사용자가 하드코딩한 리터럴을 파싱

## object type & fields
```graphql
type Book {
    id: ID!
    name: String
    genre: String
    authorId: ID
}
```
Book 타입에 id, name, genre, authorId라는 필드 선언.  
```!``` 을 붙여 필수 값임을 표현 가능. 기본 설정은 optional.

## 스키마
```
schema {
    query: Query
    mutation: Mutation
}
```
스키마는 query는 필수로, mutation은 선택적으로 가짐.  
이 둘은 위 설명한 오브젝트 타입 중 특별한 경우에 해당.  
엔트리 포인트라는 역할을 제외하면 일반 object type과 동일하게 동작.
### query
전체 쿼리의 진입점(entry point) 역할을 수행.
```graphql
type Query {
    book(id: ID!): Book
    books: [Book]
    author(id: ID!): Author
    authors: [Author]
}
```
위처럼 쿼리로 정의되어 있어야 외부에서 접근 가능.  
### mutation
변경 사항이 발생할 때 사용
```graphql
type Mutation {
    addAuthor(name: String!, age: Int!): Author
    addBook(name: String!, genre: String!, authorId: ID!): Book
}
```
mutation 역시 query처럼 일반적인 object type에 속함.  
대신 값 변경에 대한 엔트리 포인트 역할을 수행.  

