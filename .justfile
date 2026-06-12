# Silent Design System — task runner (https://github.com/casey/just)
# Run `just` to list recipes.

# default port for the local server
port := "8000"

# list available recipes
default:
    @just --list

# serve the design system locally (in-browser Babel needs HTTP, not file://)
serve port=port:
    @echo "Silent design system → http://localhost:{{port}}/"
    python3 -m http.server {{port}}
