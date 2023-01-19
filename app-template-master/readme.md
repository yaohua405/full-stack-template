<div style="text-align:center">

# AppStack

This Template should compile into a server.js NodeJS app that serves the ReactJS WebApp static files as well as functioning as the API of the application.

Bundling a Full-Stack Application that includes API/WebApp/DB along with unit/integration tests, and their respective documentation.

Developers type `yarn compose` and have Server/DB ready to answer on local machine.

To create the simplest template imaginable while also utilizing powerful and carefully picked concepts/libraries.

I imagine the test of time will let me know what works and what doesn't but I plan to do the most research and only include the reasonable bits.

</div>

---

## The argument for a reasonable DBMS

I've been in the DB search for more than a year now and I think I've hit a milestone tonight.

Initially PostgresSQL/Prisma was implemented, but it's incredibly messy to manage RDBMS's, it's that R right before the DBMS that fucks up things, so after much deliberation a decision on CouchDB was made [Comparison](https://db-engines.com/en/system/ArangoDB%3BCouchDB%3BCouchbase%3BRethinkDB).

Deciding that HTTP's resource based query language + the eventual consistency of CouchDB + CouchDB's unmatched documentation make it a clear winner as a future proof DBMS.

This gives your API a range of control it wouln't otherwise have, control over data structure that simplifies every headache a relational system has, the Relational SQL Black Box is broken as soon as you realize it's a (Data Handling + Relational service). If you only needed the Data handling part and wanted explicit control over the Relational that's where the other DB's (like CouchDB) come in.

**KISS is the definition of future proof concepts**

---

## The argument for a reasonable DBMS/API/Validation/TypeChecking Source of Truth

Obviously throwing out the Relational part on traditional DB's would require us to structure our data somehow. In RDBMS we had 1. Schema on DB for relation/type checking 2. Schema on API 3. Schema on client. This is only to mean that any change on the schema would have to change on 3 places, at the very least 2 places with RDBMS. This coupling between R and DBMS doesn't allow for the modularity any other system taking charge of only data would and brings lots of overhead for the agile development process of today.

What we need is a souce of truth residing outside the DB that allows us to store more data about these models, all the extra complexity/code the API would provide on top of the basic model on RDBMS can now all be in one place, all together with the model. Gone are the days of ambiguous definitions in multiple places that have to me mirrored etc... the tight integration between the API and DB will allow the API to be the extensible and programmable relational powerhouse the R in RDBMS used to be without all its drawbacks.

Yes, I'm talking about having a model/validation/api-interaction all defined in the same place, any extra transformations on top of properties/models if heavy in processing will be referenced as a function outside of it. I have an idea here so let's expand on it a bit more:

Kind of like this:

```
const note_schema = {
   type: 'object',
   properties: {
     name: {type: 'string'},
   },
   required: ['name'],
 } as const

const user_schema = {

}
```

<!-- This schema would follow [RFC8927](https://datatracker.ietf.org/doc/rfc8927/), a simpler explanation here [JSON Type Definition (JTD)](https://ajv.js.org/json-type-definition.html#jtd-schema-forms). -->

<div style="text-align:center">

## [JSON Schema Org](json-schema.org)

</div>

### RFC8927 Abstract

```
This document proposes a format, called JSON Type Definition (JTD), for describing the shape of JavaScript Object Notation (JSON) messages.  Its main goals are to enable code generation from schemas as well as portable validation with standardized error indicators. To this end, JTD is intentionally limited to be no more expressive than the type systems of mainstream programming languages.  This intentional limitation, as well as the decision to make JTD schemas be JSON documents, makes tooling atop of JTD easier to build.
```

<!-- We'd then extend/fine-grain this defintion to include things like Authorization, client/server model exposures, or transformations between those domains. -->
```
Client  <->   API          <->  DB
TS            TS/JTD            JSON
```
Point is clients only have access to Typescript defintions which 'should' be enough for them to build an accurate representation of data.

Meaning if JTD changes on server, client code using that data won't compile unless the data being sent to server is guranteed to succeed (AJV will gurantee this).

Typescript should only 'help' client/server code be autocompleted/compiled correctly and should only be defined in server as a help to client/server code. Aside from that JTD should easily be transpiled to anything that better describes the data if Typescript won't cut it.

**Source of truth should always be the most descriptive, limiting representations should always stem/be-a-transformation from/of truth, if done backwards there will always be inconsistencies since what's consistent in limiting representations won't be the truth**

---

## A good coding structure

Definition of a good structure/practicing these principles is always prone to the test of time as I myself will find more efficient methods. So the most I can do is document these methods as I go through this process. I already have something I've come up with, we'll call it version 1:

### V - 0.1
- A JTD defintion for database data, then another one for client interface that is encourage to reuse/refine database's JDT.
```

```

---

<div style="text-align:center">

## TODO

</div>

- Main

  - [ ] Main Page (Short intro into the App's purpose)
    - [ ] Docs Main -> (Api/UI docs for developers)
  - [x] Docker
    - [x] Image Server -> (App is packaged into an image)
    - [x] Image DB -> (DB is packaged into an image)
    - [x] Compose Develop -> (App is spun up, along with DB with Docker Compose)

- Server (Api)
  - [x] Bundle -> (webpack builds correctly)
  - [x] DB ()
    - [x] Connector -> (Prisma set up to handle DB schema/migrations)
    - [x] Docker -> (Docker compose correctly spins up a DB)
  - [ ] Docs Endpoints / GraphQL -> (Documentation is created for Endpoints)
  - [ ] Test -> (test environemnt is set up/working)
- App
  - [x] Bundle -> (webpack builds correctly)
  - [ ] Docs Components -> (documentation for all components is compiled/served)
  - [ ] Test -> (test environemnt is set up/working)
