# Baja Land Developers - Real Estate Map App

## Architecture Overview

This is a React-based real estate mapping application (despite outdated Next.js references in README) using Create React App with Mapbox GL JS for interactive mapping. The app displays property listings and GIS parcel data for land development projects in Baja California.

**Key Technology Stack:**

- React 18 with `react-scripts` build system
- Mapbox GL JS v3.3.0 with satellite map style
- TailwindCSS for styling
- React Router with basename `/parcel-lookup` for GitHub Pages deployment

## Core Application Flow

1. **Entry Point**: `src/index.js` renders `App` component wrapped in `BrowserRouter` with custom basename
2. **Main Component**: `src/App.js` manages:
   - Map/sidebar layout with mobile toggle (`activeMobileView` state)
   - Active feature selection for modal display
   - Search integration via Mapbox SearchBox
3. **Map Component**: `src/Map/index.js` initializes Mapbox with center `[-115.989816, 30.49018]` (San Quintín area)
4. **Data Layer**: `src/Map/util.js` handles GeoJSON sources and layer configuration

## Data Patterns

**Dual Data Sources:**

- **Property Listings**: `src/data/santomas_homes.js` - Point features with real estate properties
- **Land Parcels**: `src/data/san-quinten-parcels.geojson` - Polygon/LineString features for parcel boundaries

**Feature Processing:**

- `getFeaturesInView()` filters properties with `sale_price` and adds dynamic `imageUrl` paths
- Images cycle through `demo-real-estate-popup-{0,1,2}.png` based on array index
- Property data structure: `sale_price`, `number_of_bedrooms`, `number_of_bathrooms`, `total_livable_area`, `location`

## Map Integration Specifics

**Layer Setup** (`addSourcesAndLayers`):

- Listings: Circle markers for properties
- Parcels: Fill polygons (teal, 80% opacity) + yellow stroke lines
- Uses Mapbox satellite style with 45° pitch, 90° bearing for 3D effect

**Component Communication:**

- `Marker` component wraps Mapbox GL JS markers with React `Card` components as popups
- Feature clicks trigger modal via `handleFeatureClick` → `setActiveFeature`
- Map load callback updates sidebar data via `getFeaturesInView()`

## Development Conventions

**File Organization:**

- `/src/data/` - GeoJSON and property data
- `/src/Map/` - Map-specific components and utilities

**Styling Patterns:**

- TailwindCSS with responsive design (`lg:` breakpoints)
- Mobile-first approach with map/sidebar toggle
- Card component accepts `large`, `shortImage`, `width` props for different contexts

**State Management:**

- Local React state only (no Redux/Context)
- Map instance stored in `useRef` for imperative operations
- Feature data flows: Map → App state → Sidebar cards

## Build & Development

```bash
npm start           # Development server on :3000
npm run build       # Production build
npm test            # Jest tests
```

**Deployment Notes:**

- Configured for `/parcel-lookup` subdirectory deployment
- Uses public Mapbox token (replace for production: `accessToken` in `Map/index.js`)

## GIS Data Integration

This project specifically handles:

- **Multi-layer parcel data** with different feature layers and properties
- **Coordinate system**: WGS84 (EPSG:4326) for web mapping compatibility

When adding new parcels/properties, ensure GeoJSON features include required property fields and coordinate arrays match the existing format.
