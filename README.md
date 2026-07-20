# BitePix
A professional browser-based image converter web application for managing image format conversions, sizing, and quality adjustments securely on-device using React, TypeScript, and Vite.

## Project Structure
```text
BitePix/
├── src/
│   ├── components/          # Reusable UI Components
│   │   ├── AuthScreen.tsx   # Login/Signup view
│   │   ├── ControlPanel.tsx # Sizing, quality, and format controls
│   │   ├── FeatureStrip.tsx # Informative highlight badges
│   │   ├── ImageDetails.tsx # Detailed table of uploaded image properties
│   │   ├── ProfileModal.tsx # Profile updates & password change modal
│   │   ├── ProgressCard.tsx # Detailed view of conversion progress
│   │   ├── ResultCard.tsx   # Progress feedback & download action card
│   │   └── UploadZone.tsx   # Drag & drop upload area with local validation
│   ├── context/             # React Context Providers for State Management
│   │   ├── AuthContext.tsx  # User sessions and LocalStorage authentication
│   │   └── ConverterContext.tsx # Converter state machine, progress and configurations
│   ├── lib/                 # Utilities and Helper Functions
│   │   └── imageUtils.ts    # File validation, size formatting, and canvas conversion logic
│   ├── App.test.tsx         # App test suite
│   ├── App.tsx              # Root component & responsive shell setup
│   ├── index.css            # Stylesheets (Vanilla CSS + Responsive design)
│   ├── main.tsx             # Vite application entry point
│   ├── types.ts             # TypeScript Type Definitions
│   └── vite-env.d.ts        # Vite environment types
├── tests/                   # End-to-End Tests
│   └── converter.spec.ts    # Integration & converter specs
├── eslint.config.js         # ESLint code style config
├── index.html               # Main HTML Document
├── package.json             # NPM package scripts and dependencies
├── playwright.config.ts     # Playwright Test Configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite Bundler configuration
```


## Features
### 1. Authentication & User Management
* User registration with validation (username min. 2 chars, password min. 4 chars)
* Secure-looking login simulation with browser session preservation via LocalStorage
* User profile management (update display name)
* Password update feature

### 2. Image Dropzone & Upload
* Drag-and-drop support for PNG, WebP, JPEG, and JPG files
* Local validation of file size (up to 50MB) and mime types
* Real-time display of original image details (name, dimensions, file size, format)

### 3. Conversion Controls
* Target format selector (supporting WebP, PNG, JPEG, JPG)
* Compression quality slider (from 1% to 100% quality range)
* Customizable output dimensions (width and height input fields)

### 4. Progress Tracking
* Real-time processing feedback (calculating percentages)
* Direct indicator showing conversion stage (Processing, Ready, Waiting, etc.)

### 5. Output & Download Management
* Generates instant preview URL for converted images
* Details showing output name, output size, format, and dimensions
* Single-click local download action with correct MIME type

## Technologies Used
* **Frontend Framework:** React (TypeScript)
* **Styling:** Vanilla CSS (Responsive & Modern aesthetics)
* **Bundler/Dev Server:** Vite
* **State Management:** React Context API
* **Routing/Simulation:** LocalStorage-backed Contexts
* **Testing:** Playwright (E2E)

## Database Setup
### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Installation Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   cd BitePix
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### LocalStorage Schema Configuration
No external database is required. The application automatically initializes and updates local storage stores within your browser:
* `bitepix_user`: Object containing active user data.
* `bitepix_users`: Array containing registered user accounts.
* `bitepix-theme`: Active theme state (`dark` or `light`).

## Building the Project
### Using NPM
```bash
# Clean and check compilation
npm run build

# Run code linting
npm run lint

# Run E2E tests
npx playwright test
```

## Running the Application
1. Start the Vite development server:
   ```bash
   npm run dev
   ```
2. Access the application in your browser:
   ```http
   http://localhost:5173/
   ```

## Default Login Credentials
Create any account using the **Sign up** tab to register and log in instantly. All user profiles and settings are saved securely inside your browser's `LocalStorage`.

## Application Actions
### Authentication View
* **Register:** Display Sign up tab and process username/password validations.
* **Login:** Verify credentials against local storage registry.
* **Logout:** Invalidate active local user session.

### Profile Actions
* **Change Username:** Update name on profile card and localStorage.
* **Change Password:** Validate original password and store updated version.

### Conversion Actions
* **Upload Image:** Load image using canvas context to measure dimensions.
* **Update Config:** Live adjustments of target quality, width, and height.
* **Process Image:** Convert image format on-device using canvas.toBlob() actions.
* **Reset Workspace:** Reset conversion parameters and release blob URL memory.

## LocalStorage Schema Structure
### Users Store (`bitepix_users`)
* `userId` (Primary Key / String UUID)
* `displayName` (Unique / String)
* `password` (String)

### Active Session (`bitepix_user`)
* `userId`
* `displayName`
* `password`

### Interface Customization (`bitepix-theme`)
* String value (e.g. `'light'` or `'dark'`)

## Supported Formats
* **PNG** (Portable Network Graphics)
* **JPEG / JPG** (Joint Photographic Experts Group)
* **WebP** (Google Image Format)

## Security Features
* **Zero-Server Processing:** Images are never sent to external servers, protecting user privacy.
* **Size Validation:** Enforces a 50MB file size limit before loading.
* **Secure Input Rules:** Strict length validations applied to registrations and password changes.
* **Object URL Revoking:** Revokes preview blobs immediately when images are swapped or removed to avoid memory leaks.

## Future Enhancements
* Backend integration (Node.js/Express & PostgreSQL/MongoDB) for persistent account sync.
* Batch image conversion support (processing multiple files sequentially).
* Add support for additional formats (AVIF, TIFF, SVG, animated GIF).
* Advanced image editing (cropping, scaling options, filters, and rotation).
* Advanced metrics and download logging dashboard.

## Troubleshooting
### Image Processing Issues
* Verify the file type is one of the supported formats.
* Check if browser memory is sufficient (large scale images on mobile may trigger crashes).
* Clear browser local storage if custom states behave unexpectedly.

### NPM Build Issues
```bash
# Update and resolve packages
npm update

# Force clean dev cache
npm run dev -- --force
```

## Performance Optimization
* Direct Canvas API implementation for efficient, zero-latency image processing.
* Memory management using URL.revokeObjectURL to automatically reclaim unused browser memory.
* High-performance components memoized via `React.memo` to eliminate unnecessary rendering ticks.

## License
This project is open source and available under the MIT License.

## Author
Developed by: Fahad (Replicated for BitePix)

## Support
For issues and questions, please refer to the documentation or contact support.

## Deployment Checklist
- [x] npm packages resolved and built successfully
- [x] TypeScript compiler checks verified
- [x] Responsive layout styling complete
- [x] LocalStorage authentication working
- [x] Drag & drop upload zone active
- [x] Real-time image detail rendering verified
- [x] Canvas processing and scaling fully operational
- [x] Single-click download functional
