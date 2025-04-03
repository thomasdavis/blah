import modal

# Select the appropriate image tag
blah_image = modal.Image.from_registry("nikolaik/python-nodejs")

app = modal.App("code-interpreter")

@app.function(image=blah_image)
def run_mcp_server():
    import subprocess

    print("abstractions are so good")

    # Execute a simple Python command
    p = subprocess.run(["python", "-c", "print(1 + 1)"], capture_output=True, text=True)
    print("Python output:", p.stdout)

    # Execute a simple Node.js command
    process = subprocess.run(["node", "-e", "console.log('hello world')"], capture_output=True, text=True)
    print("Node.js output:", process.stdout)

    # Execute a simple NPX command
    process = subprocess.run(["npx", "-y", "@blahai/cli", "validate"], capture_output=True, text=True)
    print("NPX output:", process.stdout)
    print("NPX error:", process.stderr)

    print("abstractions are dayummmmm so good")

@app.local_entrypoint()
def main():
    run_mcp_server.remote()
