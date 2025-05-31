## Quick Start

1. **Navigate to project directory:**
   ```bash
   cd /Project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to `http://localhost:3000`

### Path Alias Issues
- The project uses both `@/` aliases and relative imports
- If `@/` doesn't work, relative imports should function correctly
- All imports have been configured to work with relative paths

## Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components  
├── services/               # API services
├── hooks/                  # Custom Hook
└── types/                  # TypeScript types
```