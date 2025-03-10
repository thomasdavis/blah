# BLAH - Barely Logical Agent Host

requirements of a mcp registry;

- CREDIT LISA AND WOMBAT
- infrastructure code is ALL opensource
- any system (such as ide's) should be able to connect to it
- agentic systems should support 0, 1 or INFINITY
  - tool selection / tool rag search
- a registry that does not have malaligned incentives
  - how has npm lasted this long? look at other package managers
- speak of agent behavior (parallelism, recursive, branching, sequential, graph theory, sets of steps)
- status checking monitoring of mcp servers
- someone has to foot the bill
  - the big cloud providers can, but they at best get a mention on the README, no influence over the integerity of the project, contractual bound if necessary
- language agnostic fo sure bitches
- signing release of mcp servers
  - not mandatory, the user can use unsigned things
- currently used valtown because I cannot be fucked building the registry
  - how to build a sandbox, is deno the answer?
- systems need to make documentation EXPLICIT about how they invoke tools, it doesn't have to be, but it should be
- a tool at the end of the day is a function, but, that function, could be string of code, could be a restful endpoint, could be a local file, could be a standard manifest e.g. slop or agents.json #THISNEEDSALOTMORETHOUGHT
- tool search
  - usage agregation so the server can make informed decisions
  - the actor should HOPEFULLY return the reasoning
    - store that all on a public api
- scope / resource / templates ?
  - uri's
  - versioning
  - forking
- cron?
  - scheduled agents
  - likely outside of scope
- i don't want to steward this (figure that out)
- arbiter / actor / executor / magician
- accountability ?!?!? BE AUTISTIC (dangerous ideas are safe in civil minds)
  - the registry will obey local laws
  - put the stack trace on the blockchain (jokes but logs are important)
- inspired by keybase
- support of protocols/standards

  - slop
  - agents.json
  - needs converters

- tags (category is limiting)

  - #TOOLBELT
  - UX
    - No one cares if they have a list of six million tools
    - It has to be semanticaly navigable
    - metadata
    - UX, character profiling
      - these are ideas for the actors though

- valtown is going to be the registry storage/backend/free-compute for now, wrapped, but maybe someone should build a valtown alternative focused on solving this problem only
- blah somewhat needs it's own manifest e.g. blah.json
  - this file can exist anywhere, project workspace, home directory, hosted in the cloud, a gist or ipfs
- probably need to release a cli tool e.g. blah-cli

  - blah commands
    - blah publish
    - blah search
    - blah install
    - blah remove
    - blah update
    - blah list
    - blah info
    - blah config
    - blah login
    - blah logout
    - blah whoami
    - blah version
    - blah help

- need to build a website

  - can't be fucked, README will be good enough

- need to figure out this projects relationship to mcp
  - it implments an mcp server
  - currently no standard/schema, ahh there should be, blah.json requires a schema
    - the schema should be first principles, everything written after this point should be capable of being rebuilt and run up by anybody. (centralization is inevitable though)
-

## Crazy ideas

- share user behavior, and recommend tools to users who are similar

TODO

- [ ] host the mcp server on workers (cf)
- [ ] webpage example for running on
- [ ] make debugging / developer experience at the frontier (DX)
- [ ] make a tool that can create a tool
