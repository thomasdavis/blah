A document that keeps track of MCP servers in the wild that have been tested and are known to work.

- A python mcp server that works off local files and `uv` to run
  https://x.com/akshay_pachaar/status/1904511566902595702

Notes: `uv` seems to be the best python package manager for running python packages.
Is there a way it can be used to hit source files over http?
e.g. `uv https://something.com/something.py` and that it knows how to compile imports etc
