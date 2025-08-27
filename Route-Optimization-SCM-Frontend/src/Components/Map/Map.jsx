/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "300px",
};

const center = {
  lat: 14.0583,
  lng: 108.2772,
};

const libraries = ["geometry"];

const Map = ({ selectedRoute, selectedPlan, routeColors }) => {
  const [map, setMap] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const getCoordinates = async (location) => {
    if (!window.google) return null;

    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { address: location + ", Vietnam" },
        (results, status) => {
          if (status === "OK") {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            reject(new Error(`Geocoding failed for ${location}`));
          }
        }
      );
    });
  };

  useEffect(() => {
    if (!isLoaded || !window.google) return;

    const fetchRouteCoordinates = async () => {
      try {
        let newRoutes = [];
        const bounds = new window.google.maps.LatLngBounds();

        if (selectedRoute) {
          const sourceCoords = await getCoordinates(selectedRoute.from);
          const destCoords = await getCoordinates(selectedRoute.to);

          if (sourceCoords && destCoords) {
            bounds.extend(new window.google.maps.LatLng(sourceCoords));
            bounds.extend(new window.google.maps.LatLng(destCoords));

            const directionsService =
              new window.google.maps.DirectionsService();
            const result = await directionsService.route({
              origin: sourceCoords,
              destination: destCoords,
              travelMode: window.google.maps.TravelMode.DRIVING,
            });

            newRoutes = [
              {
                id: selectedRoute.id,
                path: result.routes[0].overview_path,
                source: sourceCoords,
                destination: destCoords,
                info: selectedRoute,
                color: routeColors[selectedRoute.id],
              },
            ];
          }
        } else if (selectedPlan) {
          const routesToProcess = selectedPlan.flatMap(
            (plan) => plan.data.routes
          );

          const geocodedRoutes = await Promise.all(
            routesToProcess.map(async (route) => {
              try {
                const sourceCoords = await getCoordinates(route.from);
                const destCoords = await getCoordinates(route.to);

                return { ...route, sourceCoords, destCoords };
              } catch (error) {
                console.error(`Error geocoding route: ${route.id}`, error);
                return null;
              }
            })
          );

          newRoutes = await Promise.all(
            geocodedRoutes.filter(Boolean).map(async (route) => {
              bounds.extend(new window.google.maps.LatLng(route.sourceCoords));
              bounds.extend(new window.google.maps.LatLng(route.destCoords));

              const directionsService =
                new window.google.maps.DirectionsService();
              const result = await directionsService.route({
                origin: route.sourceCoords,
                destination: route.destCoords,
                travelMode: window.google.maps.TravelMode.DRIVING,
              });

              return {
                id: route.id,
                path: result.routes[0].overview_path,
                source: route.sourceCoords,
                destination: route.destCoords,
                info: route,
                color: routeColors[route.id],
              };
            })
          );
        }

        setRoutes(newRoutes.filter(Boolean));

        if (map && !bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: {
              top: 50,
              right: 50,
              bottom: 50,
              left: 50,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    fetchRouteCoordinates();
  }, [selectedPlan, selectedRoute, isLoaded, map, routeColors]);

  const onLoad = React.useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="w-full h-full relative">
      {!isLoaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={6}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            gestureHandling: "greedy",
            mapTypeControlOptions: {
              position: window.google?.maps?.ControlPosition?.TOP_RIGHT,
            },
            zoomControlOptions: {
              position: window.google?.maps?.ControlPosition?.RIGHT_CENTER,
            },
          }}
        >
          {routes.map((route, index) => (
            <React.Fragment key={`route-${route.id}-${index}`}>
              <Polyline
                path={route.path}
                options={{
                  strokeColor: routeColors[route.id] || "#FF0000",
                  strokeWeight: 4,
                  strokeOpacity: 1,
                  zIndex: selectedRoute?.id === route.id ? 1 : 0,
                }}
              />
              <Marker
                key={`source-${route.id}-${index}`}
                position={route.source}
                label={{
                  text: `S`,
                  color: "white",
                  fontWeight: "bold",
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
                onClick={() => setSelectedMarker(route)}
              />
              <Marker
                key={`dest-${route.id}-${index}`}
                position={route.destination}
                label={{
                  text: `D`,
                  color: "white",
                  fontWeight: "bold",
                }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
                onClick={() => setSelectedMarker(route)}
              />
            </React.Fragment>
          ))}
          {selectedMarker && (
            <InfoWindow
              position={selectedMarker.source}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h2 className="text-lg font-bold mb-2">Route Details</h2>
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Route ID:</span>{" "}
                    {selectedMarker.info.id}
                  </p>
                  <p>
                    <span className="font-semibold">From:</span>{" "}
                    {selectedMarker.info.from}
                  </p>
                  <p>
                    <span className="font-semibold">To:</span>{" "}
                    {selectedMarker.info.to}
                  </p>
                  <p>
                    <span className="font-semibold">Vehicle:</span>{" "}
                    {selectedMarker.info.vehicle}
                  </p>
                  <p>
                    <span className="font-semibold">Weight:</span>{" "}
                    {selectedMarker.info.weight}
                  </p>
                  <div className="mt-2 pt-2 border-t">
                    <p>
                      <span className="font-semibold">Travel Distance:</span>{" "}
                      {selectedMarker.info.travel_kms.toFixed(2)} km
                    </p>
                    <p>
                      <span className="font-semibold">Travel Time:</span>{" "}
                      {selectedMarker.info.travel_hours.toFixed(2)} hours
                    </p>
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default React.memo(Map);
