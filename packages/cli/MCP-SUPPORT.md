A document that keeps track of MCP servers in the wild that have been tested and are known to work.

**A python mcp server that works off local files and `uv` to run**
https://x.com/akshay_pachaar/status/1904511566902595702

Notes: `uv` seems to be the best python package manager for running python packages.
Is there a way it can be used to hit source files over http?
e.g. `uv https://something.com/something.py` and that it knows how to compile imports etc

- Made the logger log all output to blah.log in users home directory, this needs more work to be configurable etc
- Added to the schema `bridge` with possible values so far `mcp|slop` but likely to add `source|remote` something that specifies you can just call an abritary worker url
- when env keys are missing, the cli tool should make it most well known

  {
  "name": "linkup_and_rag_example",
  "bridge": "mcp",
  "command": "uv --directory /home/ajax/repos/ai-engineering-hub/cursor_linkup_mcp run server.py"
  }

** Figma mcp example**

https://github.com/GLips/Figma-Context-MCP - deprecated
https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp

Notes:
